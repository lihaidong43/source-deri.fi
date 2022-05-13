import Header from "../components/Header/Header";
import Card from "../components/Card/Card";
import { useWallet } from 'use-wallet';
import './betit.scss'
import { useState, useEffect,useCallback } from "react";
import { isStartScroll } from "../utils/utils";
import usePool from "../hooks/usePool";
export default function BetIt({ lang }) {
  const [isFixed, setIsFixed] = useState(false)
  // const [symbols,setSymbols] = useState()
  // const [bTokens,setBTokens] = useState()
  const [bTokens,symbols] = usePool();
  console.log('bTokens,symbols',bTokens,symbols)
  const wallet = useWallet()
  const handler = useCallback(() => {
    if (isStartScroll()) {
      setIsFixed(true)  
    } else {
      setIsFixed(false)
    }
  })

  useEffect(() => {
    document.addEventListener('scroll', handler, false);
    return () => {
      document.removeEventListener('scroll', handler)
    }
  }, [])
  useEffect(()=>{
  },[wallet])
  const list = [
    {
      symbol: "BTC",
      Leverage: "12.5x",
      price: 30000,
      isPower:true,
    },
    {
      symbol: "ETH",
      Leverage: "12.5x",
      price: 2600,
    },
    {
      symbol: "BNB",
      Leverage: "12.5x",
      price: 300,
    },
    {
      symbol: "DOGE",
      Leverage: "12.5x",
      price: 0.5,
    },
    {
      symbol: "LUNA",
      Leverage: "12.5x",
      price: 0.5,
    },
    {
      symbol: "DOT",
      Leverage: "12.5x",
      price: 0.5,
    },
    {
      symbol: "SOL",
      Leverage: "12.5x",
      price: 0.5,
      isPower:false,
    },
  ]
  return (
    <div className="betit">
      <div className={isFixed ? "bg-img-color hide-three" : "bg-img-color"} >

      </div>
      <Header lang={lang}></Header>
      <div className="main-body">
        <div className='title-box'>
          <div className='title-des'>
            <div className='title-text'>
              {lang['title-one']}
            </div>
            <div className='title-text-des'>
              {lang['title-two']}
            </div>
          </div>
        </div>

        <div className='total-pnl-box'>
          <div className='total-pnl'>
            <span>{lang['total-pnl']}:</span>
            <div className='pnl-num'>$100</div>
          </div>
        </div>

        <div className='card-list'>
          {symbols&&symbols.map((item, index) => {
            return (
              <Card info={item} bTokens={bTokens} lang={lang} />
            )
          })}
        </div>
      </div>
    </div>
  )
}