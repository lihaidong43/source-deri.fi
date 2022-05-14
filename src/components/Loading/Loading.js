import './loading.scss';

export default function Loading(){
  return (
    <div class="lds-spinner">
      {Array.from(Array(11)).map(i => <div></div>)}
    </div>
  )
}