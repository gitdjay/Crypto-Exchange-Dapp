const config = require('../src/config.json');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
  const milliseconds = seconds*1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
  
  const accounts = await ethers.getSigners()

  const {chainId} = await ethers.provider.getNetwork()
  console.log('Using chainId:', chainId);

  const XEEJ = await ethers.getContractAt('Token', config[chainId].XEEJ.address)
  console.log(`XEEJ Token fetched: ${XEEJ.address}\n`)

  const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
  console.log(`mETH Token fetched: ${mETH.address}\n`)

  const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
  console.log(`mDAI Token fetched: ${mDAI.address}\n`)

  const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
  console.log(`Exchange fetched: ${exchange.address}\n`)

  const sender = accounts[0]
  const receiver = accounts[1]
  let amount = tokens(10000)

  let transaction, result
  transaction = await mETH.connect(sender).transfer(receiver.address, amount);
  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000)

  transaction = await XEEJ.connect(user1).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} XEEJ from ${user1.address}\n`)

  transaction = await exchange.connect(user1).depositToken(XEEJ.address, amount)
  await transaction.wait()
  console.log(`Deposted ${amount} XEEJ from ${user1.address}\n`)

  transaction = await mETH.connect(user2).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} mETH from ${user2.address}\n`)

  transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
  await transaction.wait()
  console.log(`Deposted ${amount} mETH from ${user2.address}\n`)

  let orderId
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), XEEJ.address, tokens(5))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  orderId = result.events[0].args.id
  transaction = await exchange.connect(user1).cancelOrder(orderId)
  result = await transaction.wait()
  console.log(`Cancelled order from ${user1.address}\n`)

  await wait(1)
  // console.log('Waited 1 sec}

  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), XEEJ.address, tokens(5))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  await wait(1)

  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), XEEJ.address, tokens(15))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  await wait(1)

  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), XEEJ.address, tokens(20))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  await wait(1)

  // Open orders

  // User 1 makes orders
  for(let i=1; i<=10; i++) {
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10*i), XEEJ.address, tokens(10))
    result = await transaction.wait()

    console.log(`Made order from ${user1.address}`)
    await wait(1);
  }

  // User 2 makes orders
  for(let i=1; i<=10; i++) {
    transaction = await exchange.connect(user2).makeOrder(XEEJ.address, tokens(10), mETH.address, tokens(10*i))
    result = await transaction.wait()

    console.log(`Made order from ${user2.address}`)
    await wait(1);
  }
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
