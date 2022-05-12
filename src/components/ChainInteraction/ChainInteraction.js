import React, { useState ,useEffect,useMemo} from 'react'
import TransactionBox from '../TransactionBox/TransactionBox';
import Intl from '../../model/Intl'

export default function ChainInteraction({title,status = 'pending',close}){
  const config =  useMemo(() => (
    {
      pending : {
        rgb : '85, 119, 253',
        icon : 'trans-waiting',
        subTitle : Intl.get('trade','waiting-for-confirmation'),
        desc :  Intl.get('trade','waiting-for-confirmation-desc')
      },
      success : {
        rgb : '89, 174, 153',
        icon : 'trans-submitted',
        subTitle :  Intl.get('trade','transaction-submitted'),
        desc :  Intl.get('trade','transaction-submitted-desc')
      } ,
      reject : {
        rgb : '206, 94, 94',
        icon : 'trans-rejected',
        subTitle :  Intl.get('trade','transaction-rejected'),
        desc :  Intl.get('trade','transaction-rejected-desc')
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