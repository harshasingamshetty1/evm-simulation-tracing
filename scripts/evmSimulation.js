const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Forking mainnet
  await hre.network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          //Using a public RPC url
          jsonRpcUrl: "https://eth.llamarpc.com",
          blockNumber: 20248257, // latest block num
        },
      },
    ],
  });

  // Deploying a simple contract
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.deployed();
  console.log("SimpleStorage deployed to:", simpleStorage.address);

  // sending transction
  const tx = await simpleStorage.setValue(777);
  const receipt = await tx.wait();
  console.log("🚀 ~ main ~ receipt:", receipt);

  const trace = await hre.network.provider.send("debug_traceTransaction", [
    receipt.transactionHash,
  ]);

  console.log("Transaction trace:");
  trace.structLogs.forEach((step, index) => {
    console.log(`Step ${index}:`);
    console.log(`  Opcode: ${step.op}`);
    console.log(`  Gas cost: ${step.gasCost}`);
    console.log(`  Stack: [${step.stack.join(", ")}]`);
    // console.log(`  Memory: ${step.memory.join("")}`);
    if (step.op === "SSTORE") {
      console.log(
        `  Storage update - Key: ${step.stack[step.stack.length - 1]}, Value: ${
          step.stack[step.stack.length - 2]
        }`
      );
    }
  });

  // Verification
  const newValue = await simpleStorage.getValue();
  console.log("\n New value in contract:", newValue.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
