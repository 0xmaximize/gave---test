'use-client'
import React from "react";
import type { NextPage } from "next";
import { Modal, useDisclosure, Card, CardBody, Button, CardHeader, Divider } from "@nextui-org/react";

const Tutorial: NextPage = () => {


    return(
    <section className={`bg-default-900/50`}>
      <div className="lg:px-20  my-20 mx-20">
        <div className="py-8">
        <h4 className="text-3xl  mt-10 font-bold text-white text-start">Get Started in 3 steps</h4>

      <div className="grid md:flex justify-around items-center my-20">
       
          <div className="flex justify-center gap-2">
            <img src='computer.png' alt="" className="w-[200px] h-[200px]" />
          </div>
          <div>
          <img src='computer.png' alt="" className="w-[200px] h-[200px]" />
          </div>
          <div>
          <img src='computer.png' alt="" className="w-[200px] h-[200px]" />
          </div>
      </div>
      </div>
      </div>
    </section>
    );
}

export default Tutorial;
