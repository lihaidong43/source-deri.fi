import { useState, useEffect, useCallback } from "react";
import classNames from 'classnames'
import Button from '../Button/Button'
import Icon from '../Icon/Icon'
import './card.scss'
import Input from './Input'
import ApiProxy from "../../model/ApiProxy";
import { useWallet } from "use-wallet";
import { useAlert } from 'react-alert'
import DeriNumberFormat from "../../utils/DeriNumberFormat";
export default function Card({ info, lang, bTokens, getLang }) {
  const [amount, setAmount] = useState()
  const [betInfo, setBetInfo] = useState({})
  const [bToken, setBToken] = useState()
  const [balance, setBalance] = useState()
  const [disabled, setDisabled] = useState(true)
  const wallet = useWallet();
  const alert = useAlert();
  const onChange = (value) => {
    setAmount(value)
  }
  const betit = useCallback(() => {
    ApiProxy.request('openBet',{
      write : true, 
      subject : 'open Bet',
      amount: '100', 
      direction : 'long',
      chainId : wallet.chainId, 
      accountAddress : wallet.account, 
      bTokenSymbol: 'ETH' 
    }) 
  })
  
  const getBetInfo = async () => {
    let res = await ApiProxy.request("getBetInfo", { chainId: wallet.chainId, accountAddress: wallet.account, symbol: info.symbol })
    if (res) {
      setBetInfo(res)
    }
  }

  const getWalletBalance = async () => {
    let res = await ApiProxy.request("getWalletBalance", { chainId: wallet.chainId, bTokenSymbol: bToken, accountAddress: wallet.account })
    setBalance(res)
  }

  const betDown = async () => {
    let params = { write: true, subject: 'down', chainId: wallet.chainId, bTokenSymbol: bToken, amount: amount, symbol: info.symbol, accountAddress: wallet.account, direction: 'short' }
    let res = await ApiProxy.request("openBet", params)
    console.log("down", res)
    getBetInfo()
  }

  const betUp = async () => {
    let params = { write: true, subject: 'up', chainId: wallet.chainId, bTokenSymbol: bToken, amount: amount, symbol: info.symbol, accountAddress: wallet.account, direction: 'long' }
    let res = await ApiProxy.request("openBet", params)
    console.log("up", res)
    getBetInfo()
  }

  const betClose = async () => {
    let params = { write: true, subject: 'close', chainId: wallet.chainId, symbol: info.symbol, accountAddress: wallet.account }
    let res = await ApiProxy.request("closeBet", params)
    console.log("betClose", res)
    getBetInfo()
  }

  const boostedUp = async () => {
    let params = { write: true, subject: 'boostedUp', chainId: wallet.chainId, bTokenSymbol: bToken, amount: amount, symbol: info.symbol, accountAddress: wallet.account, boostedUp: true }
    let res = await ApiProxy.request("openBet", params)
    console.log("boostedUp", res)
    getBetInfo()
  }

  useEffect(() => {
    if (wallet.chainId && wallet.account && info) {
      let interval = window.setInterval(() => { getBetInfo() }, 1000 * 3);
      getBetInfo()
      return () => clearInterval(interval);
    }
  }, [wallet, info])

  useEffect(() => {
    if (wallet.chainId && wallet.account && bToken) {
      getWalletBalance()
    }
  }, [wallet, bToken])
  useEffect(() => {
    if (bTokens.length) {
      setBToken(bTokens[0].bTokenSymbol)
    }
  }, [bTokens])
  useEffect(() => {
    if (+amount <= +balance && amount) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [amount])

  return (
    <div className={classNames('card-box', info.unit)}>
      <div className='icon-name'>
        <Icon token={info.symbol} width={45} height={45} />
        <span className='symbol-name'>{info.unit}</span>
        {betInfo.volume && betInfo.volume !== "0" && <div className='entered'>
          {lang['entered']}
        </div>}
      </div>
      <div className='price-box'>
        <div className='symbol-price'>
          $<DeriNumberFormat value={info.price} decimalScale={2} height={30} />
        </div>
        <div className='price-title'>
          {lang['current-price']}
        </div>
      </div>
      <div className='leverage-box'>
        <div className='symbol-leverage'>
          {/* {info.Leverage} */}
          10 X
        </div>
        <div className='leverage-title'>
          {lang['leverage']}  <Icon token="leverage" />
        </div>
      </div>
      <div className={betInfo.volume && betInfo.volume !== "0" ? "input-box position" : "input-box"}>
        {betInfo.volume && betInfo.volume !== "0" ?
          <div className='symbol-pnl'>
            <div className='profit'>
              {lang['profit']}
            </div>
            <div className={+betInfo.pnl > 0 ? "symbol-pnl-num up-pnl" : "symbol-pnl-num down-pnl"}>
              {+betInfo.pnl > 0 ? "+" : "-"}<DeriNumberFormat value={betInfo.pnl} decimalScale={2} />
            </div>
          </div>
          :
          <Input value={amount} onChange={onChange} balance={balance} bToken={bToken} setBToken={setBToken} bTokens={bTokens} lang={lang} />
        }
      </div>
      <div className='btn-box'>
        {betInfo.volume && betInfo.volume !== "0" ?
          <>
            <Button label={lang['close']} onClick={betClose} className="btn close-btn" width="299" height="60" bgColor="#38CB891A" hoverBgColor="#38CB89" borderSize={0} radius={14} fontColor="#38CB89" />
          </>
          : <>
            <Button label={lang['up']} onClick={betUp} disabled={disabled} className="btn up-btn" width="299" height="60" bgColor="#38CB891A" hoverBgColor="#38CB89" borderSize={0} radius={14} fontColor="#38CB89" icon='up' hoverIcon="up-hover" disabledIcon="up-disable" />
            <Button label={lang['down']} onClick={betDown} disabled={disabled} className="btn down-btn" width="299" height="60" bgColor="#FF56301A" hoverBgColor="#FF5630" borderSize={0} radius={14} fontColor="#FF5630" icon='down' hoverIcon="down-hover" disabledIcon="down-disable" />
            {info.powerSymbol && <Button label={lang['boosted-up']} onClick={boostedUp} disabled={disabled} className="btn boosted-btn" width="299" height="60" bgColor="#FFAB001A" hoverBgColor="#FFAB00" borderSize={0} radius={14} fontColor="#FFAB00" icon='boosted-up' hoverIcon="boosted-up-hover" disabledIcon="boosted-up-disable" tip="aa" tipIcon='boosted-hint' hoverTipIcon="boosted-hint-hover" disabledTipIcon="boosted-hint-disable" />}
          </>}
      </div>

    </div>
  )
}