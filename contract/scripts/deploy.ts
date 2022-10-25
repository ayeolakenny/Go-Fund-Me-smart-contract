import hre from "hardhat";

async function main() {
  const FundMe = await hre.ethers.getContractFactory("FundMe");
  const fundMe = await FundMe.deploy()
  await fundMe.deployed();
  console.log(`Go fund me contract deployed at ${fundMe.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
