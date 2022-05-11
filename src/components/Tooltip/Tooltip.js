import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import React ,{ useRef } from "react";

const Wrapper = styled(ReactTooltip)`
  &.__react_component_tooltip{
    padding : 0;
  }
  &.__react_component_tooltip.show {
    // position : absolute;
    opacity: 1;
    width : ${props => props.width || 216}px;
    padding : ${props => props.padding}px;
    border-radius: ${props => props.borderRadius}px;
    max-width : ${props => window.screen.availWidth}px;
    z-index : ${props => props.zIndex || 2};
    white-space: initial;
    font-weight : 600;
  }
  &.__react_component_tooltip.show::after{
    content: none;
  }
  &.__react_component_tooltip.show.place-right{
    margin: 0px;
  }
  &.__react_component_tooltip .multi-line{
    text-align : left;
  }
  &.__react_component_tooltip.show.place-bottom {
    margin : 0;
  }
`

const Tooltip = React.forwardRef((props,ref) =>{
  const {effect = 'solid' ,place = 'bottom',className = 'tooltip',type = 'info',globalEventOff= 'click',padding,backgroundColor = '#203B60',...rest} = props
  return(
    <Wrapper {...rest} ref={ref} effect={effect} place={place} className={className} type={type} globalEventOff={globalEventOff} backgroundColor={backgroundColor} padding={padding} clickable width={props.width}>
      {props.children}
    </Wrapper>
  )
})

export default Tooltip