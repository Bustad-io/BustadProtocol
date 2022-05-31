// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./BustadToken.sol";
import "./interfaces/ISwap.sol";

abstract contract IERC20Extended is IERC20 {
    function decimals() public view virtual returns (uint8);
}

contract Crowdsale is Context, ReentrancyGuard, AccessControl, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20Extended;

    BustadToken public bustadToken;
    ISwap public swap;    

    address payable public wallet;
    address public treasury;
    address public swapToToken;

    bytes32 public constant MAINTAINER_ROLE = keccak256("MAINTAINER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    mapping(address => bool) acceptedStableCoins;

    uint256 public weiRaised;
    uint256 public rate;

    event TokensMinted(
        address indexed purchaser,
        uint256 value,
        uint256 amount
    );

    event AddAcceptedStableCoin(address indexed coinAddress);
    event RemoveAcceptedStableCoin(address indexed coinAddress);

    constructor(
        address payable _wallet,
        address _treasury,
        address _swapToToken,
        BustadToken _bustadToken,
        ISwap _swap,
        uint256 _initialRate,
        address[] memory _acceptedStableCoins
    ) {
        require(_wallet != address(0), "Wallet is the zero address");
        require(_treasury != address(0), "Treasury is zero address");
        require(_swapToToken != address(0), "SwapToToken is the zero address");
        require(
            address(_bustadToken) != address(0),
            "bustadToken is the zero address"
        );
        require(_initialRate > 0, "Rate cannot be 0");

        wallet = _wallet;
        bustadToken = _bustadToken;
        rate = _initialRate;
        swap = _swap;
        treasury = _treasury;
        swapToToken = _swapToToken;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _initializeAcceptableStableCoin(_acceptedStableCoins);
    }

    receive() external payable {}

    function buyTokensWithETH() external payable nonReentrant whenNotPaused {
        address beneficiary = msg.sender;

        _preValidatePurchase(beneficiary, msg.value);

        uint256 swappedCoinAmount = _swapETH(msg.value);
        uint256 swapped18BasedAmount = _fromCoinAmount(
            swappedCoinAmount,
            IERC20Extended(swapToToken)
        );

        _forwardAndMint(
            swappedCoinAmount,
            swapped18BasedAmount,
            beneficiary,
            IERC20(swapToToken)
        );
    }

    function buyTokensWithStableCoin(
        uint256 amount18based,
        address stableCoinAddress
    ) external nonReentrant whenNotPaused {
        require(
            acceptedStableCoins[stableCoinAddress] == true,
            "Token not accepted"
        );

        IERC20Extended coin = IERC20Extended(stableCoinAddress);

        address beneficiary = msg.sender;

        _preValidatePurchase(beneficiary, amount18based);

        uint256 coinAmount = _toCoinAmount(amount18based, coin);

        coin.safeTransferFrom(beneficiary, address(this), coinAmount);

        _forwardAndMint(coinAmount, amount18based, beneficiary, coin);
    }    

    function setRate(uint256 newRate) external onlyRole(MAINTAINER_ROLE) {
        rate = newRate;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function addAcceptedStableCoin(address _stableCoin)
        external
        onlyRole(MAINTAINER_ROLE)
    {
        acceptedStableCoins[_stableCoin] = true;
        emit AddAcceptedStableCoin(_stableCoin);
    }

    function removeAcceptedStableCoin(address _stableCoin)
        external
        onlyRole(MAINTAINER_ROLE)
    {
        acceptedStableCoins[_stableCoin] = false;
        emit RemoveAcceptedStableCoin(_stableCoin);
    }

    function estimateMintAmountWithETH(uint256 amount)
        external
        returns (uint256)
    {
        uint256 estimatedSwap = swap.estimateETHSwap(amount, swapToToken);

        uint256 estimatedCoinAmountSwap = _fromCoinAmount(
            estimatedSwap,
            IERC20Extended(swapToToken)
        );

        uint256 amountToMint = _getTokenAmount(estimatedCoinAmountSwap);
        uint256 mintingFee = bustadToken.calculateMintingFee(amountToMint);

        return amountToMint - mintingFee;
    }

    function estimateMintAmountWithStableCoin(uint256 amount)
        external
        view
        returns (uint256)
    {
        uint256 amountToMint = _getTokenAmount(amount);
        uint256 mintingFee = bustadToken.calculateMintingFee(amountToMint);
        return amountToMint - mintingFee;
    }

    function setSwapToToken(address _bustadToken)
        external
        onlyRole(MAINTAINER_ROLE)
    {
        swapToToken = _bustadToken;
    }

    function isAcceptableStableCoin(address coin) external view returns (bool) {
        return acceptedStableCoins[coin];
    }
 
    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        virtual
    {
        require(
            beneficiary != address(0),
            "Crowdsale: beneficiary is the zero address"
        );
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    }

    function _forwardAndMint(
        uint256 coinAmount,
        uint256 amount18based,
        address beneficiary,
        IERC20 withToken
    ) private {
        _forwardToken(coinAmount, withToken);

        uint256 amountToMint = _getTokenAmount(amount18based);

        _mint(beneficiary, amountToMint);

        weiRaised = weiRaised.add(amount18based);

        emit TokensMinted(_msgSender(), amount18based, amountToMint);        
    }

    /**     
     * @param weiAmount Value in wei to be converted into amountToMint
     * @return Number of amountToMint that can be purchased with the specified _weiAmount
     */
    function _getTokenAmount(uint256 weiAmount) private view returns (uint256) {
        return weiAmount.mul(rate) / 1 ether;
    }

    /**
     * @dev Determines how ETH is stored/forwarded on purchases.
     */
    function _forwardToken(uint256 amount, IERC20 tokenToForward) private {
        tokenToForward.transfer(address(wallet), amount);
    }

    function _mint(address to, uint256 tokenAmount) private {
        bustadToken.mint(to, tokenAmount);
    }

    function _swapETH(uint256 amount) private returns (uint256) {
        return swap.swapETH{value: amount}(swapToToken);
    }    

    function _initializeAcceptableStableCoin(address[] memory addresses)
        private
    {
        for (uint8 i = 0; i < addresses.length; i++) {
            acceptedStableCoins[addresses[i]] = true;
            emit AddAcceptedStableCoin(addresses[i]);
        }
    }

    /**
     * @dev Converts from 18 based decimal system to another coins decimal value.
     * Ex. USDC has decimal = 6, and needs to be treated as such.
     * @param amount original amount in wei
     * @param coin coin with decimal value
     */
    function _toCoinAmount(uint256 amount, IERC20Extended coin)
        private
        view
        returns (uint256)
    {
        return (amount / 1e18) * (10**coin.decimals());
    }

    /**
     * @dev Converts back to 18 based decimal system.
     * Ex. USDC has decimal = 6, and needs to be treated as such.
     * @param coinAmount amount based on the coin's decimal
     * @param coin coin with decimal value
     */
    function _fromCoinAmount(uint256 coinAmount, IERC20Extended coin)
        private
        view
        returns (uint256)
    {
        return (coinAmount / (10**coin.decimals())) * 1e18;
    }
}
