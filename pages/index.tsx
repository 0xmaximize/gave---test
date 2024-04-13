import React from "react";
import { NextPage } from "next";
import StakingNFT from "../components/StakingNFT";
import Footer from "../components/Footer";
import Tutorial from "../components/Tutorial";

const Home: NextPage = () => {
  return (
    <div className="overflow-hidden bg-black">
        <div className="relative ">
        <StakingNFT />
      </div>
        <Tutorial />
        <Footer />
    </div>
  );
};

export default Home;
