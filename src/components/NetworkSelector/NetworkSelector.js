import React, { useState, useEffect ,useCallback} from 'react'
import styled from 'styled-components';
import Tooltip from '../Tooltip/Tooltip';
import { getNetworkList, getDefaultNw, isStartScroll } from '../../utils/utils';
// import { DeriEnv } from '../../lib/web3js';
import { inject, observer } from 'mobx-react';
import Icon from '../Icon/Icon';
import { NETWORK_MAP } from '../../utils/Constants';
import { useWallet } from 'use-wallet';
// import useConfig from '../../hooks/useConfig';
const Wrapper = styled.div`
  display : flex;
  align-items : center;
  color : #93A1B8;
  margin : 0 16px;
  padding : 0 16px;
  cursor : pointer;
  color : #fff;
  font-size : 16px;
  font-weight : 600;
  min-width : 144px;
  height : 48px;
  border : 1px solid #fff;
  border-radius: 15px;
  .name {
    margin : 0 4px;
  }
  .cur-network {
    display : flex;
    align-items : center;
  }
  #network-select {
    .item {
      padding : 16px;
      color: #93A1B8;
      height: 48px;
      display: flex;
      align-items: center;
      border : 1px solid transparent;
      img {
        margin-right : 8px;
      }
    }
    .item:hover,.item.selected {
      color : #E0ECFF;
      cursor : pointer;
      border-radius: 4px;
      background: #5577FD1A;
    }
    .item:hover {
      // border: 1px solid #CD7A37;
    }
  }
`  
function NetworkSelector({wallet,showWalletModal}){
  const [networkList, setNetworkList] = useState([])
  // const config = useConfig()
  const [nowIcon,setNowIcon] = useState('BNB')
  const [curNetwork, setCurNetwork] = useState({name : 'BSC'});
  const [isShow, setIsShow] = useState(false)
  const walletContext = useWallet();
  const calculatePosition = (position,
    currentEvent,
    currentTarget,
    refNode,
    place,
    desiredPlace,
    effect,
    offset) => {
      const rect = currentTarget.getBoundingClientRect();
      const top = rect.top + rect.height + 8;
      const left = (rect.left - refNode.offsetWidth + rect.width)
      return {top:top + offset.top,left : rect.left}
    }

  const onSelect = async (network) => {
    // if(walletContext.isConnected()){
    //   wallet.switchNetwork(network)
    // } else {
    //   showWalletModal()
    //   // wallet.switchNetwork(network);
    // }
  }

  const handler = useCallback(() => {
    if(isStartScroll()) {
      setNowIcon(`${nowIcon}-LIGHT`)
    } else {
      setNowIcon(nowIcon.split('-')[0])
    }
  })

  // useEffect(() => {
  //   const networkList = getNetworkList(DeriEnv.get())
  //   const defaultNw = getDefaultNw(DeriEnv.get());
  //   if(walletContext.isConnected()){
  //     let icon = networkList.filter(p => (+p.id) === (+walletContext.chainId))
  //     if(icon.length){
  //       icon = icon[0].icon
  //       setNowIcon(icon)
  //     }
  //     if(walletContext.chainId && config[walletContext.chainId]){
  //       setCurNetwork(config[walletContext.chainId])
  //     }
  //   }
  //   wallet.setDefaultNw(defaultNw)
  //   setNetworkList(networkList)
  // }, [wallet,walletContext])


  useEffect(() => {
    document.addEventListener('scroll', handler, false);
    return () => {
      document.removeEventListener('scroll',handler)
    }
  }, []);


  return (
    <Wrapper className='network-select'>
      <div className='cur-network' data-tip data-for='network-select' data-event-off='' data-event='click'>
        <Icon token={nowIcon} width='20'/>
        <div className='name'>{NETWORK_MAP[curNetwork.name] || curNetwork.name}</div>
        <Icon  width='16' token={isShow ? 'arrow-up' : 'arrow-down'}/>
      </div>
      <Tooltip  id='network-select' width = {144} offset={{top : 14}}  overridePosition={calculatePosition} type="info" clickable >
        {networkList.map((network,index) => (
          <div onClick = {()=> onSelect(network)} key={index} className={`item ${wallet.detail.code && network.code === wallet.detail.code ? 'selected' : ''}`} >
            <Icon token={network.icon} width='24' height='24'/><span>{network.name}</span>
          </div>)
      )}
      </Tooltip>
    </Wrapper>
  )
}
export default NetworkSelector;