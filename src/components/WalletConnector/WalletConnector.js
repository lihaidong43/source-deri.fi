import { useCallback,useState,useEffect } from 'react';
import { useWallet } from 'use-wallet';
import Button from '../Button/Button';
import { formatAddress } from '../../utils/utils';

export default function WalletConnector({lang,bgColor = '#FFAB00'}){
  const [bntColor, setBntColor] = useState('#FFAB00');
  const wallet = useWallet()
  const connect = useCallback(() => {
    if(!wallet.isConnected()){
      wallet.connect();
    }
  },[wallet])

  useEffect(() => {
    if(wallet.isConnected()) {
      setBntColor('#FFAB00')
    } else {
      setBntColor(bgColor)
    }
  }, [bgColor,wallet]);
  
  return(
    <div >
      <Button  bgColor={bntColor} icon={wallet.isConnected() && 'injected'} borderSize='2' defaultBorderColor='#fff' fontSize={16} fontColor='#FFF' width={200} height={48}  outline={false} radius={15} label={wallet.isConnected() ? formatAddress(wallet.account) : lang['connect-wallet']} onClick={connect}></Button> 
    </div>
  )
}