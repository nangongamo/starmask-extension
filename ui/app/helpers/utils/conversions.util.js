import { NANOSTC, MILLISTC, STC } from '../constants/common';
import { addHexPrefix } from '../../../../app/scripts/lib/util';
import {
  conversionUtil,
  addCurrencies,
  subtractCurrencies,
} from './conversion-util';
import { formatCurrency } from './confirm-tx.util';

export function bnToHex(inputBn) {
  return addHexPrefix(inputBn.toString(16));
}

export function hexToDecimal(hexValue) {
  return conversionUtil(hexValue, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
  });
}

export function decimalToHex(decimal) {
  return conversionUtil(decimal, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
  });
}

export function getEthConversionFromWeiHex({
  value,
  fromCurrency = STC,
  conversionRate,
  numberOfDecimals = 6,
}) {
  const denominations = [fromCurrency, MILLISTC, NANOSTC];

  let nonZeroDenomination;

  for (let i = 0; i < denominations.length; i++) {
    const convertedValue = getValueFromWeiHex({
      value,
      conversionRate,
      fromCurrency,
      toCurrency: fromCurrency,
      numberOfDecimals,
      toDenomination: denominations[i],
    });

    if (convertedValue !== '0' || i === denominations.length - 1) {
      nonZeroDenomination = `${ convertedValue } ${ denominations[i] }`;
      break;
    }
  }

  return nonZeroDenomination;
}

export function getValueFromWeiHex({
  value,
  fromCurrency = STC,
  toCurrency,
  conversionRate,
  numberOfDecimals,
  toDenomination,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromCurrency,
    toCurrency,
    numberOfDecimals,
    fromDenomination: NANOSTC,
    toDenomination,
    conversionRate,
  });
}

export function getWeiHexFromDecimalValue({
  value,
  fromCurrency,
  conversionRate,
  fromDenomination,
  invertConversionRate,
}) {
  return conversionUtil(value, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    toCurrency: fromCurrency,
    fromCurrency,
    conversionRate,
    invertConversionRate,
    fromDenomination,
    toDenomination: `NANO${ fromCurrency }`,
  });
}

export function addHexWEIsToDec(aHexWEI, bHexWEI) {
  return addCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    fromDenomination: 'NANOSTC',
    numberOfDecimals: 6,
  });
}

export function subtractHexWEIsToDec(aHexWEI, bHexWEI) {
  return subtractCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    fromDenomination: 'NANOSTC',
    numberOfDecimals: 6,
  });
}

export function decEthToConvertedCurrency(
  ethTotal,
  convertedCurrency,
  conversionRate,
) {
  return conversionUtil(ethTotal, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromCurrency: 'STC',
    toCurrency: convertedCurrency,
    numberOfDecimals: 2,
    conversionRate,
  });
}

export function decGWEIToHexWEI(decGWEI) {
  return conversionUtil(decGWEI, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
    fromDenomination: 'MILLISTC',
    toDenomination: 'NANOSTC',
  });
}

export function hexWEIToDecGWEI(decGWEI) {
  return conversionUtil(decGWEI, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromDenomination: 'NANOSTC',
    toDenomination: 'MILLISTC',
  });
}

export function decETHToDecWEI(decEth) {
  return conversionUtil(decEth, {
    fromNumericBase: 'dec',
    toNumericBase: 'dec',
    fromDenomination: 'STC',
    toDenomination: 'NANOSTC',
  });
}

export function hexWEIToDecETH(hexWEI) {
  return conversionUtil(hexWEI, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
    fromDenomination: 'NANOSTC',
    toDenomination: 'STC',
  });
}

export function addHexes(aHexWEI, bHexWEI) {
  return addCurrencies(aHexWEI, bHexWEI, {
    aBase: 16,
    bBase: 16,
    toNumericBase: 'hex',
    numberOfDecimals: 6,
  });
}

export function sumHexWEIs(hexWEIs) {
  return hexWEIs.filter(Boolean).reduce(addHexes);
}

export function sumHexWEIsToUnformattedFiat(
  hexWEIs,
  convertedCurrency,
  conversionRate,
) {
  const hexWEIsSum = sumHexWEIs(hexWEIs);
  const convertedTotal = decEthToConvertedCurrency(
    getValueFromWeiHex({
      value: hexWEIsSum,
      toCurrency: 'STC',
      numberOfDecimals: 4,
    }),
    convertedCurrency,
    conversionRate,
  );
  return convertedTotal;
}

export function sumHexWEIsToRenderableFiat(
  hexWEIs,
  convertedCurrency,
  conversionRate,
) {
  const convertedTotal = sumHexWEIsToUnformattedFiat(
    hexWEIs,
    convertedCurrency,
    conversionRate,
  );
  return formatCurrency(convertedTotal, convertedCurrency);
}
