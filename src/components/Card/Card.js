import classNames from 'classnames'
import Icon from '../Icon/Icon'
import './card.scss'
export default function Card({ info, lang }) {
  return (
    <div className={classNames('card-box', info.symbol)}>
      <div className='icon-name'>
        <Icon token={info.symbol} width={45} height={45} />
        <span className='symbol-name'>{info.symbol}</span>
      </div>
      <div className='price-box'>
        <div className='symbol-price'>
          ${info.price}
        </div>
        <div className='price-title'>
          {lang['current-price']}
        </div>
      </div>
      <div className=''>
        <div className='symbol-leverage'>
          {info.Leverage}
        </div>
        <div className='leverage-title'>
          {lang['leverage']}
        </div>
      </div>

    </div>
  )
}