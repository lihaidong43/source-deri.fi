import Header from "../components/Header/Header";
import Card from "../components/Card/Card";
import './betit.scss'

import { useState, useEffect,useCallback } from "react";
import { isStartScroll } from "../utils/utils";
import usePool from "../hooks/usePool";
export default function BetIt({ lang }) {
  const [isFixed, setIsFixed] = useState(false)
  // const [symbols,bTokens] = usePool();

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
  const list = [
    {
      symbol: "BTC",
      Leverage: "12.5x",
      price: 30000,
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
          {list.map((item, index) => {
            return (
              <Card info={item} lang={lang} />
            )
          })}
        </div>
      </div>
    </div>
  )
}