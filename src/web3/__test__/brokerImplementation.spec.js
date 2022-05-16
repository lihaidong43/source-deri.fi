import { BrokerImplementationFactory, ERC20Factory } from "../contract/factory"
import { toWei } from "../utils/bignumber"
import { getPoolConfig } from "../utils/config"
import { MAX_UINT256 } from "../utils/constant"
import { getSymbolsOracleInfo } from "../utils/oracle"
import { stringToId } from "../utils/symbol"
import { sendTxWithPkey, TIMEOUT } from "./shared"

const chainId = '97'
const brokerAddress = '0xcD3B34f2942c26a5c070767441f9Fc45e6E3f4ca'
const accountAddress = '0xFefC938c543751babc46cc1D662B982bd1636721'
const poolAddress = '0xAADA94FcDcD7FCd7488C8DFc8eddaac81d7F71EE'
const bToken0 = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47' // busd
const bToken1 = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' // bnb
const bToken2 = '0xe8bd7cCC165FAEb9b81569B05424771B9A20cbEF' // cake
const symbolId1 = 'AXSUSDT' // axs
const symbolId2 = 'SOLUSDT' // sol
const symbolId3 = 'ETH^2' // eth^2

describe('brokerImplementation', () => {
  let broker
  beforeAll(async() => {
    broker = BrokerImplementationFactory(chainId, brokerAddress)
  })
  // it('admin', async () => {
  //   const res = await broker.admin()
  //   expect(res).toEqual('0x4C059dD7b01AAECDaA3d2cAf4478f17b9c690080')
  // }, TIMEOUT)
  it('bets', async () => {
    // const res = await broker.bets(accountAddress, poolAddress, stringToId(symbolId1))
    // expect(res).toEqual({ asset: "0x0000000000000000000000000000000000000000", client: "0x0000000000000000000000000000000000000000", volume: "0" })
    const brokerArbi = BrokerImplementationFactory('421611', '0xBCf6573C113A2bCcFd00631008618Ad4ADF0E7c7')
    const res = await brokerArbi.bets(accountAddress, '0x296A1CDdE93a99B4591486244f7442E25CA596a6' , stringToId('BTCUSD'))
    expect(res).toEqual({ asset: "0x0000000000000000000000000000000000000000", client: "0x0000000000000000000000000000000000000000", volume: "0" })
  }, TIMEOUT)
  // it('clientImplementation', async () => {
  //   const res = await broker.clientImplementation()
  //   expect(res).toEqual('0x2a518ceDeBa19Fd3dd4711d7Bb01Ae1C53cE1325')
  // }, TIMEOUT)
  // it('clientTemplate', async () => {
  //   const res = await broker.clientTemplate()
  //   expect(res).toEqual('0x8Eb5Ef1eB3334B68128FddE47bC3d3F4f4Cc1dFf')
  // }, TIMEOUT)
  // it('getBetVolumes', async () => {
  //   const res = await broker.getBetVolumes(accountAddress, poolAddress, [symbolId1, symbolId2, symbolId3])
  //   expect(res).toEqual(['0', '0', '0'])
  // }, TIMEOUT)
  // it('implementation', async () => {
  //   const res = await broker.implementation()
  //   expect(res).toEqual('0x6BDC841f33c73408Ae032cc12637D95cFf85b2C2')
  // }, TIMEOUT)

  // it('openBet', async () => {
  //   const erc20 = ERC20Factory(chainId, bToken0)
  //   let res = await erc20.isUnlocked(accountAddress, brokerAddress)
  //   expect(res).toEqual(true)
  //   // if (!res) {
  //   //   console.log(await sendTxWithPkey(erc20.web3, erc20.contract, 'approve', [brokerAddress, MAX_UINT256]))
  //   // }
  //   // res = await erc20.isUnlocked(accountAddress, brokerAddress)
  //   // expect(res).toEqual(true)
  //   const poolConfig = getPoolConfig(chainId, poolAddress)
  //   const oracleSignatures = await getSymbolsOracleInfo(chainId, poolConfig.symbols.map((s) => s.symbol))
  //   const res2 = await sendTxWithPkey(broker.web3, broker.contract, 'openBet', [poolAddress, bToken0, toWei('100'), 'AXSUSDT', toWei('-1'), '0', oracleSignatures])
  //   expect(res2).toEqual({})
  // }, TIMEOUT)

})
