import BigNumber from 'bignumber.js'

BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: 256,
})

export const bg = (value, base = 0) => {
  if (base === 0) {
    return BigNumber(value)
  }
  if (base > 0) {
    return BigNumber(value).times(`1${'0'.repeat(base)}`)
  } else {
    return BigNumber(value).div(`1${'0'.repeat(-base)}`)
  }
}
 export const max = (value1, value2) => {
  if (value1.gte(value2)) {
    return value1;
  }
  return value2;
};

export const min = (value1, value2) => {
  if (value1.lte(value2)) {
    return value1;
  }
  return value2;
};

export const fromWei = (value) => bg(value, -18).toString()

export const toWei = (value) => bg(value, 18).toFixed(0).toString()