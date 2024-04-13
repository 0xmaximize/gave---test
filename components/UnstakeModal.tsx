import {
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import {ScrollShadow, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, ModalProps,  useDisclosure, Divider} from "@nextui-org/react";

const UnstakeModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();
  const { contract } = useContract(stakingContractAddress);
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
    address,
  ]);
  const [scrollBehavior, setScrollBehavior] = useState<ModalProps["scrollBehavior"]>("inside");
  
  return (
    <div className="flex flex-col gap-2">
        <Button size="md" radius="sm" onPress={onOpen}>Unstake</Button>
        <Modal backdrop="transparent" scrollBehavior={scrollBehavior} isOpen={isOpen} onClose={onClose}>
          <ScrollShadow>
            <ModalContent className="bg-gradient-to-tr from-black via-stone-900 to-black backdrop-blur-xl border-1 border-stone-700 rounded-2xl max-h-[600px] md:max-h-[700px]">
              <ModalHeader className="flex justify-start items-center gap-3">    
                <h4 className="text-xl font-bold">UNSTAKE</h4>
              </ModalHeader>
              <ScrollShadow hideScrollBar>
              <ModalBody>
              {stakedTokens &&
                stakedTokens[0]?.map((stakedToken: BigNumber) => (
                <NFTCard
                  tokenId={stakedToken.toNumber()}
                  key={stakedToken.toString()}
                />
              ))}
              </ModalBody>
              </ScrollShadow>
              <ModalFooter className="">
                <Button onPress={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </ScrollShadow>
        </Modal>

    </div>
  );
};

export default UnstakeModal;
