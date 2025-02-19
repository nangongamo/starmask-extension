import {
  conversionUtil,
  multiplyCurrencies,
} from '../../helpers/utils/conversion-util';
import { addHexPrefix } from '../../../../app/scripts/lib/util';

const MIN_GAS_PRICE_DEC = '0';
const MIN_GAS_PRICE_HEX = parseInt(MIN_GAS_PRICE_DEC, 10).toString(16);
const MIN_GAS_LIMIT_DEC = '100';
const MIN_GAS_LIMIT_HEX = parseInt(MIN_GAS_LIMIT_DEC, 10).toString(16);

const MIN_GAS_PRICE_GWEI = addHexPrefix(
  conversionUtil(MIN_GAS_PRICE_HEX, {
    fromDenomination: 'NANOSTC',
    toDenomination: 'STC',
    fromNumericBase: 'hex',
    toNumericBase: 'hex',
    numberOfDecimals: 1,
  }),
);

const MIN_GAS_TOTAL = multiplyCurrencies(MIN_GAS_LIMIT_HEX, MIN_GAS_PRICE_HEX, {
  toNumericBase: 'hex',
  multiplicandBase: 16,
  multiplierBase: 16,
});

const TOKEN_TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb';

const INSUFFICIENT_FUNDS_ERROR = 'insufficientFunds';
const INSUFFICIENT_TOKENS_ERROR = 'insufficientTokens';
const NEGATIVE_ETH_ERROR = 'negativeETH';
const INVALID_RECIPIENT_ADDRESS_ERROR = 'invalidAddressRecipient';
const INVALID_RECIPIENT_ADDRESS_NOT_ETH_NETWORK_ERROR =
  'invalidAddressRecipientNotEthNetwork';
const REQUIRED_ERROR = 'required';
const KNOWN_RECIPIENT_ADDRESS_ERROR = 'knownAddressRecipient';
const CONTRACT_ADDRESS_ERROR = 'contractAddressError';
const CONFUSING_ENS_ERROR = 'confusingEnsDomain';
const ACCOUNT_NOT_EXISTS = 'accountNotExists';
const RECIPIENT_ACCOUNT_NOT_ACCEPT_TOKEN_ERROR =
  'recipientAccountNotAcceptToken';
const RECIPIENT_ACCOUNT_NOT_ADD_NFT_GALLERY_ERROR =
  'recipientAccountNotAddNFTGallery';

const SIMPLE_GAS_COST = '0x1e51f'; // Hex for 124191, cost of a simple send.
const BASE_TOKEN_GAS_COST = '0x1e51f'; // Hex for 124191, a base estimate for token transfers.

export {
  ACCOUNT_NOT_EXISTS,
  INSUFFICIENT_FUNDS_ERROR,
  INSUFFICIENT_TOKENS_ERROR,
  INVALID_RECIPIENT_ADDRESS_ERROR,
  KNOWN_RECIPIENT_ADDRESS_ERROR,
  CONTRACT_ADDRESS_ERROR,
  INVALID_RECIPIENT_ADDRESS_NOT_ETH_NETWORK_ERROR,
  MIN_GAS_LIMIT_DEC,
  MIN_GAS_LIMIT_HEX,
  MIN_GAS_PRICE_DEC,
  MIN_GAS_PRICE_GWEI,
  MIN_GAS_PRICE_HEX,
  MIN_GAS_TOTAL,
  NEGATIVE_ETH_ERROR,
  REQUIRED_ERROR,
  CONFUSING_ENS_ERROR,
  SIMPLE_GAS_COST,
  TOKEN_TRANSFER_FUNCTION_SIGNATURE,
  BASE_TOKEN_GAS_COST,
  RECIPIENT_ACCOUNT_NOT_ACCEPT_TOKEN_ERROR,
  RECIPIENT_ACCOUNT_NOT_ADD_NFT_GALLERY_ERROR,
};
