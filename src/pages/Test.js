import UnderlineText from "../components/UnderlineText/UnderlineText";
import  ReactTooltip  from 'react-tooltip';

export default function Test(){
  return (
    <div >
      <a data-tip="React-tooltip"> ◕‿‿◕ </a>
      <ReactTooltip place="top" type="dark" effect="float"/>
    </div>
  )
}