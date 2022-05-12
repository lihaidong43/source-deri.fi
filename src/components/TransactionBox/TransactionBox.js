import BreatheIcon from "../BreatheEffect/BreatheIcon";
import './transactionBox.less'
import Icon from "../Icon/Icon";
import {useState, useEffect } from "react";
import classNames from "classnames";

export default function TransactionBox({title,subTitle,desc,icon,rgb,close}) {
  const [current, setCurrent] = useState(rgb)
  const iconClass = classNames('trans-box-content-icon',{
    'trans-box-content-icon-fadeout' : current !== rgb
  })
  const subTitleClass = classNames('trans-box-content-bold',{
    'trans-box-content-bold-slideout' : current !== rgb
  })
  const descClass = classNames('trans-box-content-desc',{
    'trans-box-content-desc-slideout' : current !== rgb
  })
  useEffect(() => {
    setCurrent(rgb)
  }, [rgb])
  return (
    <div className='trans-box'>
      <div className='trans-box-title'>
        {title}
        <Icon token='trans-close' height='20' width='20' className='close-icon' onClick={close}/>
      </div>
      <div className='trans-box-content'>
        <div className={iconClass}>
          <BreatheIcon icon={icon} rgb={rgb} key={new Date().getTime()}/>
        </div>
        <div className={subTitleClass}>{subTitle}</div>
        <div className={descClass}>{desc}</div>
      </div>
    </div>
  )
}