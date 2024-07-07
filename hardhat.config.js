require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        //This is a public RPC url
        url: "https://eth.llamarpc.com",
        blockNumber: 20248257, // latest block num
      },
    },
  },
};
