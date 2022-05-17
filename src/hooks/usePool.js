import { useEffect, useRef, useState } from 'react';
import { useWallet } from "use-wallet";
import merge from 'deepmerge'
import { eqInNumber, getEnv, getMarkpriceSymbol,importAll } from '../utils/utils';

const poolConfig = importAll(require.context('../config/base/',true,/pool.*.json/));
const poolExtConfig = importAll(require.context('../config/',true,/symbol.*.json/));

const env = getEnv();

const symbolMerge = (target,source,clonedPool) => {
  return target.map(item => {
    const sourceSymbol = source.find(s => s.symbol === item.symbol);
    if(sourceSymbol){
      if(item.powerSymbol && sourceSymbol.powerSymbol) {
        sourceSymbol.powerSymbol = Object.assign({},item.powerSymbol,sourceSymbol.powerSymbol,mixin(sourceSymbol.powerSymbol,clonedPool))
      }
      return Object.assign(item,mixin(item,clonedPool),sourceSymbol)
    }
    return item;
  })
}

//minin some useful method
const mixin = (symbolInfo,clonedPool) => {
  const mixed = {
    markpriceSymbol : getMarkpriceSymbol(Object.assign(clonedPool,symbolInfo))
  }
  return mixed;
}

const arrayMerge = (target,source) => {
  return target.map(item => {
    const sourceConfig = source.find(s => s.chainId === item.chainId && s.name === item.name)
    if(sourceConfig) {
      return merge(item,sourceConfig,{
        customMerge : key => {
          if(key === 'symbols') {
            const clonedPool = Object.assign({},item,sourceConfig)
            delete clonedPool.bTokens
            delete clonedPool.symbols;
            return (target,source) => symbolMerge(target,source,clonedPool)
          }
        }
      })
    }
    return item;
  })
}

const configs = merge(poolConfig[env],poolExtConfig[env],{arrayMerge : arrayMerge})

export default function usePool(){
  const wallet = useWallet();
  const [config, setConfig] = useState({});
  // const configsRef = useRef();

  useEffect(() => {
    //如果链接不上或者链接错误的网络，用默认
    if(wallet.isConnected()) {
      let c  = configs.find(c => eqInNumber(c.chainId,wallet.chainId));
      if(c){
        setConfig(c)
      } else {
        let c  = configs.find(c => c.default);
        c = c ? c : configs[0];
        setConfig(c)
      }
    } else if(wallet.status === 'disconnected'){
      const c  =configs.find(c => c.default);
      setConfig(c);
    }

  }, [wallet.status]);
  const symbols = config.symbols && config.symbols.sort((s1,s2) => s1.order > s2.order ? 1 : s1.order < s2.order ? -1 : 0)  
  const bTokens = config.bTokens;
  return [bTokens,symbols];
}