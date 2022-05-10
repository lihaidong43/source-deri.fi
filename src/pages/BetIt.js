import Header from "../components/Header/Header";
import './betit.scss'
export default function BetIt({lang}){
  return (
    <div className="betit">
      <div className='bg-img-color'>
        
      </div>
      <Header lang={lang}></Header>
      <div className="main-body">
        <div className='title-des'>
          <div className='title-text'>
            {lang['title-one']}
          </div>
          <div className='title-text-des'>
            {lang['title-two']}
          </div>
        </div>
        <div className='total-pnl'>
          <span>{lang['total-pnl']}:</span>
          <div className='pnl-num'>$100</div>
        </div>
      </div>
    </div>
  )
}