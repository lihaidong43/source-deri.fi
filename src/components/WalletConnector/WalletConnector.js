import { useCallback } from 'react';
import { useWallet } from 'use-wallet';
import Button from '../Button/Button';
import { formatAddress } from '../../utils/utils';

export default function WalletConnector({lang}){
  const wallet = useWallet()
  const connect = useCallback(() => {
    wallet.connect();
  },[wallet])
  return(
    <div>
      <Button label={wallet.isConnected() ? formatAddress(wallet.account) : lang['connect-wallet']} onClick={connect}></Button> 
    </div>
  )
}