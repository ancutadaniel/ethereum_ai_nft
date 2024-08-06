import { MESSAGES } from "../constants/messages.js";

const uploadImage = async (imageData, name, description, setStatus) => {
  setStatus({ message: MESSAGES.uploadingImage, isWaiting: true });

  const JWT = process.env.REACT_APP_PINATA_API_KEY;

  if (!JWT) {
    throw new Error("Pinata API key is missing");
  }

  const data = new FormData();
  data.append("file", new File([imageData], "image.jpeg", { type: "image/jpeg" }));

  try {
    const request = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: data,
    });
    
    const response = await request.json();

    const metadata = {
      name,
      description,
      image: `ipfs://${response.IpfsHash}`
    };

    const metadataRequest = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metadata)
    });

    const metadataResponse = await metadataRequest.json();
    const url = `https://gateway.pinata.cloud/ipfs/${metadataResponse.IpfsHash}`;

    return url;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    setStatus({ message: MESSAGES.errorOccurred, isWaiting: false });
    throw error;
  }
};

export default uploadImage;
