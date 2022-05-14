import { BrokerImplementationFactory, ERC20Factory } from "../contract/factory"
import { poolFactory } from "../contract/pool"
import { txApi } from "../utils/api"
import { debug } from "../utils/env"
import { bg, fromWei, toWei } from "../utils/bignumber"
import { checkAddress } from "../utils/chain"
import { getBrokerAddress, getBToken, getPoolConfig, getSymbol } from "../utils/config"
import { MAX_UINT256_DIV_ONE } from "../utils/constant"
import { getSymbolsOracleInfo } from "../utils/oracle"
import { checkToken, nativeCoinSymbols } from "../utils/symbol"

const getPriceLimit = (volume) => {
  return bg(volume).gt(0) ? MAX_UINT256_DIV_ONE : '0'
}
const formatTradeEvent = async(pool, res) => {
  const eventName = res.events['OpenBet'] ? 'OpenBet' : 'CloseBet'
  const event = res.events[eventName]
  const eventValue = event.returnValues
  // get trade price
  try {
    if (event) {
      res.volume = fromWei(eventValue.tradeVolume).toString()
      res.amount = fromWei(eventValue.amount).toString()
    }
  } catch (err) {
    console.log(err)
    // ignore error
  }
  return res
}

export const unlock = txApi(async ({ chainId, bTokenSymbol, accountAddress, isNodeEnv = false, ...opts }) => {
  accountAddress = checkAddress(accountAddress)
  bTokenSymbol = checkToken(bTokenSymbol)
  if (nativeCoinSymbols(chainId).includes(bTokenSymbol)) {
    return
  }
  const bToken = getBToken(chainId, bTokenSymbol)
  const brokerAddress = getBrokerAddress(chainId)
  // isNodeEnv is for test only
  const erc20 = ERC20Factory(chainId, bToken.bTokenAddress, { isNodeEnv })
  return await erc20.unlock(accountAddress, brokerAddress, opts)
})

export const openBet = txApi(async ({ chainId, bTokenSymbol, amount, symbol, accountAddress, direction = 'long', boostUp = false, isNodeEnv = false, ...opts }) => {
  accountAddress = checkAddress(accountAddress)
  bTokenSymbol = checkToken(bTokenSymbol)
  symbol = checkToken(symbol)
  direction = direction.toLowerCase()
  const brokerAddress = getBrokerAddress(chainId)
  const broker = BrokerImplementationFactory(chainId, brokerAddress, { isNodeEnv })
  const symbolConfig = getSymbol(chainId, symbol)
  const bTokenConfig = getBToken(chainId, bTokenSymbol)
  const pool = poolFactory(chainId, symbolConfig.pool)
  const poolConfig = getPoolConfig(chainId, symbolConfig.pool)
  const [oracleSignatures] = await Promise.all([
    getSymbolsOracleInfo(chainId, poolConfig.symbols.map((s) => s.symbol)),
    pool.init(),
  ])
  const symbolInfo = pool.symbols.find((s) => s.symbol === symbol)

  // calc max volume
  let volume = '0'
  if (direction === 'short') {
    volume = bg(amount).div(symbolInfo.curIndexPrice).negated().toString()
  } else {
    volume = bg(amount).div(symbolInfo.curIndexPrice).toString()
  }

  const normalizedVolume = bg(Math.floor(bg(volume).div(symbolInfo.minTradeVolume).toNumber())).times(symbolInfo.minTradeVolume).toString()

  const priceLimit = getPriceLimit(normalizedVolume)
  debug() && console.log(`-- pool(${poolConfig.pool}) account(${accountAddress}) symbol(${symbol}) volume(${normalizedVolume}) priceLimit: ${priceLimit}`)
  // debug() && console.log(oracleSignatures)
  // return await broker.openBet(accountAddress, poolConfig.pool, bTokenConfig.bTokenAddress, toWei(amount), symbol, toWei(volume), priceLimit, oracleSignatures, opts)
  let res = await broker.openBet(accountAddress, poolConfig.pool, bTokenConfig.bTokenAddress, toWei(amount), symbol, toWei(normalizedVolume), priceLimit, oracleSignatures, opts)
  return await formatTradeEvent(pool, res)
})

export const closeBet = txApi(async({chainId, symbol, accountAddress, isNodeEnv=false, ...opts}) => {
  accountAddress = checkAddress(accountAddress)
  symbol = checkToken(symbol)
  const brokerAddress = getBrokerAddress(chainId)
  const broker = BrokerImplementationFactory(chainId, brokerAddress, { isNodeEnv })
  const symbolConfig = getSymbol(chainId, symbol)
  const poolConfig = getPoolConfig(chainId, symbolConfig.pool)
  const pool = poolFactory(chainId, symbolConfig.pool)
  const [oracleSignatures, volumes] = await Promise.all([
    getSymbolsOracleInfo(chainId, poolConfig.symbols.map((s) => s.symbol)),
    broker.getBetVolumes(accountAddress, poolConfig.pool, [symbol]),
    pool.init()
  ])
  if (bg(volumes[0]).eq(0)) {
    throw new Error(`account ${accountAddress} has no position on symbol(${symbol})`)
  }
  const priceLimit = getPriceLimit(bg(volumes[0]).negated().toString())
  debug() && console.log(`-- pool(${poolConfig.pool}) account(${accountAddress}) symbol(${symbol}) priceLimit: ${priceLimit}`)
  let res = await broker.closeBet(accountAddress, poolConfig.pool, symbol, priceLimit, oracleSignatures, opts)
  return await formatTradeEvent(pool, res)
})