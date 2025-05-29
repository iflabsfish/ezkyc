import { ethers } from 'ethers';

/**
 * Validates if a string is a valid EVM address
 * @param address The address to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidEVMAddress(address: string): boolean {
  try {
    // Check if it's a valid address format
    if (!ethers.isAddress(address)) {
      return false;
    }

    // Additional check to ensure it's a checksum address
    const checksumAddress = ethers.getAddress(address);
    return checksumAddress === address;
  } catch (error) {
    return false;
  }
}

// Example usage:
/*
const examples = [
  '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Valid address
  '0x742d35Cc6634C0532925a3b844Bc454e4438f44',  // Invalid length
  '0x742d35cc6634c0532925a3b844bc454e4438f44e', // Invalid checksum
  '0x123',                                       // Invalid format
  'not an address'                               // Invalid format
];

examples.forEach(addr => {
  console.log(`Address ${addr} is ${isValidEVMAddress(addr) ? 'valid' : 'invalid'}`);
});
*/ 

export function isValidIronAddress(address: string): boolean {
  return (
    address.length === 64 &&
    haveAllowedCharacters(address)
  );
}


function haveAllowedCharacters(text: string): boolean {
  const validInputRegex = /^[0-9a-f]+$/
  return validInputRegex.exec(text.toLowerCase()) != null
}