import poolProdConfig from '../../config/base/pool.prod.json';
import poolTestnetConfig from '../../config/base/pool.testnet.json';
import poolDevConfig from '../../config/base/pool.dev.json';
import { checkEnv, DeriEnv, Env } from './env';
import { checkChainId } from './chain';
import { ZERO_ADDRESS } from './constant';


export const getPoolConfigList = ({ env, chainId }) => {
  if (env) {
    env = checkEnv(env)
  }
  let configList = env === Env.PROD ? poolProdConfig : env === Env.TESTNET ? poolTestnetConfig : poolDevConfig
  if (chainId) {
    chainId = checkChainId(chainId)
    return configList.filter((c) => c.chainId === chainId)
  } else {
    return configList
  }
}

export const getPoolConfig = (chainId, poolAddress) => {
  const configList = getPoolConfigList({chainId})
  const config = configList.find((c) => c.chainId === chainId && c.pool === poolAddress)
  if (config) {
    return config
  }
  throw new Error(`Cannot find pool config: chainId(${chainId}) poolAddress(${poolAddress})`)
}

export const getBTokenList = (chainId) => {
  const configList = getPoolConfigList({ chainId })
  const bTokenList = configList.reduce((acc, pool) => [...acc, ...(pool.bTokens.map((b) => {
    if (b.bTokenDecimals) {
      return {
        chainId: pool.chainId,
        pool: pool.pool,
        bTokenAddress: b.bTokenAddress,
        bTokenSymbol: b.bTokenSymbol,
        bTokenDecimals: b.bTokenDecimals,
      }
    } else {
      return {
        chainId: pool.chainId,
        pool: pool.pool,
        bTokenAddress: b.bTokenAddress,
        bTokenSymbol: b.bTokenSymbol,
      }
    }
  }
  ))], [])
  return bTokenList.reduce((acc, bToken) => {
    if (acc.map((b) => b.bTokenSymbol).indexOf(bToken.bTokenSymbol) === -1) {
      return [...acc, bToken]
    }
    return acc
  }, [])
}

export const getBToken = (chainId, bTokenSymbol) => {
  const bTokenList = getBTokenList(chainId)
  const config = bTokenList.find((b) => b.bTokenSymbol === bTokenSymbol)
  if (config) {
    return config
  }
  throw new Error(`Cannot find bToken config: chainId(${chainId}) bTokenSymbol(${bTokenSymbol})`)
}

export const getSymbolList = (chainId) => {
  const configList = getPoolConfigList({ chainId })
  const symbolList = configList.reduce((acc, pool) => [...acc, ...(pool.symbols.map((s) => ({
    chainId: pool.chainId,
    pool: pool.pool,
    category: s.category,
    symbol: s.symbol,
    symbolId: s.symbolId,
    unit: s.unit,
  })))], [])
  return symbolList.reduce((acc, symbol) => {
    if (acc.map((s) => s.symbol).indexOf(symbol.symbol) === -1) {
      return [...acc, symbol]
    }
    return acc
  }, [])
}

export const getSymbol = (chainId, symbolName) => {
  const symbolList = getSymbolList(chainId)
  const config = symbolList.find((s) => s.symbol === symbolName)
  if (config) {
    return config
  }
  throw new Error(`Cannot find symbol config: chainId(${chainId}) symbol(${symbolName})`)
}

export const getBrokerAddress = (chainId) => {
  const configList = getPoolConfigList(DeriEnv.get())
  const brokerList = configList.map((c) => c.broker)
  if (brokerList.length > 0 && brokerList[0] !== ZERO_ADDRESS) {
    return brokerList[0]
  }
  throw new Error(`Cannot find broker address: chainId(${chainId})`)
}
