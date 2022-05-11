import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PRIMARY, SECONDARY } from '../../utils/Constants';
import classNames from 'classnames';
import Spinner from '../Spinner/Spinner';
import Icon from '../Icon/Icon';
const Wrapper = styled.div`
    position : ${props => props.position ? props.position : 'initial'};
    bottom : ${props => props.position ? '8px' : '0px'};
    display : flex;
    align-items : center;
    justify-content: center;
    border-radius: ${props => props.radius}px;
    background-color : ${props => props.backgroundColor};
    font-size : ${props => props.fontSize}px;
    font-weight : ${props => props.fontWeight};
    color : ${props => props.fontColor};
    width : ${props => props.width}px;
    border: ${props => props.borderSize}px solid ${props => props.defaultBorderColor};
    // border : 1px solid ${props => props.backgroundColor};
    height : ${props => props.height}px;
    img{
      margin-right:10px;
    }
    &:hover {
      border : 1px solid ${props => props.hoverBorderColor};
      cursor: pointer;
      color : #fff;
    }
    &.selected {
      border : 1px solid ${props => props.selectedBorderColor || props.hoverBorderColor};
    }
    &.disabled:hover {
      // border : none!important;
    }
    &.disabled {
      background : rgba(85, 119, 253, 0.1);
      border : none;
      cursor : not-allowed;
    }
  `  
export default function Button({label,fontColor = '#E0ECFF',type = PRIMARY,bgColor,selectedBorderColor,position ,defaultBorderColor = '#203B60',borderSize = 1,disabled = false , outline = false,isSelected = false,outlineColor = 'rgba(205, 122, 55, 0.5)',icon ,onClick,width = 158,fontSize = 14,fontWeight = '600',height = 48,className,styles = {},radius = 4}){
  const [pending, setPending] = useState(false)
  let backgroundColor ;
  if(bgColor) {
    backgroundColor = bgColor;
  } else if(type === PRIMARY) {
    backgroundColor = '#3756CD';
  } else if(type === SECONDARY){
    backgroundColor = '#203B60' 
  }
  const hoverBorderColor = outline ? outlineColor : 'none';
  
  const click = async (e) => {
    if(onClick && !pending && !disabled){
      setPending(true);
      const result = await onClick(e);
      setPending(false)
    }
  }
  const clazz = classNames(className,{
    selected : isSelected,
    disabled : disabled
  })
  return (
    <Wrapper hoverBorderColor={hoverBorderColor} 
            selectedBorderColor={selectedBorderColor}
            backgroundColor={backgroundColor} 
            fontColor={fontColor} 
            fontSize={fontSize} 
            fontWeight={fontWeight} 
            width={width} 
            position={position}
            defaultBorderColor={defaultBorderColor}
            borderSize={borderSize}
            radius={radius}
            height={height} className={clazz} style={{...styles}} onClick={click}>
      {icon && <Icon token={icon}/>}{pending && <Spinner/>}{label}
    </Wrapper>
  )
}