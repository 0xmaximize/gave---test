import React from "react";
import { NextPage } from "next";
import Footer from "../components/Footer";
import Test from "../components/Test";
import StakingNFT from "../components/StakingNFT";
import Main from "../components/Main";
import Tutorial from "../components/Tutorial";

const Stake: NextPage = () => {
  return (
    <div className="overflow-hidden">
        <div className="relative">
       <Main />
      </div>
      <div>
        <Tutorial />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Stake;
