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
import UnstakeModal from "../components/UnstakeModal";
import StakeModal from "../components/StakeModal";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import { BsCheckAll } from "react-icons/bs";
import { BsFillInfoCircleFill, BsImage,    } from "react-icons/bs"


const Test: NextPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
  const { contract: tokenContract } = useContract(tokenContractAddress, "token");
  const { contract, isLoading } = useContract(stakingContractAddress);
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

  if (isLoading) {
    return (
      <div className="flex justify-center overflow-hidden bg-black">
        <p>Loading...</p>
      </div>
    );
  }


  const total = totalNFTStaked + ownedBalance;
  const progressValue = (totalNFTStaked / total) * 100;


  return (
    <section className={` lg:px-10 md:px-20 md:mx-20 my-20`}>
      <div className={`md:flex justify-between items-center px-10 `}>
        <div className="grid justify-start max-w-[500px] mx-10 ">
          <div className="flex gap-2 items-center">
            <h4 className="text-stone-500 text-xl items-center flex">NFT Staking </h4>
            <span className="text-[10px] bg-red-600 px-1  rounded-md text-white">BETA</span>
          </div>
          <div>
            <h4 className="text-5xl my-4">Start NFT Staking - earn daily rewards.</h4>
            <p className="my-2 text-stone-500">
              GAVE Network provides NFT Staking program. Users can earn daily rewards using proof-of-stake (PoS) mechanism.
            </p>
          </div>
          <div className='flex justify-start gap-10 my-8  items-start'>
              <div className='flex gap-2 items-center'> <BsCheckAll  className="text-3xl"/>Proof-of-Stake</div>
              <div className='flex gap-2 items-center'> <BsCheckAll  className="text-3xl"/>Easy to use</div>
          </div>
          <div className="flex gap-4">
            <Button size="lg" color="success" variant="flat"> Stake now</Button> 
            <Button  size="lg" color="warning" variant="light">
              Free NFT
            </Button>              
          </div>
        </div>
        
        <div className="justify-start grid items-center">
          <Tabs variant='underlined' aria-label="Tabs variants" color="primary">
          <Tab key="STAKE" title="STAKE NFT">
          <div className="grid gap-4 my-10 md:flex md:gap-2 px-4">
          <Card className="bg-[#0a0a0a] text-white px-4 py-2 rounded-3xl ">
                <CardHeader className="py-2 mt-1 px-4">
                    <h4 className="text-xl">Staking Pools</h4>
                </CardHeader>
                <CardBody>
                <div className="bg-gradient-to-tr from-blue-600 via-sky-400 to-green-500  items-center flex justify-start gap-2 py-4 w-full md:w-[280px] px-4 rounded-2xl">
                  <img src='logo.png' className="w-[60px] h-[60px]" alt=""/>
                  <div className="">
                      <h4 className="text-xs  text-black/50">MY BALANCE</h4>
                      <h4 className="text-3xl  text-stone-900">
                      <span className="">  {(!address || tokenBalance?.displayValue === undefined)
                        ? "0.00 GVT"
                        : `${(+tokenBalance.displayValue).toFixed(2)} GVT` 
                        }</span>  
                      </h4>
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
                    <Progress size="sm" aria-label="Loading..." value={progressValue} />                            
                  </div>
                </div>   
              </div>

         
              {!address ? (
              <div className="flex gap-2 items-center">
                <Button className="w-full">
                  STAKE
                </Button>
                <Button className="w-full">
                  UNSTAKE
                </Button>
              </div>
                 ):(
                  <div className="flex gap-2 items-center mt-4">
                    <div className="w-full"> 
                  <StakeModal />
                  </div>
                  <div className="w-full"> 
                  <UnstakeModal />
                  </div>
                </div>
                  )}
            </CardBody>
          </Card>
        
                  
      
          </div>
            </Tab>
          <Tab key="UNSTAKE" title="UNSTAKE NFT">
            <div className="grid gap-4 my-10 md:flex md:gap-2 px-4">
          <Card className="bg-[#0a0a0a] text-white px-4 py-2 rounded-3xl ">
                <CardHeader className="py-2 mt-1 px-4">
                    <h4 className="text-xl">STAKING POOLS</h4>
                </CardHeader>
                <CardBody>
                <div className="bg-gradient-to-tr from-blue-600 via-sky-400 to-green-500  items-center flex justify-start gap-2 py-4 w-full md:w-[280px] px-4 rounded-2xl">
                  <img src='logo.png' className="w-[60px] h-[60px]" alt=""/>
                  <div className="">
                      <h4 className="text-xs  text-black/50">MY BALANCE</h4>
                      <h4 className="text-3xl  text-stone-900">
                      <span className="">  {(!address || tokenBalance?.displayValue === undefined)
                        ? "0.00 GVT"
                        : `${(+tokenBalance.displayValue).toFixed(2)} GVT` 
                        }</span>  
                      </h4>
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
                    <Progress size="sm" aria-label="Loading..." value={progressValue} />                            
                  </div>
                </div>   
              </div>

         
              {!address ? (
              <div className="flex gap-2 items-center">
                <Button className="w-full">
                  STAKE
                </Button>
                <Button className="w-full">
                  UNSTAKE
                </Button>
              </div>
                 ):(
                  <div className="flex gap-2 items-center mt-4">
                    <div className="w-full"> 
                  <StakeModal />
                  </div>
                  <div className="w-full"> 
                  <UnstakeModal />
                  </div>
                </div>
                  )}
       
            </CardBody>
          </Card>
        
                  
      
          </div>
          </Tab>
          <Tab key="CLAIM" title="CLAIM REWARD">
          <div className="grid gap-2">
        <Card className="bg-[#0a0a0a] text-white px-4 py-2 rounded-3xl md:w-[320px]">
        <CardHeader className="py-2 mt-1 px-4">
                    <h4 className="text-xl">REWARDS</h4>
                </CardHeader>
                <CardBody>
                  <div className="bg-gradient-to-tr from-blue-600 via-sky-400 to-green-500  items-center justify-center gap-4 py-4 px-4 rounded-2xl">
                    <div className="flex justify-center ">
                    <h4 className="text-xs text-black/50">UNCLAIMED</h4>
                    </div>

                      <div className="grid justify-center mt-1 items-center">
                        <h4 className="text-2xl text-stone-900">
                        {!claimableRewards
                        ? "0.00 GVT"
                        : `${(+ethers.utils.formatUnits(claimableRewards, 18)).toFixed(6)} ${tokenBalance?.symbol}`}
                        </h4>
                      </div>
                  </div>
                  <div className="border border-white/5 bg-white/5 rounded-2xl mt-4">
                <div className="grid gap-4 py-4 px-4">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-white/50">On Stake</h4>
                    <h4 className="text-white font-bold">{totalNFTStaked} G-NFT </h4>
                  </div>

               
                </div>   
              </div>

         
       
              <div className="flex items-center mt-4">
                <Web3Button
                        style={{ width:'100%' ,padding: '1px', borderRadius: '12px', fontSize:'15px' }}
                        action={(contract) => contract.call("claimRewards")}
                        contractAddress={stakingContractAddress}
                      >
                        Claim Reward
                      </Web3Button>
              </div>
              <h4 className="text-xs flex gap-2 items-center my-2 mt-4"> <BsFillInfoCircleFill /> You can stake up to 10+ NFTs / GNFT </h4>
              <h4 className="text-xs flex gap-2 items-center"> <BsFillInfoCircleFill /> Only G-NFT are accepted on this pool</h4>

            </CardBody>
          </Card>
         
          </div>
          </Tab>

        </Tabs> 
       
        
          </div>
      </div>
    </section>
  );
};

export default Test;
