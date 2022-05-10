// import NetworkSelector from "../NetworkSelector/NetworkSelector";
import WalletConnector from "../WalletConnector/WalletConnector";
import styled  from 'styled-components';
import BetIt from '../../pages/BetIt';
import { useCallback, useEffect } from 'react';
import classNames from "classnames";
import { useState } from 'react';
import NetworkSelector from "../NetworkSelector/NetworkSelector";

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
    .f-name {
      color : #FF7913;
    }
  }
`

export default function Header ({lang}) {
  const [isFixed, setIsFixed] = useState(false);
  const [btnMainColor, setBtnMainColor] = useState('#FFAB00');
  const clazz = classNames('header',{
    fixed : isFixed
  })
  const handler = useCallback(() => {
    const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > 82 ){
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
        <NetworkSelector/>
        <WalletConnector lang={lang} bgColor={btnMainColor}/>
      </div>
    </Wrapper>
  )
}
