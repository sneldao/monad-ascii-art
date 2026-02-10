import hre from "hardhat";

async function main() {
  console.log("Deploying ASCIIArt contract to Monad Testnet...");
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "MON");
  
  // Deploy ASCIIArt contract
  const ASCIIArt = await hre.ethers.getContractFactory("ASCIIArt");
  const asciiArt = await ASCIIArt.deploy();
  
  await asciiArt.waitForDeployment();
  
  const address = await asciiArt.getAddress();
  console.log("\n✅ ASCIIArt deployed to:", address);
  console.log("Explorer:", `https://testnet.monadexplorer.com/address/${address}`);
  
  // Create a test artwork
  console.log("\nCreating test artwork...");
  const art = `╔══════════════════════════════════════════╗
║ MONAD                                    ║
╟──────────────────────────────────────────╢
║            .....ooooooooo.....           ║
║           ....ooooooooooooo....          ║
║           ...oooooOOOOOooooo...          ║
║          ....ooooOOOOOOOoooo....         ║
║          ...ooooOOOOOOOOOoooo...         ║
║          ...oooOOOO@@@OOOOooo...         ║
╚══════════════════════════════════════════╝`;

  const tx = await asciiArt.createArtwork(
    art,
    "Monad ASCII - Agentic Commerce",
    "circles pattern, monad theme"
  );
  
  await tx.wait();
  console.log("✅ Test artwork created!");
  
  console.log("\n📊 Contract Summary:");
  console.log("- Address:", address);
  console.log("- Network: Monad Testnet");
  console.log("- Chain ID: 10143");
  console.log("- Deployer:", deployer.address);
  console.log("- Initial artwork: Created");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
