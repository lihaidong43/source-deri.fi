import { useEffect, useRef, useState } from 'react';
import { useWallet } from "use-wallet";
import merge from 'deepmerge'
import { eqInNumber, All, getEnv,importAll } from '../utils/utils';

const poolConfig = importAll(require.context('../config/base/',true,/pool.*.json/));
const poolExtConfig = importAll(require.context('../config/',true,/symbol.*.json/));

const env = getEnv();

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
  const configsRef = useRef();
  configsRef.current = merge(poolConfig[env],poolExtConfig[env],{arrayMerge : arrayMerge})


  useEffect(() => {
    if(wallet.isConnected()) {
      const c  = configsRef.current.find(c => eqInNumber(c.chainId,wallet.chainId));
      if(c){
        setConfig(c)
      }
    } else if(wallet.status === 'disconnected'){
      const c  = configsRef.current.find(c => c.default);
      setConfig(c);
    }
  }, [wallet]);

  return [config.bTokens,config.symbols];
}