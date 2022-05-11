import classNames from 'classnames'
import Icon from '../Icon/Icon'
import './card.scss'
export default function Card({info,lang}){
  return(
    <div className={classNames('card-box',info.symbol)}>
      <div className='icon-name'>
        <Icon token={info.symbol} width={45} height={45} />
        <span className={classNames('symbol-name',info.symbol)}>{info.symbol}</span> 
      </div>
    </div>
  )
}