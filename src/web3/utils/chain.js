import Web3 from "web3";

// configs
const chainConfigList = [
  {
    chainId: '56',
    name: 'bsc',
    providers: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      // 'https://bsc-dataseed1.ninicoin.io/',
    ],
  },
  {
    chainId: '97',
    name: 'bsctestnet',
    providers: [
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://data-seed-prebsc-2-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-2-s2.binance.org:8545/',
      // 'https://data-seed-prebsc-1-s3.binance.org:8545/',
      // 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ],
  },
];

export const getChainConfig = (chainId) => {
  chainId = checkChainId(chainId);
  const config = chainConfigList.find((c) => c.chainId === chainId);
  return config ? config : new Error(`Cannot find config for chainId(${chainId})`)
};

// utils
export const checkChainId = (chainId) => {
  chainId = chainId != null ? chainId.toString() : chainId;
  if (chainConfigList.map((c) => c.chainId).includes(chainId)) {
    return chainId;
  }
  throw new Error(`Invalid chainId: ${chainId}`);
};
export const checkAddress = (address) => {
  return Web3.utils.toChecksumAddress(address)
}
// export const fromWei = (val) => Web3.utils.fromWei(val.toString())
// export const toWei = (val) => Web3.utils.toWei(val.toString())


export const isBSCChain = (chainId) => {
  return ['56', '97'].includes(chainId)
}
export const isArbiChain = (chainId) => {
  return ['42161', '421611'].includes(chainId)
}
export const onChainSymbols = ["BTCUSD", "ETHUSD", "BNBUSD"]
export const onChainSymbolsArbi = ["ETHUSD" ]

