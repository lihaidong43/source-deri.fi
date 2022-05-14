import { useState, useEffect, useRef } from 'react'
import Icon from '../Icon/Icon';
import ApiProxy from '../../model/ApiProxy';
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import './input.scss'
export default function Input({ value, lang, onChange, balance,focus, bToken, bTokens, setBToken, onBlur, onFocus, disabled, readOnly, placeholder }) {
  const inputRef = useRef(null);
  const [isShowToken, setIsShowToken] = useState(false)
  const change = e => {
    const { value } = e.target
    onChange(value)
  }
  useEffect(() => {
    inputRef.current.setCustomValidity('')
    if (inputRef.current && focus) {
      inputRef.current.focus();
    }
  }, [focus])
  return (
    <div className='input-box-info'>
      <div className='balance-bet'>
        <div className='bet'>
          {lang['bet'].toUpperCase()}
        </div>
        <div className="balance">
          {lang['balance']}:<DeriNumberFormat value={balance} displayType='text' decimalScale={2} /> 
        </div>
      </div>
      <div className='input-token'>
        <input placeholder={placeholder} type='number' onBlur={onBlur} onFocus={onFocus} disabled={disabled} value={value} ref={inputRef} onChange={change} readOnly={readOnly} />
        <div className='baseToken'>
          <Icon token={bToken} width="22" height="22" />  {bToken} <Icon token="select-token" onClick={() => { setIsShowToken(!isShowToken) }} />
        </div>
        {isShowToken && <div className='token-list'>
          <div className='select-title'>
            {lang['select-coin']}
          </div>
          <div className='token-info'>
            {bTokens && bTokens.map((item, index) => {
              return (
                <div key={index}>
                  <Icon token={item.bTokenSymbol} width={23} height={23} onClick={() => { setBToken(item.bTokenSymbol) }} />
                  {bToken === item.bTokenSymbol && <div className='check-bToken'></div>}
                </div>
              )
            })}
          </div>
        </div>}
      </div>
    </div>
  )
}