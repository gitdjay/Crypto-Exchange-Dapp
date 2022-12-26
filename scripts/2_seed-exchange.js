const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  
  const accounts = await ethers.getSigners()

  const XEEJ = await ethers.getContractAt('Token', '0x5FbDB2315678afecb367f032d93F642f64180aa3')
  console.log(`Dapp Token fetched: ${XEEJ.address}`)

  const mETH = await ethers.getContractAt('Token', '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')
  console.log(`Dapp Token fetched: ${mETH.address}`)

  const mDAI = await ethers.getContractAt('Token', '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0')
  console.log(`Dapp Token fetched: ${mDAI.address}`)

  const exchange = await ethers.getContractAt('Exchange', '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9')
  console.log(`Exchange fetched: ${exchange.address}`)

  const sender = accounts[0]
  const receiver = accounts[1]
  let amount = tokens(10000)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
