import './portal.scss'
import Icon from '../Icon/Icon'
export default function Portal({ collect, setCollect }) {
  return (
    <div className={collect ? "portal-header collect" : "portal-header"}>
      <div className='titel-link'>
        <div className="titel-des">DERI.FI - PORTAL FOR ALL DERI PROJECTS</div>
        <div className='link-btn'>
          <div className='bit-it'>BITit</div>
          <a href="https://deri.io/">
            <div className='deri-io'>DERI.IO</div>
          </a>
        </div>
      </div>
      <div className='down-up'>
        <Icon token={collect ? "portal-down" : "portal-up"} onClick={()=>setCollect(!collect)} />
      </div>
    </div>
  )
}