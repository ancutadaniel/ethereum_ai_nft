/* eslint-disable no-undef */
// Required libraries
const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

// Convert numeric values to their ether equivalents
const toEther = (amount) => ethers.utils.parseUnits(amount.toString(), "ether");

// Main deployment function
const deployNFT = async () => {
  const [deployer] = await ethers.getSigners();

  // Contract parameters
  const CONTRACT_NAME = "AI Generated NFT";
  const SYMBOL = "AINFT";
  const PRICE = toEther(0.0001); // 0.0001 ETH

  // Deploy the NFT contract
  const NFTFactory = await hre.ethers.getContractFactory("NFT");
  const nftContract = await NFTFactory.deploy(CONTRACT_NAME, SYMBOL, PRICE);
  await nftContract.deployed();

  // Log deployment details
  console.log({
    "Chain ID": (await ethers.provider.getNetwork()).chainId,
    "Deploying Account": await deployer.getAddress(),
    "Account Balance": (await deployer.getBalance()).toString(),
    "Deployed Contract Address": nftContract.address,
  });

  // Save configuration and contract ABI
  updateFrontendConfiguration(
    (await ethers.provider.getNetwork()).chainId,
    nftContract.address
  );
};

// Update frontend configuration and save contract ABI
const updateFrontendConfiguration = (chainId, contractAddress) => {
  const configDirectory = path.resolve(__dirname, "../src/contracts");
  const configFilePath = path.join(configDirectory, "config.json");

  // Ensure contracts directory exists
  if (!fs.existsSync(configDirectory)) {
    fs.mkdirSync(configDirectory);
  }

  // Update or initialize configuration
  let config = {};
  if (fs.existsSync(configFilePath)) {
    config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
  }

  // Set or update the NFT address
  config[chainId] = { nft: { address: contractAddress } };
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

  // Save contract ABI
  const contractABI = artifacts.readArtifactSync("NFT");
  fs.writeFileSync(
    path.join(configDirectory, "NFT.json"),
    JSON.stringify(contractABI, null, 2)
  );
};

// Run the deployment and handle errors
deployNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
