// import NetworkSelector from "../NetworkSelector/NetworkSelector";
import WalletConnector from "../WalletConnector/WalletConnector";
import styled  from 'styled-components';
import { useCallback, useEffect } from 'react';
import classNames from "classnames";
import { useState } from 'react';
import ChainSelector from "../ChainSelector/ChainSelector";
import {isStartScroll } from "../../utils/utils";

const Wrapper = styled.div`
  &.header {
    position : initial;
    font-size :32px;
    display : flex;
    padding : 0 110px;
    background : none;
    justify-content: flex-start;
    align-items: center;
    height : 96px;

    .f-name {
      font-weight: 800;
      color : #FFAB00; 
      margin-right : 4px;
    }
    .l-name {
      font-weight: 800;
      color : #FFF;
      margin-right :140px;
    }
    .right {
      display : flex;
    }
  }
  &.header.fixed {
    position : fixed;
    top : 0px;
    left : 0;
    box-sizing: border-box;
    width : 100%;
    justify-content: space-between;
    background : #FFAB00;
    z-index : 10; 
    animation : headerFadein 1s ease; 
    .f-name {
      color : #FF7913;
    }
  }
  &.header.fadeOut {
    animation : headerFadeout 0.5s ease; 
  }
  
@keyframes headerFadein {
  from {
    // opacity: 0;
    height : 0px;
  }
  to {
    // opacity: 1;
    height : 96px;
  }
}
@keyframes headerFadeout {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`

export default function Header ({lang}) {
  const [isFixed, setIsFixed] = useState(false);
  const [btnMainColor, setBtnMainColor] = useState('#FFAB00');
  const clazz = classNames('header',{
    fixed : isFixed,
    fadeOut : !isFixed
  })
  const handler = useCallback(() => {
    if (isStartScroll()){
      setIsFixed(true)
      setBtnMainColor('#FF7913')
    } else {
      setIsFixed(false)
      setBtnMainColor('#FFAB00')
    }
  })

  useEffect(() => {
    document.addEventListener('scroll', handler, false);
    return () => {
      document.removeEventListener('scroll',handler)
    }
  },[])

  return (
    <Wrapper className={clazz}>
      <div className="left">
        <span className="f-name">{lang['bet'].toUpperCase()}</span><span className="l-name">{lang['it']}</span></div>
      <div className="right">
        <ChainSelector bgColor={btnMainColor}/>
        <WalletConnector lang={lang} bgColor={btnMainColor}/>
      </div>
    </Wrapper>
  )
}
