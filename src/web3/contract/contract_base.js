import { debug } from '../utils/env';
import { getWeb3, getWeb3WithSigner } from '../utils/web3';

const MAX_GAS_AMOUNT = 832731 * 5;

const noOp = () => {}

export class ContractBase {
  constructor(chainId, contractAddress, contractAbi, isNodeEnv=false) {
    this.chainId = chainId;
    this.contractAddress = contractAddress;
    this.contractAbi = contractAbi;
    this.isNodeEnv = isNodeEnv;
  }

  async _init() {
    // re-init web3 and contract when web3 instance is null

    if (!this.web3) {
      // console.log('isNodeEnv', this.isNodeEnv, this.web3)
      if (this.isNodeEnv) {
        this.web3 = await getWeb3WithSigner(this.chainId);
      } else {
        this.web3 = await getWeb3(this.chainId);
      }
      this.contract = new this.web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );
    }
  }

  async _call(method, args = []) {
    let res
    let retry = 2
    while (retry > 0) {
      try {
        await this._init()
        res = await this.contract.methods[method](...args).call();
        break
      } catch(err) {
        debug() && console.log(err)
        retry -= 1
        // remove web3 instance to re-init
        if (retry === 1) {
         await this.web3._update.bind(this.web3)();
        }
      }
    }
    if (retry === 0 && !res) {
      throw new Error(`JSON_RPC_CALL_TIMEOUT: poolAddress:${this.contractAddress} ${method}(${args.join(',')})`);
    }
    return res
  }

  async _estimatedGas(method, args = [], accountAddress) {
    let gas = 0;
    for (let i = 0; i < 2; i++) {
      try {
        gas = await this.contract.methods[method](...args).estimateGas({
          from: accountAddress,
        });
        gas = parseInt(gas * 1.25);
        break;
      } catch (error) {
        debug() && console.log(`-- estimatedGas: ${error}`)
      }
    }
    if (gas === 0) gas = MAX_GAS_AMOUNT;
    return gas;
  }

  async _transact(method, args=[], accountAddress, opts={}) {
    await this._init()
    let { onAccept, onReject, ...restOpts } = opts
    if (!onAccept) {
      onAccept = noOp
    }
    if (!onReject) {
      onReject = noOp
    }
    let [gas, gasPrice] = await Promise.all([
      this._estimatedGas(method, args, accountAddress),
      this.web3.eth.getGasPrice(),
    ]);
    if (this.chainId.toString() === '56') {
      gasPrice = gasPrice * 1.002
    }

    debug() && console.log(`-- method: ${method} from: ${accountAddress} gas: ${gas} gasPrice: ${gasPrice}`)

    return await this.contract.methods[method](...args).send({
      from: accountAddress,
      // from: this.web3.eth.defaultAccount,
      gas,
      gasPrice,
      ...restOpts,
    }).on('transactionHash', (txHash) => {
      onAccept()
    }).on('error', (error) => {
      if (error.code === 4001) { // user reject
        onReject()
      }
    });
  }
}
