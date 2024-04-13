import { useAddress } from "@thirdweb-dev/react";

export const abbreviateAddress = (address: string | undefined): string => {
  if (address && address.length > 8) {
    return `${address.substring(0, 4)}..${address.substring(address.length - 4)}`;
  }
  return address || '';
};