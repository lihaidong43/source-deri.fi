// import NetworkSelector from "../NetworkSelector/NetworkSelector";
import WalletConnector from "../WalletConnector/WalletConnector";
import styled  from 'styled-components';
import BetIt from '../../pages/BetIt';

const Wrapper = styled.div`
  &.header {
    font-size :32px;
    background : #FFAB00;
    display : flex;
    padding : 0 110px;
    justify-content: space-between;
    align-items: center;
    height : 96px;

    .f-name {
      font-weight: 800;
      color : #FF7913;
      margin-right : 4px;
    }
    .l-name {
      font-weight: 800;
      color : #FFF;
    }
  }
`

export default function Header ({lang}) {
  return (
    <Wrapper className="header">
      <div className="left">
        <span className="f-name">{lang['bet'].toUpperCase()}</span><span className="l-name">{lang['it']}</span></div>
      <div className="right">
        {/* <NetworkSelector/> */}
        <WalletConnector lang={lang}/>
      </div>
    </Wrapper>
  )
}
