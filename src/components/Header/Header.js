// import NetworkSelector from "../NetworkSelector/NetworkSelector";
import WalletConnector from "../WalletConnector/WalletConnector";

export default function Header ({lang}) {
  return (
    <div>
      <div>Bet it</div>
      <div>
        {/* <NetworkSelector/> */}
        <WalletConnector lang={lang}/>
      </div>
    </div>
  )
}
