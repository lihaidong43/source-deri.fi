import { useEffect, useState } from 'react';
import { useWallet } from "use-wallet";
import merge from 'deepmerge'
import { eqInNumber } from '../utils/utils';


const poolConfig = {}
const poolExtConfig = {}
function importAll(r,config){
  return r.keys().forEach(key => {
    const path = key.split('.')
    const env = path[2]
    if(!config[env]) {
      config[env] = {}
    }
    config[env] = r(key)
  });
}
importAll(require.context('../config/base/',true,/pool.*.json/),poolConfig);
importAll(require.context('../config/',true,/symbol.*.json/),poolExtConfig);

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

const symbolMerge = (target,source) => {
  return target.map(item => {
    const sourceSymbol = source.find(s => s.symbol === item.symbol);
    if(sourceSymbol){
      return Object.assign(item,sourceSymbol)
    }
    return item;
  })
}

const arrayMerge = (target,source,options) => {
  return target.map(item => {
    const sourceConfig = source.find(s => s.chainId === item.chainId && s.name === item.name)
    if(sourceConfig) {
      return merge(item,sourceConfig,{
        customMerge : key => {
          if(key === 'symbols') {
            return symbolMerge
          }
        }
      })
    }
    return item;
  })
}

export default function usePool(){
  const wallet = useWallet();
  const [config, setConfig] = useState({});
  let configs = merge(poolConfig[env],poolExtConfig[env],{arrayMerge : arrayMerge})


  useEffect(() => {
    if(wallet.isConnected()) {
      const c  = configs.find(c => eqInNumber(c.chainId,wallet.chainId));
      setConfig(c)
    } else if(wallet.status === 'disconnected'){
      const c  = configs.find(c => c.default);
      setConfig(c);
    }
  }, [wallet.status]);

  return [config.bTokens,config.symbols];
}