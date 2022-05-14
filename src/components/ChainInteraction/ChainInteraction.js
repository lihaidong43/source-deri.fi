import React, { useState ,useEffect,useMemo} from 'react'
import TransactionBox from '../TransactionBox/TransactionBox';
import Intl from '../../model/Intl'
import Label from '../Label/Label';
import Loading from '../Loading/Loading';

export default function ChainInteraction({title,status = 'pending',isApproved,approved,close,direction}){
  const config =  useMemo(() => (
    {
      pending : {
        rgb : '255, 171, 0',
        icon : 'trans-waiting',
        subTitle : Intl.get('betit','waiting-for-confirmation-title')
      },
      success : {
        rgb : '56, 203, 137',
        icon : 'trans-submitted',
        subTitle :  Intl.get('betit','transaction-submitted')
      } ,
      reject : {
        rgb : '255, 86, 48',
        icon : 'trans-rejected',
        subTitle :  Intl.get('betit','transaction-rejected')
      }
    }
  ), [])
  const [data, setData] = useState(config[status])

  useEffect(() => {
    if(status){
      setData(config[status])    
    } 
  }, [status])
  return (<TransactionBox title={title} rgb={data['rgb']} status={status} approved={approved} direction={direction} subTitle={data['subTitle']} desc={data['desc']} icon={data['icon']} close={close}/>)
}
