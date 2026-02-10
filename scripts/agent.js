import { ethers } from 'ethers';
import dotenv from 'dotenv';
import gen from '../ascii-generator.js';

const { generate } = gen;

dotenv.config();

const RPC = process.env.MONAD_TESTNET_RPC || 'https://testnet-rpc.monad.xyz/';
const CONTRACT = '0x3F40E0DB446a891271B9b21535081BD051B5Aa97';
const INTERVAL = parseInt(process.env.AGENT_INTERVAL_MS || '3600000');

const ABI = [
  'function createArtwork(string,string,string) external returns (uint256)',
  'function totalArtworks() external view returns (uint256)',
  'function getRecentArtworks(uint256) external view returns (uint256[])',
  'function likeArtwork(uint256) external'
];

const PATTERNS = ['circles', 'waves', 'diamond', 'grid', 'noise'];

function setup() {
  if (!process.env.PRIVATE_KEY) {
    console.error('PRIVATE_KEY not set. Copy .env.example to .env and configure.');
    process.exit(1);
  }
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT, ABI, wallet);
}

async function generateAndMint(contract) {
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const art = generate(pattern.toUpperCase(), { type: 'pattern', pattern, width: 40, height: 15 });

  console.log(`[${new Date().toISOString()}] Minting ${pattern} artwork...`);
  const tx = await contract.createArtwork(art, `Autonomous ${pattern}`, `Agent-generated ${pattern} pattern`);
  await tx.wait();
  console.log(`[${new Date().toISOString()}] Minted! TX: ${tx.hash}`);
}

async function browseAndLike(contract) {
  try {
    const total = await contract.totalArtworks();
    if (total === 0n) return;
    const ids = await contract.getRecentArtworks(total > 5n ? 5 : Number(total));
    for (const id of ids) {
      try {
        await contract.likeArtwork(id);
        console.log(`[${new Date().toISOString()}] Liked #${id}`);
      } catch { /* already liked */ }
    }
  } catch (e) {
    console.error('Browse error:', e.message);
  }
}

async function main() {
  const contract = setup();
  console.log(`Agent starting (interval: ${INTERVAL / 1000}s)...`);

  await generateAndMint(contract);
  await browseAndLike(contract);

  setInterval(async () => {
    await generateAndMint(contract);
    await browseAndLike(contract);
  }, INTERVAL);
}

main().catch(console.error);
