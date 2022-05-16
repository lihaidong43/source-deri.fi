import Header from "../components/Header/Header";
import Card from "../components/Card/Card";
import { useWallet } from 'use-wallet';
import ApiProxy from "../model/ApiProxy";
import Portal from "../components/Portal/Portal";
import './betit.scss'
import { useState, useEffect, useCallback } from "react";
import { isStartScroll } from "../utils/utils";
import DeriNumberFormat from "../utils/DeriNumberFormat";
import usePool from "../hooks/usePool";
import leftBg from "../assets/img/bg-icon-left.png"
import rightBg from "../assets/img/bg-icon-right-buttom.png"
export default function BetIt({ lang, getLang }) {
  const [totalPnl, setTotalPnl] = useState()
  const [isFixed, setIsFixed] = useState(false)
  const [bTokens, symbols] = usePool();
  const [collect, setCollect] = useState(true)
  console.log("bTokens, symbols", bTokens, symbols)
  const wallet = useWallet()
  const handler = useCallback(() => {
    let offset = collect ? 138 : 202
    let bgTop = document.getElementsByClassName('bg-img-color')[0]
    if (isStartScroll(offset)) {
      setIsFixed(true)
    } else {
      setIsFixed(false)
    }
    let top = collect ? 56 : 120
    if (!isStartScroll(top)) {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      console.log("st", st)
      bgTop.style.top = top - st + "px"
    } else {
      bgTop.style.top = "0px"
    }
  })

  const getBetsPnl = async () => {
    let res = await ApiProxy.request("getBetsPnl", { chainId: wallet.chainId, accountAddress: wallet.account })
    setTotalPnl(res)
  }

  useEffect(() => {
    let bgTop = document.getElementsByClassName('bg-img-color')[0]
    document.addEventListener('scroll', handler, false);
    let top = collect ? 56 : 120
    if (!isStartScroll(top)) {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      console.log("st", st)
      bgTop.style.top = top - st + "px"
    } else {
      bgTop.style.top = "0px"
    }
    return () => {
      document.removeEventListener('scroll', handler)
    }
  }, [collect])
  useEffect(() => {
    if (wallet.chainId && wallet.account) {
      let interval = window.setInterval(() => { getBetsPnl() }, 1000 * 3);
      getBetsPnl()
      return () => clearInterval(interval);
    }
  }, [wallet])
  return (
    <>
      <Portal collect={collect} setCollect={setCollect}></Portal>
      <div className={isFixed ? "betit bg-hide" : "betit"}>
        <div className={isFixed ? "bg-img-color hide-three" : collect ? "bg-img-color bg-collect" : "bg-img-color bg-collected"} >
        </div>
        <div className='bg-buttom'></div>
        <img src={leftBg} className='left-icon' />
        <img src={rightBg} className='right-icon' />
        <Header lang={lang} collect={collect}></Header>
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
                <Card info={item} bTokens={bTokens} lang={lang} key={index} getLang={getLang} />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}