import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import {useState, useEffect} from 'react'

import type { FC } from "react";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";

import {CardFooter, Card, CardHeader, Button, ModalProps,  useDisclosure, Divider} from "@nextui-org/react";



const NFTOwned = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState<ModalProps["scrollBehavior"]>("inside");
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );

  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);


  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("stake", [[id]]);
  }

  return (

    <>
     
        <div className="py-2 px-2">
        {ownedNfts?.map((nft) => (
          <Card 
          key={nft.metadata.id.toString()}
          isFooterBlurred
          className="before:bg-white/10 border-stone-700 border-2 rounded-2xl my-6"
          >
            <img src="miner.jpg" className="object-cover" alt=""/>
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-2 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-sm text-white/80">{nft.metadata.name}</p>
            <Web3Button
                contractAddress={stakingContractAddress}
                action={() => stakeNft(nft.metadata.id)}
              >
                Stake
              </Web3Button>
          </CardFooter>
        </Card>
            ))}
        </div>
    </>
     
  );
};
export default NFTOwned;
