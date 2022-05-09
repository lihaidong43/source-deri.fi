import chainlist from '../config/chainlist.json'

export const USE_WALLET_OPTIONS = {
  connectors : {
    injected: {
      rpc : chainlist
    }
  },
  autoConnect : true
}