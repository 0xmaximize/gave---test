'use client';
import React, { useEffect, useState } from "react";
import {
  ConnectWallet,
  useAddress,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Tabs,
  Tab,
  Button,
} from "@nextui-org/react";
import UnstakeModal from "./UnstakeModal";
import StakeModal from "./StakeModal";
import Staked from "./Staked";
import Unstaked from "./Unstaked";

const StakingNFT: NextPage = () => {
  const address = useAddress();

  return (
    <section className="lg:px-20 lg:mx-20 my-20 md:mx-4 md:py-10">
      <Divider className="bg-white/5 h-[460px] absolute hidden lg:flex" orientation="vertical" />
        <div className="grid md:flex justify-center md:justify-between px-4 lg:px-20">
          <div className="md:max-w-[320px] lg:max-w-[500px]">
            <div className="flex gap-2 items-center">
              <h4 className="text-stone-500 text-xl items-center flex">NFT Staking</h4>
              <span className="text-[10px] bg-red-600 px-1  rounded-md text-white">Beta</span>
            </div>
            <div>
              
              <h4 className="text-3xl lg:text-5xl font-extrabold my-4">Start NFT Staking- earn GVT rewards.</h4>
              <p className="my-2 text-stone-500">
                GAVE Network provides NFT Staking program. Users can earn daily rewards using proof-of-stake (PoS) mechanism.
              </p>
            </div>
            
            <div className="grid md:flex gap-4 my-10">
              <Button size="md" radius="sm" color="success">GAVE Token</Button> 
              <Button size="md" radius="sm" variant="ghost" color="success">GAVE NFTs</Button> 
            </div>

            <div className="mt-16 flex-cols-3 lg:gap-20 hidden lg:flex">
              <div className="text-center">
              <h4 className="text-5xl  my-2 font-bold">
                572+ 
              </h4>
              <h4 className="text-stone-400/50 text-start">Staking Users</h4>
              </div>

              <div className="grid text-center items-center">
              <h4 className="text-5xl font-bold my-2 ">
               341+
              </h4>
              <h4 className="text-stone-400/50">GNFT Staked</h4>
              </div>
              <div className="grid text-center items-center">

              <h4 className="text-5xl font-bold my-2">
                51K+
              </h4>
              <h4 className="text-stone-400/50">GVT Rewards</h4>
              </div>
            </div>
          </div>

          <div className="my-20 md:my-0">
            <Card className="bg-default-900/70 text-white px-4 py-4 rounded-2xl lg:w-[460px]">
              <Tabs fullWidth size="lg" radius="sm" aria-label="Tabs variants"
              classNames={{
                tabList: "bg-white/5 relative rounded-lg",
              }}>
                <Tab key="light" title="Stake">
                <Staked />
                <div className="mt-6">
                {!address ? ( 
                  <ConnectWallet  
                    theme={"dark"}
                    style={{width:'100%'}}
                    btnTitle={"Connect Wallet"}
                    modalTitle={"Connect a Wallet"}
                    switchToActiveChain={true}
                    modalSize={"compact"}
                    modalTitleIconUrl={
                      "ipfs://QmPmckKH8WHqPNKvSyMMaYe9zHjZRin65tNVanquAJgNsp/GAVE%20-%20LOGO.png"
                    }
                  />     
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                  <StakeModal />
                  <UnstakeModal />
                  </div>
                )}                
                </div>

                </Tab>
                  <Tab key="UNSTAKE" title="Claim">
                  <Unstaked />
                  <div className="my-2 px-1">
                    <span className=" text-stone-400">
                      Your Balance : {" "}
                    </span>
                    <span className="font-bold text-white">
                   
                    </span>
                  </div>
                  <UnstakeModal />
                </Tab>
              </Tabs>
            </Card>
          </div>
        </div>
    </section>
  )
};

  export default StakingNFT;
