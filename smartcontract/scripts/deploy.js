// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const { CRYPTODEVS_NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  const fakeNftContract = await ethers.getContractFactory("FakeNFTMarketplace");
  const deployedFakeNftContract = await fakeNftContract.deploy();
  await deployedFakeNftContract.deployed();

  console.log(
    "FakeNFTMarketplace deployed to: ",
    deployedFakeNftContract.address
  );

  const cryptoDevsDaoContract = await ethers.getContractFactory(
    "CryptoDevsDao"
  );
  const deployedDaoContract = await cryptoDevsDaoContract.deploy(
    deployedFakeNftContract.address,
    CRYPTODEVS_NFT_CONTRACT_ADDRESS,
    {
      // This assumes your account has at least 1 ETH in it's account
      // Change this value as you want
      value: ethers.utils.parseEther("0.5"),
    }
  );
  await deployedDaoContract.deployed();
  console.log("CryptoDevsDAO deployed to: ", deployedDaoContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
