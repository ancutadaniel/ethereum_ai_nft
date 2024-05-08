import { ethers } from "ethers";
import { MESSAGES } from "../constants/messages.js"; 


const mintImage = async (tokenURI, provider, nft, setStatus) => {
  setStatus({ message: MESSAGES.waitingForMint, isWaiting: true });

  const signer = await provider.getSigner();
  const transaction = await nft.connect(signer).mint(tokenURI, {
    value: ethers.utils.parseUnits("0.0001", "ether"),
    gasLimit: 1000000,
  });

  await transaction.wait();
  setStatus({ message: MESSAGES.mintComplete, isWaiting: false });
};

export default mintImage;
