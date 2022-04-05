import { toUtf8Bytes, keccak256, formatBytes32String, hexlify } from "ethers/lib/utils";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Property } from "../typechain";

describe("Property", function () {
  let property: Property;  
  let admin: string;
  let mockUser: string;

  before(async () => {
    const namedAccounts = await getNamedAccounts();
    admin = namedAccounts.admin;
    mockUser = namedAccounts.mockUser;

    await deployments.fixture(["Property"]);
    property = await ethers.getContract("Property", admin);    
  });

  describe("Test", () => {
    it("test", async () => {

      await property.addActiveProperty(formatBytes32String('1'), 
      {
        Id: formatBytes32String('1'),
        cadastralNumber: "1.1.1",
        estimatedValue: 1_000_000,
        purchaseDate: new Date().toISOString(),
        purchaseAmount: 500_000,
        shareOfPropertyInPct: 20,
        soldAmount: 0,
        status: 0
      })      
      await property.setPropertyAsSold(formatBytes32String('1'), 1_000_000);      
    });    
  });
});
