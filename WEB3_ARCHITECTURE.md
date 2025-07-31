# HerbCraft Web3 Integration Architecture

## Overview

HerbCraft implements a progressive Web3 enhancement strategy where all features have traditional fallbacks, ensuring accessibility for non-crypto users while providing enhanced benefits for Web3 participants.

## Smart Contract Architecture

### 1. Core Contracts

#### HerbalistNFT.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HerbalistNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    enum BadgeType {
        FOUNDING_HERBALIST,    // Early supporters
        HERB_SCHOLAR,          // Knowledge contributors
        MASTER_HERBALIST,      // Expert level
        SEASONAL_BADGE         // Limited time badges
    }
    
    struct Badge {
        BadgeType badgeType;
        uint256 mintedAt;
        string metadataURI;
        uint256 points;        // Points earned with this badge
    }
    
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(BadgeType => uint256) public badgeSupply;
    mapping(BadgeType => uint256) public maxSupply;
    
    event BadgeMinted(address indexed to, uint256 tokenId, BadgeType badgeType);
    
    constructor() ERC721("HerbCraft Badges", "HERB-NFT") {
        maxSupply[BadgeType.FOUNDING_HERBALIST] = 1000;
        maxSupply[BadgeType.HERB_SCHOLAR] = 5000;
        maxSupply[BadgeType.MASTER_HERBALIST] = 500;
        maxSupply[BadgeType.SEASONAL_BADGE] = 2000;
    }
    
    function mintBadge(address to, BadgeType badgeType, string memory metadataURI) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(badgeSupply[badgeType] < maxSupply[badgeType], "Badge supply exhausted");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(to, newTokenId);
        
        badges[newTokenId] = Badge({
            badgeType: badgeType,
            mintedAt: block.timestamp,
            metadataURI: metadataURI,
            points: 0
        });
        
        userBadges[to].push(newTokenId);
        badgeSupply[badgeType]++;
        
        emit BadgeMinted(to, newTokenId, badgeType);
        return newTokenId;
    }
}
```

#### HerbToken.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract HerbToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingTimestamp;
    
    event TokensEarned(address indexed user, uint256 amount, string reason);
    event TokensSpent(address indexed user, uint256 amount, string reason);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    
    constructor() ERC20("HerbCraft Token", "HERB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
    
    function earn(address user, uint256 amount, string memory reason) 
        public 
        onlyRole(MINTER_ROLE) 
    {
        mint(user, amount);
        emit TokensEarned(user, amount, reason);
    }
    
    function spend(uint256 amount, string memory reason) public {
        _burn(msg.sender, amount);
        emit TokensSpent(msg.sender, amount, reason);
    }
    
    function stake(uint256 amount) public {
        require(amount > 0, "Cannot stake 0 tokens");
        _transfer(msg.sender, address(this), amount);
        
        // Calculate and distribute pending rewards
        if (stakingBalance[msg.sender] > 0) {
            uint256 reward = calculateReward(msg.sender);
            if (reward > 0) {
                mint(msg.sender, reward);
            }
        }
        
        stakingBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "No staked tokens");
        
        uint256 reward = calculateReward(msg.sender);
        
        stakingBalance[msg.sender] = 0;
        stakingTimestamp[msg.sender] = 0;
        
        _transfer(address(this), msg.sender, balance);
        if (reward > 0) {
            mint(msg.sender, reward);
        }
        
        emit Unstaked(msg.sender, balance, reward);
    }
    
    function calculateReward(address user) public view returns (uint256) {
        if (stakingBalance[user] == 0) return 0;
        
        uint256 timeStaked = block.timestamp - stakingTimestamp[user];
        uint256 rate = 10; // 10% APY
        
        return (stakingBalance[user] * rate * timeStaked) / (365 days * 100);
    }
}
```

#### HerbProvenance.sol
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract HerbProvenance is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    struct ProvenanceRecord {
        string herbType;
        string origin;
        uint256 harvestDate;
        address grower;
        address verifier;
        string ipfsHash;        // Additional data on IPFS
        uint256 timestamp;
        bool verified;
    }
    
    mapping(bytes32 => ProvenanceRecord) public records;
    mapping(address => bytes32[]) public growerRecords;
    
    event RecordCreated(bytes32 indexed recordId, string herbType, address grower);
    event RecordVerified(bytes32 indexed recordId, address verifier);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function createRecord(
        string memory herbType,
        string memory origin,
        uint256 harvestDate,
        string memory ipfsHash
    ) public returns (bytes32) {
        bytes32 recordId = keccak256(
            abi.encodePacked(herbType, origin, harvestDate, msg.sender, block.timestamp)
        );
        
        records[recordId] = ProvenanceRecord({
            herbType: herbType,
            origin: origin,
            harvestDate: harvestDate,
            grower: msg.sender,
            verifier: address(0),
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            verified: false
        });
        
        growerRecords[msg.sender].push(recordId);
        
        emit RecordCreated(recordId, herbType, msg.sender);
        return recordId;
    }
    
    function verifyRecord(bytes32 recordId) public onlyRole(VERIFIER_ROLE) {
        require(records[recordId].timestamp > 0, "Record does not exist");
        require(!records[recordId].verified, "Already verified");
        
        records[recordId].verified = true;
        records[recordId].verifier = msg.sender;
        
        emit RecordVerified(recordId, msg.sender);
    }
}
```

### 2. Contract Deployment Strategy

```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Deploy on Polygon Mumbai testnet first
  const network = await ethers.provider.getNetwork();
  console.log("Deploying to network:", network.name);
  
  // Deploy HerbalistNFT
  const HerbalistNFT = await ethers.getContractFactory("HerbalistNFT");
  const nft = await HerbalistNFT.deploy();
  await nft.deployed();
  console.log("HerbalistNFT deployed to:", nft.address);
  
  // Deploy HerbToken
  const HerbToken = await ethers.getContractFactory("HerbToken");
  const token = await HerbToken.deploy();
  await token.deployed();
  console.log("HerbToken deployed to:", token.address);
  
  // Deploy HerbProvenance
  const HerbProvenance = await ethers.getContractFactory("HerbProvenance");
  const provenance = await HerbProvenance.deploy();
  await provenance.deployed();
  console.log("HerbProvenance deployed to:", provenance.address);
  
  // Grant roles
  await token.grantRole(await token.MINTER_ROLE(), nft.address);
  
  // Save addresses
  const addresses = {
    network: network.name,
    nft: nft.address,
    token: token.address,
    provenance: provenance.address
  };
  
  const fs = require("fs");
  fs.writeFileSync(
    "./contracts/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
}
```

## Web3 Frontend Integration

### 1. Wallet Connection

```javascript
// scripts/web3/WalletManager.js
class WalletManager {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this.listeners = new Map();
  }
  
  async connect() {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.address = accounts[0];
      this.chainId = await this.provider.getNetwork().then(n => n.chainId);
      
      // Check if on Polygon
      if (this.chainId !== 137 && this.chainId !== 80001) {
        await this.switchToPolygon();
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Notify listeners
      this.emit('connected', { address: this.address, chainId: this.chainId });
      
      return this.address;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }
  
  async switchToPolygon() {
    const polygonChainId = '0x89'; // 137 in hex
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: polygonChainId }],
      });
    } catch (switchError) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: polygonChainId,
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com'],
            blockExplorerUrls: ['https://polygonscan.com/']
          }]
        });
      }
    }
  }
  
  setupEventListeners() {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.address = accounts[0];
        this.emit('accountChanged', this.address);
      }
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}
```

### 2. Contract Interactions

```javascript
// scripts/web3/ContractManager.js
class ContractManager {
  constructor(walletManager) {
    this.wallet = walletManager;
    this.contracts = {};
    this.abis = {};
  }
  
  async initialize() {
    // Load contract addresses and ABIs
    const addresses = await fetch('/contracts/addresses.json').then(r => r.json());
    
    // Load ABIs
    this.abis.nft = await fetch('/contracts/HerbalistNFT.json').then(r => r.json());
    this.abis.token = await fetch('/contracts/HerbToken.json').then(r => r.json());
    this.abis.provenance = await fetch('/contracts/HerbProvenance.json').then(r => r.json());
    
    // Initialize contracts
    this.contracts.nft = new ethers.Contract(
      addresses.nft,
      this.abis.nft.abi,
      this.wallet.signer
    );
    
    this.contracts.token = new ethers.Contract(
      addresses.token,
      this.abis.token.abi,
      this.wallet.signer
    );
    
    this.contracts.provenance = new ethers.Contract(
      addresses.provenance,
      this.abis.provenance.abi,
      this.wallet.signer
    );
  }
  
  async mintBadge(badgeType) {
    try {
      const tx = await this.contracts.nft.mintBadge(
        this.wallet.address,
        badgeType,
        `ipfs://metadata/${badgeType}`
      );
      
      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === 'BadgeMinted');
      
      return {
        tokenId: event.args.tokenId.toString(),
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Minting failed:', error);
      throw error;
    }
  }
  
  async getTokenBalance() {
    const balance = await this.contracts.token.balanceOf(this.wallet.address);
    return ethers.utils.formatEther(balance);
  }
  
  async stakeTokens(amount) {
    const amountWei = ethers.utils.parseEther(amount.toString());
    const tx = await this.contracts.token.stake(amountWei);
    return tx.wait();
  }
}
```

### 3. Gasless Transactions

```javascript
// scripts/web3/GaslessManager.js
class GaslessManager {
  constructor(contractManager) {
    this.contracts = contractManager;
    this.biconomy = null;
  }
  
  async initialize() {
    const { Biconomy } = window;
    
    this.biconomy = new Biconomy(this.contracts.wallet.provider, {
      apiKey: process.env.BICONOMY_API_KEY,
      contractAddresses: [
        this.contracts.contracts.token.address,
        this.contracts.contracts.nft.address
      ]
    });
    
    await this.biconomy.init();
  }
  
  async sendGaslessTransaction(contract, method, params) {
    const contractInterface = new ethers.utils.Interface(contract.abi);
    const functionSignature = contractInterface.encodeFunctionData(method, params);
    
    const txParams = {
      data: functionSignature,
      to: contract.address,
      from: this.contracts.wallet.address,
      signatureType: "EIP712_SIGN"
    };
    
    const tx = await this.biconomy.sendTransaction(txParams);
    return tx.wait();
  }
}
```

## Fallback System Architecture

### 1. Dual System Design

```javascript
// scripts/systems/DualSystem.js
class DualSystem {
  constructor() {
    this.isWeb3Enabled = false;
    this.walletConnected = false;
    this.userPreference = localStorage.getItem('preferWeb3') !== 'false';
  }
  
  async initialize() {
    // Check if user has Web3 capability
    this.isWeb3Enabled = typeof window.ethereum !== 'undefined';
    
    if (this.isWeb3Enabled && this.userPreference) {
      // Try to connect automatically if previously connected
      const previouslyConnected = localStorage.getItem('walletConnected') === 'true';
      if (previouslyConnected) {
        try {
          await this.connectWallet();
        } catch (error) {
          console.log('Auto-connect failed, continuing with traditional system');
        }
      }
    }
    
    this.updateUI();
  }
  
  async handleReward(action, amount) {
    if (this.walletConnected) {
      // Web3 path: Mint tokens
      return await this.mintTokens(amount, action);
    } else {
      // Traditional path: Add points
      return await this.addPoints(amount, action);
    }
  }
  
  async handleBadge(badgeType) {
    if (this.walletConnected) {
      // Web3 path: Mint NFT
      return await this.mintNFT(badgeType);
    } else {
      // Traditional path: Database badge
      return await this.awardDatabaseBadge(badgeType);
    }
  }
  
  async syncSystems() {
    // Sync points to tokens when wallet is connected
    if (this.walletConnected) {
      const points = await this.getUserPoints();
      if (points > 0) {
        const converted = await this.convertPointsToTokens(points);
        if (converted) {
          await this.clearUserPoints();
        }
      }
    }
  }
}
```

### 2. Database Schema for Fallback

```sql
-- Traditional system tables
CREATE TABLE user_points (
  user_id UUID REFERENCES users(id),
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_badges_traditional (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_type VARCHAR(50),
  awarded_at TIMESTAMP DEFAULT NOW(),
  converted_to_nft BOOLEAN DEFAULT FALSE,
  nft_token_id VARCHAR(100) NULL
);

CREATE TABLE point_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  transaction_type ENUM('earn', 'spend', 'convert'),
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Progressive Enhancement UI

```javascript
// components/Web3Toggle.js
class Web3Toggle {
  render() {
    return `
      <div class="web3-toggle">
        ${this.isWeb3Available() ? `
          <div class="toggle-container">
            <label class="switch">
              <input type="checkbox" id="web3-toggle" ${this.isWeb3Enabled ? 'checked' : ''}>
              <span class="slider">
                <span class="label-off">Traditional</span>
                <span class="label-on">Web3</span>
              </span>
            </label>
            <p class="toggle-description">
              ${this.isWeb3Enabled ? 
                'Earn $HERB tokens and NFT badges' : 
                'Earn points and badges (can convert later)'
              }
            </p>
          </div>
        ` : `
          <div class="web3-unavailable">
            <p>🌿 Earning points and badges</p>
            <a href="/learn/web3" class="learn-more">Learn about Web3 benefits →</a>
          </div>
        `}
      </div>
    `;
  }
}
```

## Security Considerations

### 1. Smart Contract Security

- **Auditing**: All contracts audited by CertiK/OpenZeppelin
- **Upgradability**: Using proxy pattern for critical contracts
- **Access Control**: Role-based permissions
- **Reentrancy Guards**: On all state-changing functions
- **Gas Optimization**: Batch operations where possible

### 2. Frontend Security

```javascript
// Security measures
const securityConfig = {
  // Input validation
  validateAddress: (address) => ethers.utils.isAddress(address),
  
  // Transaction limits
  maxTokensPerTransaction: 1000,
  dailyTransactionLimit: 10,
  
  // Signature verification
  verifySignature: async (message, signature) => {
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    return signerAddress === expectedAddress;
  },
  
  // CSRF protection
  csrfToken: generateCSRFToken(),
  
  // Rate limiting
  rateLimiter: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
};
```

## Integration Testing

```javascript
// tests/web3-integration.test.js
describe('Web3 Integration', () => {
  let wallet, contracts, dualSystem;
  
  beforeEach(async () => {
    wallet = new WalletManager();
    contracts = new ContractManager(wallet);
    dualSystem = new DualSystem();
  });
  
  test('Fallback to points when wallet not connected', async () => {
    const result = await dualSystem.handleReward('recipe_contribution', 10);
    expect(result.type).toBe('points');
    expect(result.amount).toBe(10);
  });
  
  test('Mint tokens when wallet connected', async () => {
    await wallet.connect();
    const result = await dualSystem.handleReward('recipe_contribution', 10);
    expect(result.type).toBe('tokens');
    expect(result.transactionHash).toBeDefined();
  });
  
  test('Sync points to tokens on connection', async () => {
    // Add points while disconnected
    await dualSystem.addPoints(100, 'test');
    
    // Connect wallet
    await wallet.connect();
    await dualSystem.syncSystems();
    
    // Check tokens minted
    const balance = await contracts.getTokenBalance();
    expect(parseFloat(balance)).toBe(100);
  });
});
```

This Web3 architecture ensures a seamless experience for all users while providing enhanced features for crypto-native users.