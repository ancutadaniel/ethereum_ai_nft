import { NFTStorage, File } from 'nft.storage';

import { MESSAGES } from "../constants/messages.js";

const uploadImage = async (imageData, name, description, setStatus) => {
  setStatus({ message: MESSAGES.uploadingImage, isWaiting: true });

  const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY });
  const { ipnft } = await nftstorage.store({
    image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
    name,
    description,
  });

  const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
  return url;
};

export default uploadImage;
