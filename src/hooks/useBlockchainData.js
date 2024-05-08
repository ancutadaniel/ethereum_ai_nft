import { useEffect, useState } from "react";
import { ethers } from "ethers";

import NFT from "../contracts/NFT.json";
import config from "../contracts/config";

import { MESSAGES } from "../constants/messages";

const useBlockchainData = () => {
  const [provider, setProvider] = useState(null);
  const [nft, setNFT] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (!(network.chainId in config)) {
        alert(MESSAGES.networkNotSupported);
        return;
      }

      const nft = new ethers.Contract(
        config[network.chainId].nft.address,
        NFT.abi,
        provider
      );
      setProvider(provider);
      setNFT(nft);
    };

    loadBlockchainData();
  }, []);

  return { provider, nft };
};

export default useBlockchainData;
