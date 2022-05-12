import * as api from "../web3/index";
import { show, hide } from "react-functional-modal";
import ChainInteraction from "../components/ChainInteraction/ChainInteraction";
import {MODAL_OPTIONS} from '../utils/Constants'

class ApiProxy {
  status = 'waiting'
  async request(method,options = {}){
    const apis = await import('../web3/index')
    let res = null;
    if(options.write) {
      const {subject} = options
      params.push({
        onAccept : () => {
          this.onProcessing(subject,'success')
          window.setTimeout(() => this.close(subject),2000)
        },
        onReject : () => {
          this.onProcessing(subject,'reject')
          window.setTimeout(() => this.close(subject),2000)
        }
      })
      this.onProcessing(subject,'pending')
    }
    try {
      res = await apis[method].call(this,...params)
    } catch(e){
      console.log(e)
    }
    return this.processResponse(res,options)
  }

  syncRequest(method,params = [], options ={}) {
    const res = api[method].call(this,...params)  
    return this.processResponse(res,options)
  }

  close (subject){
    hide(this.getMessageKey(subject))
  }

  getMessageKey(subject){
    return `transaction-box-${subject.split(/\s+/).join('-')}`
  }

  onProcessing(subject,status){
    const key = this.getMessageKey(subject)
    this.close(key);
    const options = {
      ...MODAL_OPTIONS,
        style : {
          background: "rgba(0, 0, 0, 0.4)" ,
          zIndex : 2,
        },
        key : key
    }
    show(<ChainInteraction title={subject} status={status} close={() => this.close(subject)}/>,options)
  }

  

  processResponse(res,options){
    if(options.includeResponse){
      if(res && res.response){
        return res
      } 
    } else {
      if(res && res.response){
        return res.response.data
      } 
    }
    return res
  }
}

export default new ApiProxy();