import {
  ThirdwebNftMedia,
  useContract,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import type { FC } from "react";
import {
  nftDropContractAddress,
  stakingContractAddress,
} from "../consts/contractAddresses";
import {Card, CardFooter, Image, Button} from "@nextui-org/react";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
  const { contract } = useContract(nftDropContractAddress, "nft-drop");
  const { data: nft } = useNFT(contract, tokenId);

  return (
    <>
      {nft && (
        <div className="py-2 px-2">
          <Card
          isFooterBlurred
          className="before:bg-white/10 border-white/20 rounded-2xl"
          >
            <img src="miner.jpg" className="object-cover" alt=""/>
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-sm text-white/80">{nft.metadata.name}</p>
              <Web3Button
              action={(contract) => contract?.call("withdraw", [[nft.metadata.id]])}
              contractAddress={stakingContractAddress}
              style={{maxWidth:'10px', maxHeight:'10px'}}
              >
              Unstake
              </Web3Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};
export default NFTCard;
