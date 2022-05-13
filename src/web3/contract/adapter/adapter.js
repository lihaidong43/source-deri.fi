import { bg } from "../../utils/bignumber";
import { MAX_UINT256 } from "../../utils/constant";
import { classAdapter } from "./shared";

export const ERC20Adapter = (klass) => {
  klass = classAdapter(
    klass,
    "isUnlocked",
    async function (accountAddress, poolAddress) {
      const allowance = await this.allowance(accountAddress, poolAddress);
      const res = bg(allowance).gt(0);
      return res;
    }
  );
  klass = classAdapter(
    klass,
    "unlock",
    async function (accountAddress, poolAddress, opts) {
      return await this._transact(
        "approve",
        [poolAddress, MAX_UINT256],
        accountAddress,
        opts,
      );
    }
  );
  //klass = overrideMethods(klass, [[processMethod, "balanceOf"]]);
  return klass;
};

export const brokerImplementationAdapter = (klass) => {
  // klass = overrideMethods(klass, [
  //   [processMethod, ""]
  // ])
  return klass
}