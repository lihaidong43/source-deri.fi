import React, { useState ,useEffect,useMemo} from 'react'
import TransactionBox from '../TransactionBox/TransactionBox';
import Intl from '../../model/Intl'

export default function ChainInteraction({title,status = 'pending',close}){
  const config =  useMemo(() => (
    {
      pending : {
        rgb : '255, 171, 0',
        icon : 'trans-waiting',
        subTitle : Intl.get('betit','waiting-for-confirmation'),
        desc :  Intl.get('betit','waiting-for-confirmation-desc')
      },
      success : {
        rgb : '56, 203, 137',
        icon : 'trans-submitted',
        subTitle :  Intl.get('betit','transaction-submitted'),
        desc :  Intl.get('betit','transaction-submitted-desc')
      } ,
      reject : {
        rgb : '255, 86, 48',
        icon : 'trans-rejected',
        subTitle :  Intl.get('betit','transaction-rejected'),
        desc :  Intl.get('betit','transaction-rejected-desc')
      }
    }
  ), [])
  const [data, setData] = useState(config[status])

  useEffect(() => {
    if(status){
      setData(config[status])    
    } 
  }, [status])
  return (<TransactionBox title={title} rgb={data['rgb']}  subTitle={data['subTitle']} desc={data['desc']} icon={data['icon']} close={close}/>)
}