import axios from "axios";
import FormData from "form-data"; // Import FormData
import { MESSAGES } from "../constants/messages.js";

const uploadImage = async (imageData, name, description, setStatus) => {
  setStatus({ message: MESSAGES.uploadingImage, isWaiting: true });

  const JWT = process.env.REACT_APP_PINATA_JWT; // Get your JWT from .env

  if (!JWT) {
    setStatus({
      message: "Pinata JWT not found in environment variables.",
      isWaiting: false,
    });
    console.error(
      "Pinata JWT is missing. Please set REACT_APP_PINATA_JWT in your .env file."
    );
    throw new Error("Pinata JWT is missing.");
  }

  try {
    // --- 1. Upload the Image File to Pinata ---
    setStatus({
      message: "Uploading image to IPFS via Pinata...",
      isWaiting: true,
    });

    const imageFormData = new FormData();
    // imageData should be a Blob or Buffer. Assuming it's a Blob from your createImage.js
    imageFormData.append(
      "file",
      new Blob([imageData], { type: "image/jpeg" }),
      "image.jpeg"
    );

    // Optional: Add metadata to the image file itself on Pinata
    const imagePinataMetadata = JSON.stringify({
      name: `${name}-image`,
      keyvalues: {
        description: `Image for NFT: ${name}`,
      },
    });
    imageFormData.append("pinataMetadata", imagePinataMetadata);

    const imageRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      imageFormData,
      {
        maxBodyLength: "Infinity", // This is important for large files
        headers: {
          "Content-Type": `multipart/form-data; boundary=${imageFormData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    const imageCid = imageRes.data.IpfsHash;
    console.log("Image uploaded to Pinata. CID:", imageCid);

    // --- 2. Prepare and Upload the NFT Metadata JSON to Pinata ---
    setStatus({
      message: "Uploading NFT metadata to IPFS via Pinata...",
      isWaiting: true,
    });

    const metadata = {
      name: name,
      description: description,
      image: `ipfs://${imageCid}`, // Link to the image on IPFS using its CID
      // You can add more attributes here for your NFT, e.g.:
      // attributes: [{ trait_type: "Color", value: "Blue" }]
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    const metadataFormData = new FormData();
    metadataFormData.append("file", metadataBlob, "metadata.json");

    // Optional: Add metadata to the metadata JSON file itself on Pinata
    const metadataPinataMetadata = JSON.stringify({
      name: `${name}-metadata`,
      keyvalues: {
        type: "NFT Metadata",
        associatedImageCid: imageCid,
      },
    });
    metadataFormData.append("pinataMetadata", metadataPinataMetadata);

    const metadataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      metadataFormData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${metadataFormData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    const metadataCid = metadataRes.data.IpfsHash;
    console.log("Metadata uploaded to Pinata. CID:", metadataCid);

    // --- 3. Construct the final URL ---
    // This is the URL you will store on the blockchain (e.g., in your ERC721 tokenURI)
    const url = `https://ipfs.io/ipfs/${metadataCid}`; // Pinata's gateway will resolve this

    setStatus({
      message: "Image and metadata successfully uploaded to IPFS via Pinata!",
      isWaiting: false,
    });
    return url;
  } catch (error) {
    console.error(
      "Error uploading to Pinata:",
      error.response ? error.response.data : error.message
    );
    setStatus({
      message: `Error uploading to IPFS: ${
        error.response ? error.response.data.error : error.message
      }`,
      isWaiting: false,
    });
    throw error; // Re-throw to be handled by calling component
  }
};

export default uploadImage;
