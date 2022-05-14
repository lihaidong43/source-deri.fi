import BreatheIcon from "../BreatheEffect/BreatheIcon";
import './transactionBox.scss'
import Icon from "../Icon/Icon";
import {useState, useEffect } from "react";
import classNames from "classnames";
import Label from '../Label/Label';
import Loading from '../Loading/Loading';
import styled from 'styled-components';

export default function TransactionBox({title,subTitle,icon,rgb,close,direction,approved,status}) {
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
        <Icon token='trans-close' height='10' width='10' className='close-icon' onClick={close}/>
      </div>
      <div className='trans-box-content'>
        <div className={iconClass}>
          <BreatheIcon icon={icon} rgb={rgb} key={new Date().getTime()}/>
        </div>
        <div className={subTitleClass}>{subTitle}</div>
        <ApproveStatus direction={direction} approved={approved} status={status}/>
      </div>
    </div>
  )
}

const StatusBarWrapper = styled.div`
  &.status-bar {
    display : flex;
    flex-direction : row;
    justify-content: center;
    margin-top : 30px;
    .approve-label ,.process-bar {
      display : ${props => props.approved === undefined ? 'none' : 'block'};
    }
    .process-bar {
      width : 120px;
      height : 6px;
      border-radius : 3px;
    }
  }
  &.status-bar.pending ,&.status-bar.pending .approve-label{
  }
  &.status-bar.pending .direction-label{
    background : rgba(255, 171, 0, 0.2);
    color : rgba(255, 171, 0, 0.6);
    border :1.5px solid rgba(255, 171, 0, 0.2);
    border-radius: 15px;
  }
  &.status-bar.submit, &.status-bar.submit .approve-label,&.status-bar.submit .direction-label{
    background : #38CB89;
  }
  &.status-bar.submit,&.status-bar.submit .approve-label,&.status-bar.submit .direction-label {
    background : #FF5630;
  }

`


function ApproveStatus({isApproved,approved,direction,status}){
  // const [content, setContent] = useState()
  const statusBarClass = classNames('status-bar',status)

  // useEffect(() => {
  //   if(isApproved !== undefined && approved !== undefined){
  //     if(isApproved === false && approved === false){
  //       setContent(<Label text='APPROVE' bgColor='#FFAB00' icon={<Loading/>}/>)
  //     } else if(isApproved === false && approved === true) {
  //       setContent(<Label text='APPROVE' bgColor='#FFAB00' icon={<Loading/>}/>)
  //     } else if(isApproved === true && approved === false){
  //       setContent(<Label text='APPROVE' bgColor='#FFAB00' icon={<Loading/>}/>)
  //     } else if(isApproved === true && approved === true){
  //       setContent(<Label text='APPROVE' bgColor='#FFAB00' icon={<Loading/>}/>)
  //     }
  //   } else {
  //     setContent(<Label text={direction} bgColor={`rgb(${rgb})`} icon={<Loading/>}/>)
  //   }

  // }, [isApproved,approved])

  return(
      <StatusBarWrapper className={statusBarClass}>
        <Label text='APPROVE' className='approve-label'/>
        <div className="process-bar"></div>
        <Label text={direction} className='direction-label'  width='90' height='30'/>
      </StatusBarWrapper>
    )
}