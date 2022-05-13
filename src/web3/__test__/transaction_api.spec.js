import { isUnlocked } from "../api/query_api"
import { closeBet, openBet, unlock } from "../api/transaction_api"
import { TIMEOUT } from "./shared"

const chainId = '97'
const accountAddress = '0xFefC938c543751babc46cc1D662B982bd1636721'
const accountAddress2 = '0xfbc7Ec602A24A338A2E6F182E2B9793D22682D59'
const bToken0 = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47' // busd
const bToken1 = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' // bnb

const callback = { onAccept: () => { }, onReject: () => { } }

describe('query api', () => {
  // it('unlock', async() => {
  //   let res = await isUnlocked({ chainId, accountAddress: accountAddress2, bTokenSymbol: 'BUSD' })
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual(false)
  //   // res = await unlock({chainId, bTokenSymbol: 'BUSD', accountAddress: accountAddress2, isNodeEnv: true, ...callback})
  //   // expect(res.success).toEqual(true)
  //   // res = await isUnlocked({ chainId, accountAddress: accountAddress2, bTokenSymbol: 'BUSD' })
  //   // expect(res.success).toEqual(true)
  //   // expect(res.response.data).toEqual(true)
  // }, TIMEOUT)
  // it('closeBet without position', async() => {
  //   let res = await closeBet({ chainId, symbol: 'AXSUSDT', accountAddress: accountAddress2, isNodeEnv: true, ...callback })
  //   expect(res.success).toEqual(false)
  //   expect(res.response.error.message).toContain('has no position')
  // }, TIMEOUT)
  // it('closeBet with position', async() => {
  //   let res = await closeBet({ chainId, symbol: 'AXSUSDT', accountAddress: accountAddress, isNodeEnv: true, ...callback })
  //   console.log(res)
  //   expect(res.success).toEqual(false)
  // }, TIMEOUT)
  it('openBet ', async() => {
    let res = await openBet({ chainId, bTokenSymbol: 'BUSD', amount: '100', symbol: 'AXSUSDT', accountAddress: accountAddress, isNodeEnv: true, ...callback })
    console.log(res)
    expect(res.success).toEqual(false)
  }, TIMEOUT)
})