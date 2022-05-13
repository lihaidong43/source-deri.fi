import { getBetInfo, getBetsInfo, isUnlocked } from "../api/query_api"
import { TIMEOUT } from "./shared"

const chainId = '97'
const accountAddress = '0xFefC938c543751babc46cc1D662B982bd1636721'
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
  it('getBetInfo', async () => {
    const res = await getBetInfo({ chainId, accountAddress, symbol: symbol1 })
    expect(res.success).toEqual(true)
    expect(res.response.data).toEqual([])
  }, TIMEOUT)
  it('getBetsInfo', async () => {
    const res = await getBetsInfo({ chainId, accountAddress, symbols: [symbol1, symbol2] })
    expect(res.success).toEqual(true)
    expect(res.response.data).toEqual([])
  }, TIMEOUT)
})