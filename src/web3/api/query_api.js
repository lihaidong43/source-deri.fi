import { BrokerImplementationFactory, ERC20Factory } from "../contract/factory";
import { queryApi } from "../utils/api";
import { checkAddress } from "../utils/chain";
import { getBrokerAddress, getBToken, getSymbol } from "../utils/config";
import { checkToken, nativeCoinSymbols, stringToId } from "../utils/symbol";

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