import { BigNumber } from "ethers";
import hre from "hardhat";

    // get an balance of an account
    async function getBalance(address: string){
        const balanceBigInt = await hre.waffle.provider.getBalance(address);
        return hre.ethers.utils.formatEther(balanceBigInt);
    }    

    // print account balances
    async function printBalances(addresses: string[]){
        let idx = 0;
        for(const address of addresses){
            console.log(`Addresses ${idx} balance: `, await getBalance(address));
            idx++
        }
    }

    // print notes left by funders
    async function printNotes(notes: {from: string, timestamp: BigNumber, name: string, message: string}[]){
        for (const note of notes){
            const timestamp = note.timestamp;
            const funder = note.name;
            const funderAddress = note.from;
            const message = note.message;
            console.log(`At ${timestamp}, ${funder}(${funderAddress}) said: "${message}"`);
        }
    }
    
async function main() {
    const [owner, funder, funder2, funder3] = await hre.ethers.getSigners()

    // get contract and deploy
    const FundMe = await hre.ethers.getContractFactory("FundMe");
    const fundMe = await FundMe.deploy();
    await fundMe.deployed()
    console.log(`FundMe was deployed to: ${fundMe.address}`)

    // check balance before funding the account
    const addresses = [owner.address, funder.address, fundMe.address];
    console.log("== start ==");
    await printBalances(addresses);

    // fund the owner some eth
    const tip = {value: hre.ethers.utils.parseEther("1")};
    await fundMe.connect(funder).fund("Kenny", "Good job, keep pushing bro", tip);
    await fundMe.connect(funder2).fund("Taiwo", "Nice job", tip);
    await fundMe.connect(funder3).fund("Dayo", "Securing the bag bro", tip);

    // check balance after funding
    console.log("== Got some funding ==");
    await printBalances(addresses);

    // Read all notes left for the owner
    console.log("== notes ==")
    const notes = await fundMe.getNotes();
    printNotes(notes)

    // current balance before withdrawal
    const contractBalance =  await getBalance(fundMe.address)
    console.log("== balance before withdrawal ==")
    console.log(`current balance of contract is: ${contractBalance}`)

    // withdraw
    console.log("== withdraw ==")
    if(contractBalance != "0.0"){
        console.log("withdrawing funds...")
        const withdrawal = await fundMe.withdrawFunds()
        await withdrawal.wait();
    }else {
        console.log("No fund to withdraw");
    }

    // check ending balance
    console.log("== ending balance ==")
    console.log(`ending balance of contract is: ${await getBalance(fundMe.address)}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

