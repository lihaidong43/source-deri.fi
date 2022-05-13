
import { checkAddress, checkChainId } from "../utils/chain"
import { checkToken } from "../utils/symbol"
import { debug } from "./env";
import { checkCallback } from "./lang";

export const toResponse = (data) => {
  return { success: true, response: { data } }
}

export const toErrorResponse = (error, defaultValue) => {
  return {
    success: false,
    response: {
      data: defaultValue,
      error: { code: error.code || '', message: error.message || error.toString() }
    }
  }
}

const checkCommonArgs = (args) => {
  let { chainId, ...rest } = args
  chainId = checkChainId(chainId)
  return { chainId, ...rest }
}

const checkCommonTxArgs = (args) => {
  let { chainId, accountAddress, onAccept, onReject, ...rest } = args
  chainId = checkChainId(chainId)
  onAccept = checkCallback(onAccept)
  onReject = checkCallback(onReject)
  return { chainId, accountAddress, ...rest }
}

export const queryApi = (fn, defaultValue) => {
  return async (args) => {
    let res
    try {
      // checkInput here
      const newArgs = checkCommonArgs(args)
      // method call
      const data = await fn(newArgs)
      // checkOutput here
      res = toResponse(data)
    } catch (err) {
      res = toErrorResponse(err, defaultValue)
    }
    debug() && console.log('queryApi res:', res)
    return res
  }
}

export const txApi = (fn, defaultValue) => {
  return async (args) => {
    let res
    try {
      // checkInput here
      const newArgs = checkCommonTxArgs(args)
      // send tx
      const data = await fn(newArgs)
      // checkOutput here
      res = toResponse(data)
    } catch (err) {
      res = toErrorResponse(err, defaultValue)
    }
    return res
  }
}


// tx api wrapper
// export const catchTxApiError = async (func, args = []) => {
//   let res;
//   try {
//     const result = await func(...args);
//     res = { success: true, response: { data: result } };
//   } catch (err) {
//     const message = err.errorMessage || err.message || 'Transaction failed';
//     const transactionHash = err.receipt ? err.receipt.transactionHash : '';
//     let reason = ''

//     // fix matamask error at lower gas price
//     const opts = args[args.length - 1]
//     if (typeof opts === 'object' && typeof opts.onReject === 'function') {
//       const { onReject } = opts
//       if (err.code && typeof err.code === 'number') {
//         onReject()
//       }
//     }

//     if (transactionHash && args.length > 0) {
//       try {
//         const chainId = checkChainId(args[0])
//         const web3 = await web3Factory.get(chainId)
//         const tx = await web3.eth.getTransaction(transactionHash)
//         await web3.eth.call(tx, tx.blockNumber)
//       } catch(err) {
//         if (err.message) {
//           const res = JSON.parse(err.message.slice(err.message.indexOf('{')))
//           if (res.message) {
//             reason = res.message.replace('execution reverted: ', '')
//             reason = res.message.replace(/Transaction\sfailed!\s*:/, '')
//           }
//         }
//       }
//     };
//     res = {
//       success: false,
//       response: {
//         error: reason || message.split(':')[0],
//         transactionHash,
//       }
//     }
//   };
//   return res;
// }