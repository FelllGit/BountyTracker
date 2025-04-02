import numeral from "numeral";

export const formatValue = (value: number): string => {
  if (value >= 1000) {
    // For 1000 and above, use abbreviated format with 2 decimal places
    return numeral(value).format("0.00a");
  } else {
    // For numbers below 1000, show whole numbers without decimals
    return numeral(value).format("0");
  }
};
