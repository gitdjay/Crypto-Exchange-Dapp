const { expect } = require('chai')
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Token", () => {
	let token

	beforeEach(async() => {
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('XeeJay Token', 'XEEJ', 1000000)
	})

	it("has correct name", async() => {
		expect(await token.name()).to.equal("XeeJay Token") 
	})

	it("has correct symbol", async() => {
		expect(await token.symbol()).to.equal("XEEJ") 
	})

	it("has correct decimals", async() => {
		expect(await token.decimals()).to.equal("18") 
	})

	it("has correct supply", async() => {
		const value = tokens('1000000')
		expect(await token.totalSupply()).to.equal(value) 
	})
}) 
