
import { checkChainId } from "../utils/chain"
import { debug } from "./env";
import { checkCallback } from "./lang";
import { getWeb3 } from "./web3";

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

export const toTxErrorResponse = async(err, opts) => {
  const { chainId, onReject } = opts
  if (err.code && typeof err.code === 'number') {
    onReject()
  }

  const message = err.message || `Transaction failed: ${err.toString()}`;
  let reason = '', transactionHash = '';
  if (err.receipt) {
    transactionHash = err.receipt.transactionHash
    const blockNumber = err.receipt.blockNumber
    try {
      const web3 = await getWeb3(chainId)
      const tx = await web3.eth.getTransaction(transactionHash)
      await web3.eth.call(tx, blockNumber)
    } catch (error) {
      if (error.message) {
        reason = error.message.replace('execution reverted: ', '')
        reason = reason.replace(/Transaction\sfailed!\s*:/, '')
      }
    }
  }

  return {
    success: false,
    response: {
      error: {
        code: err.code || '',
        message: reason || message
      },
      transactionHash,
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
  onAccept = checkCallback(onAccept, 'onAccept')
  onReject = checkCallback(onReject, 'Reject')
  return { chainId, accountAddress, onAccept, onReject, ...rest }
}

export const queryApi = (fn, defaultValue) => {
  return async (args) => {
    let res
    try {
      // checkInput here
      const newArgs = checkCommonArgs(args)
      // method call
      const data = await fn(newArgs)
      debug() && console.log('queryApi data:', data)
      // checkOutput here
      res = toResponse(data)
    } catch (err) {
      debug() && console.log('queryApi error:', err)
      res = toErrorResponse(err, defaultValue)
    }
    return res
  }
}

export const txApi = (fn) => {
  return async (args) => {
    let res
    try {
      // checkInput here
      const newArgs = checkCommonTxArgs(args)
      // send tx
      const data = await fn(newArgs)
      debug() && console.log('txApi data:', data)
      // checkOutput here
      res = toResponse(data)
    } catch (err) {
      debug() && console.log('txApi error:', err)

      // process err
      const { chainId, onAccept, onReject } = args
      res = await toTxErrorResponse(err, { chainId, onAccept, onReject })
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