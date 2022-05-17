import { useState, useEffect, useCallback } from "react";
import classNames from 'classnames'
import Button from '../Button/Button'
import Icon from '../Icon/Icon'
import './card.scss'
import Input from './Input'
import ApiProxy from "../../model/ApiProxy";
import { useWallet } from "use-wallet";
import useChain from '../../hooks/useChain';
import { useAlert } from 'react-alert'
import DeriNumberFormat from "../../utils/DeriNumberFormat";
import LineChart from "../LineChart/LineChart";
import { eqInNumber } from "../../utils/utils";
import UnderlineText from "../UnderlineText/UnderlineText";
import { DeriEnv } from '../../web3'
let timer;
export default function Card({ info, lang, bTokens, getLang }) {
  const [amount, setAmount] = useState(100)
  const [betInfo, setBetInfo] = useState({})
  const [bToken, setBToken] = useState()
  const [balance, setBalance] = useState()
  const [disabled, setDisabled] = useState(true)
  const [inputDisabled, setInputDisabled] = useState(true)
  const wallet = useWallet();
  const chains = useChain()
  const chain = chains.find((item) => eqInNumber(item.chainId, wallet.chainId))
  const alert = useAlert();
  const onChange = (value) => {
    setAmount(value)
  }

  const isNetwork = () => {
    return chains.find((item) => eqInNumber(item.chainId, wallet.chainId))
  }

  const getBetInfo = async () => {
    if (wallet.isConnected()) {
      let res = await ApiProxy.request("getBetInfo", { chainId: wallet.chainId, accountAddress: wallet.account, symbol: info.symbol })
      if (res.symbol) {
        setBetInfo(res)
        return res
      }
    } else {
      let chainId = DeriEnv.get() === "prod" ? 56 : 97
      let res = await ApiProxy.request("getBetInfo", { chainId: chainId, symbol: info.symbol })
      if (res.symbol) {
        setBetInfo(res)
        return res
      }
    }

    return false
  }

  const getBetInfoTimeOut = (action) => {
    timer = window.setTimeout(async () => {
      let res = await action();
      if (res) {
        getBetInfoTimeOut(action);
      }
    }, 6000)
  }

  const getIsApprove = async () => {
    let res = await ApiProxy.request("isUnlocked", { chainId: wallet.chainId, accountAddress: wallet.account, bTokenSymbol: bToken })
    return res
  }

  const getWalletBalance = async () => {
    let res = await ApiProxy.request("getWalletBalance", { chainId: wallet.chainId, bTokenSymbol: bToken, accountAddress: wallet.account })
    setBalance(res)
  }


  const betClose = async () => {
    let params = { includeResponse: true, write: true, subject: 'EXIT', chainId: wallet.chainId, symbol: betInfo.symbol, accountAddress: wallet.account }
    let res = await ApiProxy.request("closeBet", params)
    if (res.success) {
      alert.success(`${+betInfo.volume < 0 ? lang['buy'] : lang['sell']}  ${res.response.data.volume} ${info.unit} ${betInfo.isPowerSymbol ? lang['powers'] : ""} `, {
        timeout: 8000,
        isTransaction: true,
        transactionHash: res.response.data.transactionHash,
        link: `${chain.viewUrl}/tx/${res.response.data.transactionHash}`,
        title: `${+betInfo.volume < 0 ? lang['buy-order-executed'] : lang['sell-order-executed']}`
      })
    } else {
      if (res.response.transactionHash === "") {
        return false;
      }
      alert.error(`${lang['transaction-failed']} : ${res.response.error}`, {
        timeout: 300000,
        isTransaction: true,
        transactionHash: res.response.transactionHash,
        link: `${chain.viewUrl}/tx/${res.response.transactionHash}`,
        title: lang['buy-order-failed']
      })
    }
    console.log("betClose", res)
    getBetInfo()
  }

  const openBet = async (type) => {
    if (!wallet.isConnected()) {
      alert.error("Connect your wallet.", {
        timeout: 300000,
        isTransaction: true,
        title: 'Connect Wallet'
      })
      return false
    }
    if (!isNetwork()) {
      alert.error("Current network is not supported. ", {
        timeout: 300000,
        isTransaction: true,
        title: 'Wrong Network'
      })
      return false
    }

    if (+amount > +balance) {
      alert.error("the input amout is greater than your balance.", {
        timeout: 300000,
        isTransaction: true,
        title: 'Invalid Amount'
      })
      return false;
    }
    let isApproved = await getIsApprove()
    let direction = type === "up" || type === "boostedUp" ? "long" : "short"
    let boostedUp = type === "boostedUp" ? true : false
    let params = { includeResponse: true, write: true, subject: type.toUpperCase(), chainId: wallet.chainId, bTokenSymbol: bToken, amount: amount, symbol: info.symbol, accountAddress: wallet.account, boostedUp: boostedUp, direction: direction }
    if (!isApproved) {
      let paramsApprove = { includeResponse: true, write: true, subject: 'APPROVE', chainId: wallet.chainId, bTokenSymbol: bToken, accountAddress: wallet.account, direction: direction, approved: false }
      let approved = await ApiProxy.request("unlock", paramsApprove)
      if (approved) {
        if (approved.success) {
          alert.success(`Approve ${bToken}`, {
            timeout: 8000,
            isTransaction: true,
            transactionHash: approved.response.data.transactionHash,
            link: `${chain.viewUrl}/tx/${approved.response.data.transactionHash}`,
            title: 'Approve Executed'
          })
        } else {
          if (approved.transactionHash === "") {
            return false;
          }
          alert.error(`Transaction Failed ${approved.response.error.message}`, {
            timeout: 300000,
            isTransaction: true,
            transactionHash: approved.response.transactionHash,
            link: `${chain.viewUrl}/tx/${approved.response.transactionHash}`,
            title: 'Approve Failed'
          })
          return false;
        }
      }
      params["approved"] = approved.success
    }
    let res = await ApiProxy.request("openBet", params)
    console.log(type, res)
    if (res.success) {
      alert.success(`${+res.response.data.volume > 0 ? lang['buy'] : lang['sell']} ${res.response.data.volume} ${info.unit} ${boostedUp ? lang['powers'] : ''} `, {
        timeout: 8000,
        isTransaction: true,
        transactionHash: res.response.data.transactionHash,
        link: `${chain.viewUrl}/tx/${res.response.data.transactionHash}`,
        title: `${direction === "long" ? lang['buy-order-executed'] : lang['sell-order-executed']}`
      })
    } else {
      if (res.response.transactionHash === "") {
        return false;
      }
      alert.error(`${lang['transaction-failed']} : ${res.response.error.message}`, {
        timeout: 300000,
        isTransaction: true,
        transactionHash: res.response.transactionHash,
        link: `${chain.viewUrl}/tx/${res.response.transactionHash}`,
        title: `${direction === "long" ? lang['buy-order-failed'] : lang['sell-order-failed']}`
      })
    }
    getBetInfo()
  }


  useEffect(() => {
    if (info) {
      clearTimeout(timer)
      getBetInfoTimeOut(getBetInfo)
      getBetInfo()
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
      setBetInfo({})
    }
  }, [bTokens])
  useEffect(() => {
    if (+amount <= +balance && +amount) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [amount, balance])

  useEffect(() => {
    if (balance && +balance > 0 && betInfo.markPrice) {
      setInputDisabled(false)
    } else {
      setInputDisabled(true)
    }
  }, [balance, betInfo])

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
          $<DeriNumberFormat value={betInfo.markPrice} decimalScale={2} height={30} />
        </div>
        <div className='price-title'>
          {lang['current-price']}
        </div>
      </div>
      <div className='leverage-box'>
        <div className='symbol-leverage'>
          {/* {info.Leverage} */}
          {info.leverage} X
        </div>
        <div className='leverage-title'>
          {lang['leverage']} <UnderlineText tip={lang['leverage-tip']} key={info.symbol} > <Icon token="leverage" /></UnderlineText>
        </div>
      </div>
      <div className={betInfo.volume && betInfo.volume !== "0" ? "input-box position" : "input-box"}>
        {betInfo.volume && betInfo.volume !== "0" ?
          <div className='symbol-pnl'>
            <div className='profit'>
              {lang['profit']}
            </div>
            <div className={+betInfo.pnl > 0 ? "symbol-pnl-num up-pnl" : "symbol-pnl-num down-pnl"}>
              {+betInfo.pnl > 0 ? "+" : ""}<DeriNumberFormat value={betInfo.pnl} decimalScale={2} />
            </div>
          </div>
          :
          <Input value={amount} onChange={onChange} inputDisabled={inputDisabled} setBalance={setBalance} balance={balance} bToken={bToken} setBToken={setBToken} bTokens={bTokens} lang={lang} />
        }
      </div>
      <div className='btn-box'>
        {betInfo.volume && betInfo.volume !== "0" ?
          <>
            <div className='line-chart'><LineChart symbol={info.markpriceSymbol} color={+betInfo.pnl > 0 ? "#38CB89" : "#FF5630"} /></div>
            <Button label={lang['exit']} onClick={betClose} className="btn close-btn" width="299" height="60" bgColor={+betInfo.pnl > 0 ? "#38CB891A" : "#FF56301A"} hoverBgColor={+betInfo.pnl > 0 ? "#38CB89" : "#FF5630"} borderSize={0} radius={14} fontColor={+betInfo.pnl > 0 ? "#38CB89" : "#FF5630"} />
          </>
          : <>
            <Button label={lang['up']} onClick={() => openBet("up")} isAlert={true} disabled={disabled} className="btn up-btn" width="299" height="60" bgColor="#38CB891A" hoverBgColor="#38CB89" borderSize={0} radius={14} fontColor="#38CB89" icon='up' hoverIcon="up-hover" disabledIcon="up-disable" />
            <Button label={lang['down']} onClick={() => openBet("down")} isAlert={true} disabled={disabled} className="btn down-btn" width="299" height="60" bgColor="#FF56301A" hoverBgColor="#FF5630" borderSize={0} radius={14} fontColor="#FF5630" icon='down' hoverIcon="down-hover" disabledIcon="down-disable" />
            {info.powerSymbol && <Button label={lang['boosted-up']} isAlert={true} onClick={() => openBet("boostedUp")} disabled={disabled} className="btn boosted-btn" width="299" height="60" bgColor="#FFAB001A" hoverBgColor="#FFAB00" borderSize={0} radius={14} fontColor="#FFAB00" icon='boosted-up' hoverIcon="boosted-up-hover" disabledIcon="boosted-up-disable" tip={getLang('boosted-up-tip', { symbol: info.unit, powers: info.powerSymbol.symbol })} tipIcon='boosted-hint' hoverTipIcon="boosted-hint-hover" disabledTipIcon="boosted-hint-disable" />}
          </>}
      </div>

    </div>
  )
}