import classNames from 'classnames'
import Button from '../Button/Button'
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
      <div className='leverage-box'>
        <div className='symbol-leverage'>
          {info.Leverage}
        </div>
        <div className='leverage-title'>
          {lang['leverage']}  <Icon token="leverage" />
        </div>
      </div>
      <div className='input-box'>

      </div>
      <div className='btn-box'>
        <Button label={lang['up']} className="btn up-btn"  width="299" height="60" bgColor="#38CB891A" hoverBgColor="#38CB89" borderSize={0} radius={14} fontColor="#38CB89" />
        <Button label={lang['down']} className="btn down-btn"  width="299" height="60" bgColor="#FF56301A" hoverBgColor="#FF5630" borderSize={0} radius={14} fontColor="#FF5630" />
        <Button label={lang['boosted-up']} className="btn boosted-btn"  width="299" height="60" bgColor="#FFAB001A" hoverBgColor="#FFAB00" borderSize={0} radius={14} fontColor="#FFAB00" />
      </div>

    </div>
  )
}