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
import { FaEye  } from "react-icons/fa";
import { BsEyeSlash } from "react-icons/bs";
import UnstakeModal from "./UnstakeModal";
import StakeModal from "./StakeModal";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import { PiWalletFill  } from "react-icons/pi";

const Staked: NextPage = () => {
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
      <div className="border border-gray-900  bg-gradient-to-tr from-slate-900 via-blue-900 to-sky-900 rounded-2xl mt-4">
        <div className="flex justify-between py-2 items-start p-2 m-2">
          <div className="grid justify-end">
            <h4 className="text-xs text-stone-400">Account Balance</h4> 
            <h4 className="text-3xl font-bold mt-2 md:text-4xl">
              {(!address || totalNFTStaked === undefined)
                ? "***"
                : `${totalNFTStaked} GNFT` 
              } 
            </h4>
          </div>
          <div className="grid justify-end items-start text-end ">
            <Button size="sm" startContent={<PiWalletFill />} variant="flat" className="flex justify-center items-center text-white bg-white/10"> 
              {(!address || tokenBalance?.displayValue === undefined)
                ? "0.00000 GVT"
                : `${(+tokenBalance.displayValue).toFixed(6)} ${tokenBalance.symbol}`
              }
            </Button>
          </div>
        </div> 

        <div className="flex justify-between items-start px-4 mb-4">
          <div className="">
            <div className="flex mb-1 text-xs gap-10 md:gap-16 text-start">
              <span>
               GNFT used
              </span>
              <h4 className="text-normal">{totalNFTStaked}
                <span className="text-[9px] text-stone-500">
                  {" "} /{(ownedBalance + totalNFTStaked)}
                </span> 
              </h4>
            </div>
            <Progress size="sm" color="success" aria-label="Loading..." value={progressValue} />                            
          </div>  
          <div className="">
            <div className="flex mb-1 text-xs gap-10 md:gap-16 text-start">
              <span>Power</span>
              <h4 className="text-normal">{totalNFTStaked * 100}<span className="text-[9px] text-stone-500">{" "}/{(ownedBalance + totalNFTStaked) * 100}</span></h4>
            </div>
            <Progress size="sm" color="success" aria-label="Loading..." value={progressValue} />                            
          </div>  
        </div>
      </div>

      <div className="border-1 border-white/10  rounded-xl mt-4">
        <div className="grid gap-4 py-4 px-4">
          <div className="flex justify-between items-center gap-4">
            <h4 className="text-white/50">Available</h4>
            <div className="w-full flex-1 border-t-2 mt-2 border-dotted border-white/5"/>
            <h4 className="font-bold">
              {(!address || ownedBalance === undefined)
                ? "0 GNFT"
                : `${ownedBalance} GNFT` 
              } 
            </h4>
          </div>

          <div className="flex justify-between items-center gap-4">
            <h4 className="text-white/50">NFT Staked</h4>
            <div className="w-full flex-1 border-t-2 mt-2 border-dotted border-white/5"/>
            <div className="flex items-center gap-2">
       
              <h4 className="text-white font-bold"> 
                {(!address || totalNFTStaked === undefined)
                  ? "0 GNFT"
                  : `${totalNFTStaked} GNFT` 
                } 
              </h4>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center gap-4">
              <h4 className="text-white/50">Rewards</h4>
              <div className="w-full flex-1 border-t-2 mt-2 border-dotted border-white/5"/>

              <h4 className="text-green-500 font-bold">    
                {!claimableRewards
                  ? "0.00 GVT"
                  : `${(+ethers.utils.formatUnits(claimableRewards, 18)).toFixed(6)} ${tokenBalance?.symbol}`
                }          
              </h4>
            </div>
          </div>
      
          <div className="flex justify-between items-center gap-4">
            <h4 className="text-white/50">Current APY</h4>
            <div className="w-full flex-1 border-t-2 mt-2 border-dotted border-white/5"/>
            <h4 className="font-bold">
              200%
            </h4>
          </div>

          <div className="flex justify-between items-center gap-4">
            <h4 className="text-white/50">Power Used </h4>
            <div className="w-full flex-1 border-t-2 mt-2 border-dotted border-white/5"/>
            <h4 className="font-bold">
              400/500
            </h4>
          </div>
        </div>   
      </div>
    </>
  )
};

export default Staked;
