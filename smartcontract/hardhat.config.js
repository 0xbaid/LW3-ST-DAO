require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    georli: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.GEORLI_PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};
