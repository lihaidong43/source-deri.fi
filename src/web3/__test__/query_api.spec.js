import { getBetInfo, getBetsInfo, getBetsPnl, getWalletBalance, isUnlocked } from "../api/query_api"
import { TIMEOUT } from "./shared"

const chainId = '97'
const accountAddress = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'
const accountAddress2 = '0xfbc7Ec602A24A338A2E6F182E2B9793D22682D59'
const bToken0 = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47' // busd
const bToken1 = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' // bnb

const symbol1 = 'SOLUSDT'
const symbol2 = 'DOTUSDT'

describe('query api', () => {
  // it('isUnlocked true', async() => {
  //   const res = await isUnlocked({ chainId: 97, accountAddress, bTokenSymbol: 'BUSD' })
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual(true)
  // }, TIMEOUT)

  // it('isUnlocked false', async() => {
  //   const res = await isUnlocked({ chainId, accountAddress: accountAddress2, bTokenSymbol: 'BUSD' })
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual(false)
  // }, TIMEOUT)

  // it('isUnlocked with native coin', async() => {
  //   const res = await isUnlocked({ chainId, accountAddress: accountAddress2, bTokenSymbol: 'BNB' })
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual(true)
  // }, TIMEOUT)

  // it('getBetInfo', async () => {
  //   const res = await getBetInfo({ chainId, accountAddress, symbol: symbol1 })
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual([])
  // }, TIMEOUT)

  it('getBetsInfo', async () => {
    const res = await getBetsInfo({ chainId, accountAddress, symbols: [symbol1, symbol2] })
    expect(res.success).toEqual(true)
    expect(res.response.data).toEqual([])
  }, TIMEOUT)

  // it('getWalletBalance BNB', async () => {
  //   const res = await getWalletBalance({ chainId, accountAddress, bTokenSymbol: 'BNB'})
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual([])
  // }, TIMEOUT)

  // it('getWalletBalance CAKE', async () => {
  //   const res = await getWalletBalance({ chainId, accountAddress, bTokenSymbol: 'CAKE'})
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual([])
  // }, TIMEOUT)

  // it('getTotalPnl', async () => {
  //   const res = await getBetsPnl({ chainId, accountAddress })
  //   expect(res.success).toEqual(true)
  //   expect(res.response.data).toEqual('0')
  // }, TIMEOUT)

})