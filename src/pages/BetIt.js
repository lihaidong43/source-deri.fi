import Header from "../components/Header/Header";
import Card from "../components/Card/Card";
import './betit.scss'
import useSymbols from '../hooks/useSymbols';
import { useState, useEffect,useCallback } from "react";
export default function BetIt({ lang }) {
  const [isFixed, setIsFixed] = useState(false)
  const symbols = useSymbols();
  const handler = useCallback(() => {
    const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > 82) {
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