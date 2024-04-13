import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

import NFTCard from "../components/NFTCard";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import {ScrollShadow, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider} from "@nextui-org/react";

const UnstakeMini = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
    address,
  ]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
    const intervalId = setInterval(() => {
      loadClaimableRewards();
    }, 1000); // Update every 60 seconds (1 minute)

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [address, contract]);


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

  if (isLoading) {
    return  <div className='h-screen flex justify-center overflow-hidden bg-black'>
    <p>
      Loading...
    </p>
  </div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" radius="sm" onPress={onOpen}>Unstake</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent className="backdrop-blur-md rounded-2xl bg-gray-500 max-h-[500px]">
            <ScrollShadow>
            <ModalHeader>
              <span className="text-2xl text-black">Unstake SNFT</span>
            </ModalHeader>
            <Divider className="my-1 bg-white/10"/>
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
          </ModalContent>
        </Modal>

    </div>
  );
};

export default UnstakeMini;
