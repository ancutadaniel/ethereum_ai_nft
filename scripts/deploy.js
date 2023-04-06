const hre = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

async function main() {
  const NAME = 'AI Generated NFT';
  const SYMBOL = 'AINFT';
  const COST = tokens(0.01); // 0.01 ETH

  const NFT = await hre.ethers.getContractFactory('NFT');
  const nft = await NFT.deploy(NAME, SYMBOL, COST);
  await nft.deployed();

  console.log(`Deployed NFT Contract at: ${nft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
