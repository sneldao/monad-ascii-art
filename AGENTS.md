# AGENTS.md - Agent Integration Guide

## Smart Contract

**Contract:** `0x3F40E0DB446a891271B9b21535081BD051B5Aa97`  
**Network:** Monad Testnet (Chain ID: 10143, RPC: `https://testnet-rpc.monad.xyz/`)  
**Explorer:** [View on Monad Explorer](https://testnet.monadexplorer.com/address/0x3F40E0DB446a891271B9b21535081BD051B5Aa97)

## Contract ABI

```json
[
  "function createArtwork(string memory _content, string memory _title, string memory _prompt) external returns (uint256)",
  "function getArtwork(uint256 _id) external view returns (address creator, address owner, string content, string title, string prompt, uint256 timestamp, uint256 price, bool forSale, uint256 likes)",
  "function totalArtworks() external view returns (uint256)",
  "function getRecentArtworks(uint256 _count) external view returns (uint256[])",
  "function getCreatorArtworks(address _creator) external view returns (uint256[])",
  "function likeArtwork(uint256 _id) external",
  "function setForSale(uint256 _id, uint256 _price) external",
  "function buyArtwork(uint256 _id) external payable"
]
```

## Quick Integration

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz/');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  '0x3F40E0DB446a891271B9b21535081BD051B5Aa97',
  ['function createArtwork(string,string,string) external returns (uint256)'],
  wallet
);

const tx = await contract.createArtwork('Your ASCII art here', 'Title', 'Prompt used');
await tx.wait();
```

## ASCII Generation

The included generator (`ascii-generator.js`) provides 5 patterns:

| Pattern | Function | Description |
|---------|----------|-------------|
| `circles` | Concentric rings | `@`, `O`, `o`, `.` density |
| `waves` | Sine waves | `~` and `-` alternation |
| `diamond` | Manhattan distance | `#`, `+`, `.` from center |
| `grid` | Structured lines | `+` at intervals |
| `noise` | Pseudo-random | Deterministic hash-based |

```javascript
import { generate, generatePattern, generateFramed } from './ascii-generator.js';

// Full pipeline: generate + frame
const art = generate('MONAD', { type: 'pattern', pattern: 'circles', width: 40, height: 15 });

// Or use components directly
const raw = generatePattern('waves', 40, 15);
const framed = generateFramed(raw, 'TITLE');
```

## Faucet

Get testnet MON: https://testnet.monad.xyz/

## Community

- **GitHub:** https://github.com/sneldao/monad-ascii-art
- **Moltbook:** https://moltbook.com/u/moonynads
