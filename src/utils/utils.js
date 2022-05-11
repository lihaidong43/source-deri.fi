
import Cookies from 'js-cookie'
import { COOKIE_DERI_DOMAIN } from './Constants'
import { BigNumber as bg} from 'bignumber.js';

export function setCookie(name,value,expires = 365 ,domain = COOKIE_DERI_DOMAIN,path = '/'){
  if(name && value){
    Cookies.set(name,value,{expires : expires,domain : domain,path : path})
  }
}

export function getCookie(name){
  return Cookies.get(name)
}

export function removeCookie(name,domain = COOKIE_DERI_DOMAIN, path = '/'){
  Cookies.remove(name,{domain,path})
}


export function formatNumber(number,decimal){
  let effectiveDecimal = decimal
  let value = number;
  if(/\d+\.0*[1-9]+/.test(value)  && (+bg(value).toFixed((decimal || 2))) === 0){
    effectiveDecimal = countDecimal(Math.abs(value)) + 2
  }
  value = bg(value).toFixed(effectiveDecimal)
}


export function countDecimal(n){
  return -Math.floor( Math.log10(n) + 1);
}

export function formatAddress(address){
  return address && `${address.substr(0,6)}...${address.substr(-4)}`
}

export function isElementInViewport (el) {
  var rect = el ? el.getBoundingClientRect() : {}
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}
