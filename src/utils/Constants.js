import chainlist from '../config/chainlist.json'

export const USE_WALLET_OPTIONS = {
  connectors : {
    injected: {
      rpc : chainlist
    },
    walletconnect: {
      // chainId: supportChainIds,
      rpc : chainlist
    },
    walletlink: {
      chainId: 1,
      url: 'https://mainnet.eth.aragon.network/',
    },
  },
  autoConnect : true
}
//for color
export const PRIMARY = 'primary';
export const SECONDARY = 'secondary'

export const NETWORK_MAP = {
  BSC:"BNB Chain"
}

export const COOKIE_DERI_DOMAIN='.deri.fi'
