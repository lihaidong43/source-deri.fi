import React, { useState, useEffect ,useCallback} from 'react'
import styled from 'styled-components';
import { isStartScroll, switchChain, hasParent } from '../../utils/utils';
import Icon from '../Icon/Icon';
import { useWallet } from 'use-wallet';
import useChain from '../../hooks/useChain';
import classNames from 'classnames';

const Wrapper = styled.div`
  cursor : pointer;
  color : #fff;
  font-size : 16px;
  font-weight : 600;
  min-width : 180px;
  height : 44px;
  margin-right : 24px;
  position : relative;
  display : flex;
  justify-content : center;
  .name {
    margin : 0 4px;
  }
  .nw-wrapper {
    border : 2px solid #fff;
    border-radius: 15px;
    background : ${props => props.bgColor};
    position : absolute;
    top : 0px;
    display : flex;
    flex-direction : column;
    item-align : center;
    min-height: 48px;
    width: 100%;
    padding: 0 16px;
    z-index :1;
    .cur-network {
      display : flex;
      align-items : center;
      height : 48px;
    }
    .nw-item {
      display : flex;
      height : 44px;
      align-items: center;
      .name {
        white-space: nowrap;
      }
    }
    .nw-item.hidden {
      display : none;
    }
  }
`  
function ChainSelector({collect}){
  const [bgColor, setBgColor] = useState('rgba(255, 255, 255, 0.2)');
  const [isScroll, setIsScroll] = useState(false);
  const [isShow, setIsShow] = useState(false)
  const chains = useChain();
  const wallet = useWallet()

  const onSelect = useCallback(async (chain) => {
    if(wallet.isConnected()){
      switchChain(chain,() => setIsShow(false))
    } else {
      await wallet.connect();
      switchChain(chain,() => setIsShow(false))
    }
  },[wallet])

  const handler = useCallback(() => {
    let offset = collect ? 138 : 202
    if(isStartScroll(offset)) {
      setIsScroll(true)
      setBgColor('#FFAF0D')
    } else {
      setIsScroll(false)
      setBgColor('')
    }
  })

  const onBodyClick = useCallback((e) => {
    const parent = document.querySelector('.network-select');
    if(!hasParent(parent,e.target)){
      setIsShow(false)
    }
  })

  useEffect(() => {
    document.addEventListener('scroll', handler, false);
    document.addEventListener('click',onBodyClick)
    return () => {
      document.removeEventListener('scroll',handler)
      document.removeEventListener('click',onBodyClick)
    }
  }, []);




  return (
    <Wrapper className='network-select' bgColor={'#FFAB00'}>
      <div className='nw-wrapper'>
        {chains.map((chain,index) => {
          const itemClass = classNames('nw-item',{
            hidden : !isShow
          })
          return index === 0 
            ?
              (<div className='nw-item' onClick={() => setIsShow(!isShow)} key={index}>
                <Icon token={`${chain.icon}-LIGHT`} width='20'/>
                <div className='name'>{chain.name}</div>
                <Icon  width='16' token={'arrow-down'}/>
              </div>)
          : 
            (<div className={itemClass} onClick={e => onSelect(chain)} key={index}>
              <Icon token={`${chain.icon}-LIGHT`} width='20'/>
              <div className='name'>{chain.name}</div>
            </div>)
        })}
      </div>
    </Wrapper>
  )
}
export default ChainSelector;