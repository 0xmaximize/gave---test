'use client'
import React from "react";
import { FaDiscord, FaTwitter, FaGithub } from "react-icons/fa";
import { SiGitbook } from 'react-icons/si';
import { Divider } from "@nextui-org/react";
import { exploreLinks, usageLinks, learnLinks } from "../consts/index";

function Footer() {
	return (
	<>
	<footer className={`md:mx-20`}>
		<Divider className="my-10 bg-white/5" />
		<div className="grid grid-cols-2 md:flex justify-around items-start px-4 gap-10 md:px-10">
			<ul>
				<span aria-label="Trade" className='font-bold mb-2'>Learn</span>
				{learnLinks.map((data) => (
					<li key='Trade' className='my-2 text-gray-500 hover:text-white'>{data.title}</li>
				))}
			</ul>
			<ul>
				<span aria-label="Trade" className='font-bold mb-2'>Explore</span>
				{exploreLinks.map((data) => (
					<li  key='Trade' className='my-2 text-gray-500 hover:text-white'>{data.title}</li>
				))}
			</ul>
			<ul>
				<span aria-label="Trade" className='font-bold mb-2'>Build</span>
				{usageLinks.map((data) => (
					<li key='Trade' className='my-2 text-gray-500 hover:text-white'>{data.title}</li>
				))}   
			</ul>
			<ul>
				<span aria-label="Trade" className='font-bold mb-2'>Usage</span>
				{usageLinks.map((data) => (
					<li key='Trade' className='my-2 text-gray-500 hover:text-white'>{data.title}</li>
				))}
			</ul>
					
			<ul aria-label='resources' className='grid gap-2'>
				<span aria-label="Trade" className='font-bold mb-2'>Resources</span>
				{exploreLinks.map((data) => (
					<li key='Trade' className='my-2 text-gray-500 hover:text-white'>{data.title}</li>
				))}
			</ul>
		</div>
		<div className='flex'>
		<Divider className="mt-10 bg-stone-700/20" />
		</div>
		<div className='px-2'>
			<div className="md:flex justify-between items-center">
				<div className='flex my-4'>
					<p className='font-bold text-[20px]'>
						GAVE - Autonomy Rewards 
					</p>
				</div>
			<div className='flex  items-end gap-4 my-4 md:my-0'>
				<FaDiscord />
				<Divider className='h-4 bg-stone-700' orientation="vertical" />
				<FaTwitter />
				<Divider className='h-4 bg-stone-700' orientation="vertical" />
				<FaGithub />
				<Divider className='h-4 bg-stone-700' orientation="vertical" />
				<SiGitbook />
			</div>
			</div>
				<p className='hidden md:block text-[12px] text-gray-500 '>
				This website is maintained by the Galaxius Foundation on behalf of the decentralized community. The contents and opinions of this website do not necessarily reflect those of the galaxius foundation. This website links to projects, dApps and cryptocurrency exchanges as a service to the public. The Galaxius does not warrant that the information provided by these websites is correct, complete, and up-to-date. The Galaxius Foundation is not responsible for the content of those websites and expressly rejects any liability for damages of any kind resulting from the use, reference to, or reliance on any information contained within these websites. If you spot an error or issue on this website, please email marketing@galaxius.xyz
				</p>
			<div className="flex justify-start gap-2 items-center">
				<p className=' my-4 text-gray-400 text-[10px]'> ©2024 GAVE Network </p>
				<Divider className='h-4 bg-stone-700' orientation="vertical" />
				<p className='my-4 text-gray-400 hover:text-white text-[10px]'>
					Privacy 	
				</p>
				<Divider className='h-4 bg-stone-700' orientation="vertical" />
				<p className='px-2 my-4 text-gray-400 hover:text-white text-[10px]'>
				Terms 	
				</p>
			</div>
		</div>
	</footer>
	
		</>
	);
}

export default Footer;