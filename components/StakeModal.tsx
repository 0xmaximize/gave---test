import {
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractRead,
    useOwnedNFTs,
    useTokenBalance,
    Web3Button,
  } from "@thirdweb-dev/react";
import {useState, useEffect} from 'react'
import {
  nftDropContractAddress,
  stakingContractAddress,
} from "../consts/contractAddresses";
import { ModalProps, ScrollShadow, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider} from "@nextui-org/react";
import NFTOwned from "./NFTOwned";

  const StakeModal = () => {
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
      <div className="flex flex-col gap-2">
        <Button size="md" radius="sm" onPress={onOpen}>Stake</Button>
          <Modal backdrop="transparent" scrollBehavior={scrollBehavior} isOpen={isOpen} onClose={onClose}>
            <ModalContent className="bg-gradient-to-tr from-black via-stone-900 to-black backdrop-blur-xl border-1 border-stone-700 rounded-2xl max-h-[600px] md:max-h-[700px]">
              <ModalHeader className="flex justify-start items-center gap-3">    
                <h4 className="text-xl font-bold">STAKE</h4>
              </ModalHeader>
              <ScrollShadow hideScrollBar>
                <ModalBody className="grid justify-center items-center">
                {ownedNfts && ownedNfts.length > 0 ? (
                    <NFTOwned />
                  ) : (
                    <div className="px-4 justify-center items-center mt-10">
                              
                      <h4 className="font-bold text-2xl text-center mb-10 mt-8">GNFT not found</h4>
                    </div>
                  )}
              </ModalBody>
            </ScrollShadow>
            <ModalFooter className="">
              <Button variant='faded' onClick={onClose} size="md" radius='sm'>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  };
  
  export default StakeModal;
  