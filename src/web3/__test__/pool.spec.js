import { Pool, poolFactory } from "../contract/pool"
import { TIMEOUT } from "./shared"

const chainId = '97'
const poolAddress = '0xAADA94FcDcD7FCd7488C8DFc8eddaac81d7F71EE'
const accountAddress = '0xFefC938c543751babc46cc1D662B982bd1636721'

describe('Pool', () => {
  let pool
  beforeAll(() => {
    pool = poolFactory(chainId, poolAddress)
  })
  it('init', async() => {
    await pool.init()
    // expect(pool.bTokens).toEqual([])
    expect(pool.symbols).toEqual([])
  }, TIMEOUT)
  // it('updateTdInfo', async() => {
  //   await pool.init()
  //   await pool.getTdInfo(accountAddress)
  //   expect(pool.margins.length).toEqual(2)
  //   expect(pool.positions).toEqual([])
  // }, TIMEOUT)
  it('getEstimatedFee', async () => {
    let result
    try {
      await pool.init()
      result = pool.getEstimatedFee('AXSUSDT', '10')
    } catch (err) {
      console.log(err)
    }
    expect(result).toEqual('')
  }, TIMEOUT)
  it('getEstimatedCost', async () => {
    let result
    try {
      await pool.init()
      result = pool.getEstimatedCost('AXSUSDT', '10')
    } catch (err) {
      console.log(err)
    }
    expect(result).toEqual('')
  }, TIMEOUT)
  it('getEstimatedPnl', async () => {
    let result
    try {
      await pool.init()
      result = pool.getEstimatedPnl('AXSUSDT', '10')
    } catch (err) {
      console.log(err)
    }
    expect(result).toEqual('')
  }, TIMEOUT)
})