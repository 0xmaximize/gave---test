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
  CardFooter,
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
import { MdEnergySavingsLeaf  } from "react-icons/md";
import { BsFillInfoCircleFill  } from "react-icons/bs"

const Main: NextPage = () => {
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
      <div className="h-screen flex justify-center overflow-hidden bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className={`lg:px-10 md:px-10`}>
      <div className={` md:mt-10 mx-4 md:px-4`}>
        <div className="grid md:flex md:justify-center lg:justify-around items-center">
                  
        {!address ? (
        <>

       
          <div className="text-start">
            <span className='text-gray-600 md:text-[16px] font-black'>
                YIELD STAKING
            </span>
            <h1 className="font-black text-3xl md:text-5xl mt-2 md:mt-4 md:max-w-[560px]">
              GAVE NFT Staking  
            </h1>
            <p className={`my-4 md:max-w-[560px]`}>
              A mining democratizes access concept & represents a range
            </p>
            
            <div className="my-10">
                <ConnectWallet  
                theme={"dark"}
                btnTitle={"Get Started"}
                modalTitle={"Connect a Wallet"}
                switchToActiveChain={true}
                modalSize={"compact"}
                modalTitleIconUrl={
                "ipfs://QmPmckKH8WHqPNKvSyMMaYe9zHjZRin65tNVanquAJgNsp/GAVE%20-%20LOGO.png"
                }/>
            </div>

          </div>



          <div className="grid items-center">
    
          
                <img src="computer.png" alt='' className="w-[500px] h-[500px]"/>
         
          </div>


          </>
        ) : (
     
   <div className="my-10">
     <h4 className="text-5xl">Stake G-NFT</h4>
 
          <div className="flex justify-center gap-10 items-center mt-20">
           
             <div className="grid md:flex justify-center gap-10 items-start">
            <div>
            <Card className="bg-white/5 md:w-[340px] px-2">
            <CardHeader>
                  <h4 className="text-xl text-white">Account Stats</h4>
                </CardHeader>
                <Divider className="bg-white/20" />

                <CardBody className="p-4 grid gap-4">
                  <div className="flex justify-between items-center gap-4 text-white">
                    <p>GVT Balance : </p>
                    <div className="bg-white/10 p-2 rounded-xl gap-2 justify-center items-center">
                      {(!address || tokenBalance?.displayValue === undefined)
                        ? "0.00000 GVT"
                        : `${(+tokenBalance.displayValue).toFixed(6)} ${tokenBalance.symbol}`}
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-4 text-white">
                    <p>G-NFT Balance : </p>
                    <div className="bg-white/10 p-2 rounded-xl gap-2 justify-center items-center">
                    {ownedBalance}{" "} G-NFT
                    </div>
                    
                  </div>
                  <div className="flex justify-between  items-center gap-4 text-white">
                    <div className="flex gap-2 items-center">
                  <BsFillInfoCircleFill  /> <p className=""> Power : </p>
                  </div>
                    <div className="bg-white/10 p-2 rounded-xl  gap-2 justify-center items-center">
                   {ownedBalance}00{" "} power    
                    </div>
                    
                  </div>
                </CardBody>
              </Card>

                </div>

                <Card className="bg-white/5 md:w-[320px] px-2">
                <CardHeader>
                 <h4 className="text-xl text-white">
                Your Positions </h4>
                </CardHeader>
                <Divider className="bg-white/20" />

                <CardBody className="px-4 py-2">
                    <div className="flex justify-between my-2 items-center text-white">
                    <p>Total Staked :</p>
                    <div className="bg-white/10 flex gap-2 py-2 px-3 rounded-xl justify-center items-center">
                      {totalNFTStaked}{" "} G-NFT
                      <p className="text-xs  hover:text-green-400">view</p>
                    </div>
                    
                    </div>
                    <div className="flex justify-between my-2 items-center text-white">
                    <p>Energy Used :</p>
                    <div className="bg-white/10 flex gap-2 py-2 px-3 rounded-xl justify-center items-center">
                      {totalNFTStaked}00{" "} energy

                    </div>
                    
                    </div>
                </CardBody>
                <Divider className="bg-white/20" />
                <CardFooter className='flex gap-5 my-1 justify-center'>
                <StakeModal />
                <UnstakeModal />
                </CardFooter>
              </Card>

                <div className="grid gap-4">
                <Card className="bg-white/5 w-[360px] px-2">
                <CardHeader>
                  <h4 className="text-xl text-white">Your Rewards</h4>
                </CardHeader>
                <Divider className="bg-white/20 " />
                <CardBody className="px-2">
                  <div className="flex justify-between items-center gap-4 text-white px-1">
                    <div className="bg-white/10 p-3 rounded-xl gap-2 justify-center items-center">
                      {!claimableRewards
                        ? "0.0000000 GVT"
                        : `${(+ethers.utils.formatUnits(claimableRewards, 18)).toFixed(6)} ${tokenBalance?.symbol}`}
                    </div>
                
                      <Web3Button
                        style={{ padding: '1px', borderRadius: '14px' }}
                        action={(contract) => contract.call("claimRewards")}
                        contractAddress={stakingContractAddress}
                      >
                        Withdraw
                      </Web3Button>
                  
                  </div>
                </CardBody>
              </Card>
                
                
             

                </div>
                
               
              
              </div>
            </div>
            </div>
)}
        </div>
      </div>
    </section>
  );
};

export default Main;
