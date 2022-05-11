import { useCallback } from 'react';
import { useWallet } from 'use-wallet';
import Button from '../Button/Button';
import { formatAddress } from '../../utils/utils';

export default function WalletConnector({lang,bgColor = '#FFAB00'}){
  const wallet = useWallet()
  const connect = useCallback(() => {
    wallet.connect();
  },[wallet])
  return(
    <div >
      <Button  bgColor={bgColor} fontSize={16} fontColor='#FFF' borderSize='0' width={200} height={48}  outline={false} radius={15} label={wallet.isConnected() ? formatAddress(wallet.account) : lang['connect-wallet']} onClick={connect}></Button> 
    </div>
  )
}