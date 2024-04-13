'use client';
import React, { useEffect, useState } from "react";
import {
    ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import {
  Modal,
  useDisclosure,
  Card,
  CardBody,
  Tooltip,
  CardFooter,
  Tabs,
  Tab,
  Progress,
  Button,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import UnstakeModal from "./UnstakeModal";
import StakeModal from "./StakeModal";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import { BsCheckAll } from "react-icons/bs";
import { BsFillInfoCircleFill, BsImage,    } from "react-icons/bs"


const Unstaked: NextPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
  const { contract: tokenContract } = useContract(tokenContractAddress, "token");
  const { contract } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);
  const ownedBalance = ownedNfts ? ownedNfts.length : 0;
  const [valuation, setValuation] = useState<number>(0);
  const [selected, setSelected] = useState("login");

  useEffect(() => {
    if (tokenBalance?.displayValue !== undefined) {

      const conversionFactor = 0.2;
      const calculatedValuation = +tokenBalance.displayValue * conversionFactor;
      setValuation(calculatedValuation);
    }
  }, [tokenBalance]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
    const intervalId = setInterval(() => {
      loadClaimableRewards();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [address, contract]);

  const totalNFTStaked = stakedTokens ? stakedTokens[0]?.length || 0 : 0;

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


  const total = totalNFTStaked + ownedBalance;
  const progressValue = (totalNFTStaked / total) * 100;
  

  return (
  <>
  <div className="border border-white/5  rounded-xl mt-4">
    <div className="grid gap-4 py-4 px-4">
      <div className="flex justify-between">
        <h4 className="font-semibold text-white/50">On Stake</h4>
        <h4 className="text-white font-bold">{totalNFTStaked} NFT </h4>
      </div>
      <div className="flex justify-between">
        <h4 className="font-semibold text-white/50">RPM/APM</h4>
        <h4 className="text-white font-bold">0.01+ </h4>
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between">
          <h4 className="text-white/50">NFT Power</h4>
          <h4 className=""> {totalNFTStaked * 100} <span className="text-[12px] text-white/50"> {""}/{(ownedBalance + totalNFTStaked) * 100} </span> </h4>
        </div>
        <Progress size="sm" color="success" aria-label="Loading..." value={progressValue} />                            
      </div>
    </div>   
  </div>
  <div className="border border-white/5 bg-white/5 rounded-2xl mt-4">
    <div className="grid gap-4 py-4 px-4">
      <div className="flex justify-between">
        <h4 className="font-semibold text-white/50">On Stake</h4>
        <h4 className="text-white font-bold">{totalNFTStaked} G-NFT </h4>
      </div>
      <div className="grid gap-2">
        <div className="flex justify-between">
          <h4 className="text-white/50">Power</h4>
          <h4 className=""> {totalNFTStaked * 100} <span className="text-[12px] text-white/50"> {""}/{(ownedBalance + totalNFTStaked) * 100} </span> </h4>
        </div>
        <Progress size="sm" color="success" aria-label="Loading..." value={progressValue} />                            
      </div>
    </div>   
  </div>
  </>
  )
};

export default Unstaked;
