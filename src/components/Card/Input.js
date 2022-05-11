import { useState, useEffect, useRef } from 'react'
import Icon from '../Icon/Icon';
import './input.scss'
export default function Input({ value, lang, onChange, focus, token, selectToken, onBlur, onFocus, disabled, readOnly, placeholder }) {
  const inputRef = useRef(null);
  const [balance, setBalance] = useState(0)
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
          {lang['balance']}:{balance}
        </div>
      </div>
      <div className='input-token'>
        <input placeholder={placeholder} type='number' onBlur={onBlur} onFocus={onFocus} disabled={disabled} value={value} ref={inputRef} onChange={change} readOnly={readOnly} />
        <div className='baseToken'>
          <Icon token="BTC" width="22" height="22" />  BUSD <Icon token="select-token" />
        </div>
      </div>
    </div>
  )
}