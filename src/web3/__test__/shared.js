export const TIMEOUT = 120 * 1000

export const sendTxWithPkey = async (web3, contract, methodName, args, pkey) => {
  if (!pkey) {
    if (process.env.PKEY) {
      pkey = process.env.PKEY
    } else {
      throw new Error('the env variable PKEY is not set for getWebWithSigner')
    }
  }
  const account = web3.eth.accounts.wallet.add(`0x${pkey}`)
  console.log(`>>> using pkey: ${pkey}`)
  console.log(`>>> account: ${account.address}`)
  // const account = { address: '0xFefC938c543751babc46cc1D662B982bd1636721' }
  const methodCall = contract.methods[methodName](...args)
  const [gasPrice, nonce] = await Promise.all([
    //methodCall.estimateGas(account.address),
    web3.eth.getGasPrice(),
    web3.eth.getTransactionCount(account.address),
  ])
  const data = methodCall.encodeABI()
  const gas = 1000000 * 5
  console.log(`${methodName}(${args.join(',')}) gas:${gas} gasPrice: ${gasPrice} nonce: ${nonce}`)
  const tx = {
    from: account.address,
    to: contract._address,
    data,
    gasPrice,
    gas,
    nonce,
  }
  const signedTx = await web3.eth.accounts.signTransaction(tx, pkey)
  // console.log('signedTx', signedTx)

  return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}