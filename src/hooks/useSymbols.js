import { useEffect } from 'react';
import { useWallet } from "use-wallet";
import merge from 'deepmerge'
import { eqInNumber } from '../utils/utils';


const poolConfig = {}
const poolExtConfig = {}
function importAll(r,config){
  return r.keys().forEach(key => {
    const path = key.split('.')
    console.log(path)
    const env = path[2]
    if(!config[env]) {
      config[env] = {}
    }
    config[env] = r(key)
  });
}
importAll(require.context('../config/base/',true,/pool.*.json/),poolConfig);
importAll(require.context('../config/',true,/symbol.*.json/),poolExtConfig);


export default function useSymbols(){
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  const wallet = useWallet();

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
    target.forEach(item => {
      const sourceConfig = source.find(s => s.chainId === item.chainId && s.pool === item.pool)
      if(sourceConfig) {
        merge(item,sourceConfig,{
          customMerge : key => {
            if(key === 'symbols') {
              return symbolMerge
            }
          }
        })
      }
    })
    return target;
  }
  let configs = merge(poolConfig[env],poolExtConfig[env],{arrayMerge : arrayMerge})

  useEffect(() => {
    if(wallet.isConnected()) {
      configs = configs.filter(c => eqInNumber(c.chainId,wallet.chainId))
    }
  }, [wallet.status]);

  return configs;
}