'use-client'
import { useEffect, useState } from 'react'
import { ConnectWallet, useAddress, useDisconnect } from '@thirdweb-dev/react'
import { BsSearch } from 'react-icons/bs'
import { Button, Input, Divider, Avatar} from '@nextui-org/react'
import { BiSolidGridAlt    } from 'react-icons/bi'
import Link from 'next/link'
import { abbreviateAddress } from './abbreviateAddress'

const Navbar = () => {
    const address = useAddress();
    const abbritave = abbreviateAddress(address);
    const disconnect = useDisconnect();
  return (
    <div className="w-full bg-none backdrop-blur-xl md:px-20">
        <div className="flex flex-cols-3 h-16 justify-between pt-4 px-2 md:px-10 gap-10">
            <div className='flex justify-center items-center gap-20'>
              <Link href='/'>
                <img src='gave-logo.svg' className=' w-[100px] h-[100px]' alt=''/>
              </Link>
              <ul  className='hidden md:flex gap-2 justify-center items-center my-2 '>
              <Button variant='light' color='default' size='md' className=' text-white text-md'>Stake GNFT</Button>
              <Divider orientation='vertical' className=' h-6 bg-white/5' />
              <Button variant='light' color='default' size='md' className=' text-white text-md'>G-Launchpad</Button>
              <Divider orientation='vertical' className=' h-6 bg-white/5' />
              <Button variant='light' color='default' size='md' className=' text-white text-md'>Airdrop</Button>
              <Divider orientation='vertical' className=' h-6 bg-white/5' />
              <Button variant='light' color='default' size='md' className=' text-white text-md'>Docs</Button>
              <Divider orientation='vertical' className=' h-6 bg-white/5' />
            </ul>
            </div>
          
          <div className='flex gap-10'>
            {!address ? (
                 <ConnectWallet  theme={"dark"}
                 btnTitle={"Connect Wallet"}
                 modalTitle={"Connect a Wallet"}
                 switchToActiveChain={true}
                 modalSize={"compact"}
                 modalTitleIconUrl={
                   "ipfs://QmPmckKH8WHqPNKvSyMMaYe9zHjZRin65tNVanquAJgNsp/GAVE%20-%20LOGO.png"
                 }/>
            ) : (
                
                <div className='flex items-center  gap-4 my-1 '>              
                  <Button startContent={<Avatar size='sm' src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />}  variant='flat' size='md' radius='sm' className='text-white bg-white/10'>
                  400
                </Button>
                <Button startContent={<BsSearch />} variant='flat' size='md' radius='sm' className='text-white bg-white/10'  onClick={disconnect}>
                {abbritave}
                </Button>
                <Button radius='sm' onClick={disconnect} className='hidden md:flex'>
                  Disconnect
                </Button>
                <div className='flex md:hidden'>
                <BiSolidGridAlt    className='text-3xl'/>
              </div>  
                </div>
            )}
            </div>
        </div>
        <Divider className='my-4 bg-white/5' />

    </div>
  )
}

export default Navbar