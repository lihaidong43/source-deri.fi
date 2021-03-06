import { BrokerImplementationFactory, ERC20Factory } from "../contract/factory";
import { poolFactory } from "../contract/pool";
import { queryApi } from "../utils/api";
import { bg, fromWei } from "../utils/bignumber";
import { checkAddress } from "../utils/chain";
import { getBrokerAddress, getBToken, getSymbol, getSymbolList } from "../utils/config";
import { debug } from "../utils/env";
import { checkToken, deriSymbolScaleOut, nativeCoinSymbols, normalizeDeriSymbol, stringToId } from "../utils/symbol";
import { getWeb3 } from "../utils/web3";
import { ZERO_ADDRESS } from '../utils/constant'

export const getWalletBalance = queryApi(async ({ chainId, bTokenSymbol, accountAddress }) => {
  accountAddress = checkAddress(accountAddress)
  bTokenSymbol = checkToken(bTokenSymbol)
  if (nativeCoinSymbols(chainId).includes(bTokenSymbol)) {
    const web3 = await getWeb3(chainId)
    return fromWei(await web3.eth.getBalance(accountAddress))
  } else {
    const bToken = getBToken(chainId, bTokenSymbol)
    const erc20 = ERC20Factory(chainId, bToken.bTokenAddress)
    return await erc20.balanceOf(accountAddress)
  }
}, '')

export const isUnlocked = queryApi(async ({ chainId, bTokenSymbol, accountAddress }) => {
  accountAddress = checkAddress(accountAddress)
  bTokenSymbol = checkToken(bTokenSymbol)
  if (nativeCoinSymbols(chainId).includes(bTokenSymbol)) {
    return true
  } else {
    const brokerAddress = getBrokerAddress(chainId)
    const bToken = getBToken(chainId, bTokenSymbol)
    const erc20 = ERC20Factory(chainId, bToken.bTokenAddress)
    return await erc20.isUnlocked(accountAddress, brokerAddress)
  }
}, '')

export const getBetInfo = queryApi(async ({ chainId, accountAddress, symbol}) => {
  if (accountAddress) {
    accountAddress = checkAddress(accountAddress)
  } else {
    accountAddress = ZERO_ADDRESS
  }
  symbol = checkToken(symbol)
  const brokerAddress = getBrokerAddress(chainId)
  const symbolConfig = getSymbol(chainId, symbol)
  const broker = BrokerImplementationFactory(chainId, brokerAddress)
  // const clientInfo = await broker.bets(accountAddress, symbolInfo.pool, stringToId(symbol))
  debug() && console.log(`-- chainId(${chainId}) ${accountAddress} ${symbol} broker(${brokerAddress})`)
  let clientInfo, clientInfo1, clientInfo2
  if (symbolConfig.powerSymbol) {
    [clientInfo1, clientInfo2] = await Promise.all([
      broker.bets(accountAddress, symbolConfig.pool, stringToId(symbol)),
      broker.bets(accountAddress, symbolConfig.powerSymbol.pool, stringToId(symbolConfig.powerSymbol.symbol)),
    ])
  } else {
    clientInfo1 = await broker.bets(accountAddress, symbolConfig.pool, stringToId(symbol))
  }
  //const volumes = await  broker.getBetVolumes(accountAddress, symbolInfo.pool, [symbol])
  let position = { dpmmTraderPnl: '0', traderPnl: '0' }
  let symbolInfo = { markPrice: '', curIndexPrice: '' }
  let isPowerSymbol = false, originSymbol = symbol
  if (clientInfo2 && clientInfo2.volume !== '0') {
    // update
    clientInfo = clientInfo2
    symbol = symbolConfig.powerSymbol.symbol
    isPowerSymbol = true
    // pool is the powerSymbol's pool
    const pool = poolFactory(chainId, symbolConfig.powerSymbol.pool)
    // originPool is the pool of the future symbol
    const originPool = poolFactory(chainId, symbolConfig.pool)
    await Promise.all([
       pool.init(clientInfo2.client),
       originPool.init(),
    ])
    if (pool[clientInfo.client].positions.map((s) => s.symbol).includes(symbol)) {
      position = pool[clientInfo.client].positions.find((p) => p.symbol === symbol)
    }
    symbolInfo = originPool.symbols.find((p) => p.symbol === originSymbol)
  } else {
    // update
    clientInfo = clientInfo1
    const pool = poolFactory(chainId, symbolConfig.pool)
    await pool.init(clientInfo.client)
    if (pool[clientInfo.client].positions.map((s) => s.symbol).includes(symbol)) {
      position = pool[clientInfo.client].positions.find((p) => p.symbol === symbol)
    }
    symbolInfo = pool.symbols.find((p) => p.symbol === symbol)
  }
  return {
    volume: deriSymbolScaleOut(symbol, clientInfo.volume),
    symbol,
    displaysymbol: normalizeDeriSymbol(symbol),
    pnl: position.dpmmTraderPnl,
    markPrice: symbolInfo.markPrice,
    indexPrice: symbolInfo.curIndexPrice,
    isPowerSymbol,
  }
}, {})

// export const getBetsInfo = queryApi(async ({ chainId, accountAddress, symbols }) => {
//   accountAddress = checkAddress(accountAddress)
//   symbols = symbols.map((s) => checkToken(s))
//   const brokerAddress = getBrokerAddress(chainId)
//   const symbolsInfo = symbols.map((s) => getSymbol(chainId, s))
//   const poolsInfo = symbolsInfo.reduce((acc, symbol) => {
//     if (acc.map((p) => p.pool).includes(symbol.pool)) {
//       const pool = acc.find((p) => p.pool === symbol.pool)
//       pool.symbols.push(symbol.symbol)
//     } else {
//       acc.push({
//         pool: symbol.pool,
//         symbols: [symbol.symbol],
//       })
//     }
//     return acc
//   }, [])
//   const pools = poolsInfo.map((p) => p.pool)
//   const broker = BrokerImplementationFactory(chainId, brokerAddress)
//   const volumes = await Promise.all(
//     pools.map((pool) => broker.getBetVolumes(accountAddress, pool, poolsInfo.find((p) => p.pool === pool).symbols))
//   )
//   pools.forEach((pool, index) => {
//     poolsInfo.find((p) => p.pool === pool).volumes = volumes[index]
//   })
//   let res = symbols.reduce((acc, symbol) => {
//     for (let pool of pools) {
//       const poolInfo = poolsInfo.find((p)=> p.pool === pool)
//       if (poolInfo.symbols[0] === symbol) {
//         const s = poolInfo.symbols.splice(0, 1)
//         const v = poolInfo.volumes.splice(0, 1)
//         acc.push({symbol: s[0], volume: v[0], pnl: '0'})
//       }
//     }
//     return acc
//   }, [])
//   return res
// }, [])

export const getBetsPnl = queryApi(async ({ chainId, accountAddress }) => {
  accountAddress = checkAddress(accountAddress)
  const symbols = getSymbolList(chainId).reduce((acc, s) => {
    acc.push(s)
    if (s.powerSymbol) {
      acc.push(s.powerSymbol)
    }
    return acc
  }, [])

  const brokerAddress = getBrokerAddress(chainId)
  const broker = BrokerImplementationFactory(chainId, brokerAddress)
  const res = await Promise.all(symbols.map((s) => {
    return broker.bets(accountAddress, s.pool, stringToId(s.symbol))
  }))
  const clientsInfo = res.map((r, index) => ({ ...r, symbol: symbols[index].symbol, pool: symbols[index].pool }))
    .filter((c) => c.volume !== '0')
  const pnlsInfo = (await Promise.all(clientsInfo.map((c) => {
    const pool = poolFactory(chainId, c.pool)
    return pool.init(c.client)
  }))).map((c) => c.account)
  // console.log(pnlsInfo)
  // return pnlsInfo.reduce((acc, s) => acc.plus(s.traderPnl), bg(0)).toString()
  return pnlsInfo.reduce((acc, s) => acc.plus(s.dpmmTraderPnl), bg(0)).toString()
}, '')