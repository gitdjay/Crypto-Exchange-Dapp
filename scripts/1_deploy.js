async function main() {
	console.log('Preparing deployment...\n')

	// Fetch contract to deploy
	const Token = await ethers.getContractFactory('Token')
	const Exchange = await ethers.getContractFactory('Exchange')

	const accounts = await ethers.getSigners()

	console.log(`Accounts fetched: \n${accounts[0].address}\n${accounts[1].address}\n`)

	// Deploy contract
	const xeej = await Token.deploy('XeeJay', 'XEEJ', '1000000')
	await xeej.deployed()
	console.log(`XEEJ deployed to: ${xeej.address}`)

	const mETH = await Token.deploy('mETH', 'mETH', '1000000')
	await mETH.deployed()
	console.log(`mETH deployed to: ${mETH.address}`)

	const mDAI = await Token.deploy('mDAI', 'mDAI', '1000000')
	await mDAI.deployed()
	console.log(`mDAI deployed to: ${mDAI.address}`)

	const exchange = await Exchange.deploy(accounts[1].address, 10)
	await exchange.deployed()
	console.log(`Exchange deployed to: ${exchange.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});