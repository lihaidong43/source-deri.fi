import styled from "styled-components"
const images = require.context('../../assets/img', true)
const Wrapper = styled.img`
  width : ${props => props.width }px;
  height : ${props => props.height}px;
  display : flex;
  align-items : center;
`
const Empty = styled.div`
  width : ${props => props.width }px;
  height : ${props => props.height}px;
  display : flex;
  align-items : center;
`
export default function Icon({width,height,token,secondary,className,onClick,style = {},...rest}){
  let img = ''
  try{
    img = images(`./${token}.svg`)
  } catch(e){
    try{
      img = images(`./${secondary}.svg`)
    } catch(e){
      
    }
  }
  return img ? <Wrapper src={img} width={width} height={height} style={{...style}} className={className} onClick={onClick} {...rest}/> : <Empty width={width} height={height} className={className}  ></Empty>
}