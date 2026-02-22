package inft

// ERC7857ABI is the minimal ABI for the ERC-7857 iNFT contract.
// Replace with the full ABI from your deployed contract.
const ERC7857ABI = `[
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string",  "name": "tokenURI", "type": "string"}
    ],
    "name": "mint",
    "outputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
]`
