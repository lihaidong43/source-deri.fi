import './portal.scss'
import Icon from '../Icon/Icon'
import classNames from "classnames"
export default function Portal({ collect, setCollect }) {
  const clazz = classNames('portal-header', {
    collect: !collect,
    collected: collect
  })
  return (
    <div className={clazz}>
      <div className='titel-link'>
        <div className="titel-des">DERI.FI - PORTAL FOR ALL DERI PROJECTS</div>
        <div className='link-btn'>
          <div className='bit-it'>BETit</div>
          <a target="_blank" href="https://deri.io/">
            <div className='deri-io'>DERI.IO</div>
          </a>
        </div>
      </div>
      <div className='down-up'>
        <Icon token={collect ? "portal-down" : "portal-up"} onClick={() => setCollect(!collect)} />
      </div>
    </div>
  )
}