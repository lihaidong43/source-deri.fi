import { BrokerImplementationFactory, ERC20Factory } from "../contract/factory";
import { queryApi } from "../utils/api";
import { fromWei } from "../utils/bignumber";
import { checkAddress } from "../utils/chain";
import { getBrokerAddress, getBToken, getSymbol, getSymbolList } from "../utils/config";
import { checkToken, nativeCoinSymbols, stringToId } from "../utils/symbol";
import { getWeb3 } from "../utils/web3";

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
  accountAddress = checkAddress(accountAddress)
  symbol = checkToken(symbol)
  const brokerAddress = getBrokerAddress(chainId)
  const symbolInfo = getSymbol(chainId, symbol)
  const broker = BrokerImplementationFactory(chainId, brokerAddress)
  // const clientInfo = await broker.bets(accountAddress, symbolInfo.pool, stringToId(symbol))
  const volumes = await broker.getBetVolumes(accountAddress, symbolInfo.pool, [symbol])
  return {
    symbol,
    volume: volumes[0],
    pnl: '0',
  }
}, {})

export const getBetsInfo = queryApi(async ({ chainId, accountAddress, symbols }) => {
  accountAddress = checkAddress(accountAddress)
  symbols = symbols.map((s) => checkToken(s))
  const brokerAddress = getBrokerAddress(chainId)
  const symbolsInfo = symbols.map((s) => getSymbol(chainId, s))
  const poolsInfo = symbolsInfo.reduce((acc, symbol) => {
    if (acc.map((p) => p.pool).includes(symbol.pool)) {
      const pool = acc.find((p) => p.pool === symbol.pool)
      pool.symbols.push(symbol.symbol)
    } else {
      acc.push({
        pool: symbol.pool,
        symbols: [symbol.symbol],
      })
    }
    return acc
  }, [])
  const pools = poolsInfo.map((p) => p.pool)
  const broker = BrokerImplementationFactory(chainId, brokerAddress)
  const volumes = await Promise.all(
    pools.map((pool) => broker.getBetVolumes(accountAddress, pool, poolsInfo.find((p) => p.pool === pool).symbols))
  )
  pools.forEach((pool, index) => {
    poolsInfo.find((p) => p.pool === pool).volumes = volumes[index]
  })
  let res = symbols.reduce((acc, symbol) => {
    for (let pool of pools) {
      const poolInfo = poolsInfo.find((p)=> p.pool === pool)
      if (poolInfo.symbols[0] === symbol) {
        const s = poolInfo.symbols.splice(0, 1)
        const v = poolInfo.volumes.splice(0, 1)
        acc.push({symbol: s[0], volume: v[0], pnl: '0'})
      }
    }
    return acc
  }, [])
  return res
}, [])

export const getBetsPnl = queryApi(async ({ chainId, accountAddress }) => {
  accountAddress = checkAddress(accountAddress)
  const symbols = getSymbolList(chainId)
  const brokerAddress = getBrokerAddress(chainId)
  const broker = BrokerImplementationFactory(chainId, brokerAddress)
  const res = await Promise.all(symbols.map((s) => {
    return broker.bets(accountAddress, s.pool, stringToId(s.symbol))
  }))
  console.log(res)
  // get pool addresses
  // update pnl for each symbol
  // const totalPnl = res.reduce((acc, s) => acc.plus(s.pnl), bg(0)).toString()
  return '0'
}, '')