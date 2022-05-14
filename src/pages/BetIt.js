import Header from "../components/Header/Header";
import Card from "../components/Card/Card";
import { useWallet } from 'use-wallet';
import ApiProxy from "../model/ApiProxy";
import './betit.scss'
import { useState, useEffect, useCallback } from "react";
import { isStartScroll } from "../utils/utils";
import DeriNumberFormat from "../utils/DeriNumberFormat";
import usePool from "../hooks/usePool";
export default function BetIt({ lang }) {
  const [totalPnl, setTotalPnl] = useState()
  const [isFixed, setIsFixed] = useState(false)
  const [bTokens, symbols] = usePool();
  console.log("symbols",symbols)
  const wallet = useWallet()
  const handler = useCallback(() => {
    if (isStartScroll()) {
      setIsFixed(true)
    } else {
      setIsFixed(false)
    }
  })

  const getBetsPnl = async () => {
    let res = await ApiProxy.request("getBetsPnl", { chainId: wallet.chainId, accountAddress: wallet.account })
    setTotalPnl(res)
  }

  useEffect(() => {
    document.addEventListener('scroll', handler, false);
    return () => {
      document.removeEventListener('scroll', handler)
    }
  }, [])
  useEffect(() => {
    if (wallet.chainId && wallet.account) {
      let interval = window.setInterval(() => { getBetsPnl()}, 1000 * 3);
      getBetsPnl()
      return () => clearInterval(interval);
    }
  }, [wallet])
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
            <div className='pnl-num'>$<DeriNumberFormat value={totalPnl} displayType='text' decimalScale={2} /></div>
          </div>
        </div>

        <div className='card-list'>
          {symbols && symbols.map((item, index) => {
            return (
              <Card info={item} bTokens={bTokens} lang={lang} />
            )
          })}
        </div>
      </div>
    </div>
  )
}