# NFT-Powered Certificate Management System

## Overview
The **NFT-Powered Certificate Management System** leverages blockchain technology and Non-Fungible Tokens (NFTs) to create a **secure, transparent, and efficient** framework for issuing, managing, and verifying certificates. 

### Key Benefits:
- **Fraud Prevention:** Certificates are stored on a blockchain, ensuring immutability.
- **Instant Verification:** Employers and institutions can verify credentials seamlessly.
- **Standardization:** A unified certificate issuance and recognition framework.
- **Data Privacy:** Users have full control over credentials without centralized risks.
- **Global Accessibility:** Certificates are easily shareable and verifiable worldwide.


---

## System Architecture
1. **Blockchain:** Uses a Proof-of-Stake (PoS) network for energy-efficient security.
2. **NFT-Based Certificates:** Each certificate is an NFT with metadata.
3. **Smart Contracts:** Automates issuance, verification, and revocation.
4. **Decentralized Storage:** Uses **IPFS** for storing certificate metadata.

---

## Smart Contract (Solidity)
```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721, Ownable {
    struct Certificate {
        string name;
        string course;
        uint256 issueDate;
    }
    
    mapping(uint256 => Certificate) private _certificates;
    uint256 private _tokenIds;

    constructor() ERC721("CertificateNFT", "CERT") {}

    function issueCertificate(address recipient, string memory name, string memory course) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _certificates[newItemId] = Certificate(name, course, block.timestamp);
        return newItemId;
    }

    function getCertificate(uint256 tokenId) public view returns (Certificate memory) {
        require(_exists(tokenId), "Certificate does not exist");
        return _certificates[tokenId];
    }
}
```

---

## Frontend (React)
```jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import CertificateNFT from './artifacts/CertificateNFT.json';

const CONTRACT_ADDRESS = "0xYourContractAddress";

const App = () => {
  const [wallet, setWallet] = useState('');
  const [certId, setCertId] = useState('');
  const [certDetails, setCertDetails] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setWallet(await signer.getAddress());
    }
  };

  const verifyCertificate = async () => {
    if (!certId) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateNFT.abi, provider);
    const details = await contract.getCertificate(certId);
    setCertDetails({ name: details.name, course: details.course, issueDate: new Date(details.issueDate * 1000).toLocaleDateString() });
  };

  return (
    <div>
      <h1>NFT Certificate Verification</h1>
      <button onClick={connectWallet}>{wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Connect Wallet'}</button>
      <input type="text" placeholder="Enter Certificate ID" value={certId} onChange={(e) => setCertId(e.target.value)} />
      <button onClick={verifyCertificate}>Verify Certificate</button>
      {certDetails && <div><h2>Certificate Details</h2><p>Name: {certDetails.name}</p><p>Course: {certDetails.course}</p><p>Issue Date: {certDetails.issueDate}</p></div>}
    </div>
  );
};

export default App;
```

---

## Setup & Deployment
### Prerequisites:
- **Node.js & npm**
- **MetaMask** browser extension
- **Hardhat** for Solidity development

### Steps:
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NFT-Certificate-System.git
   cd NFT-Certificate-System
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Deploy the smart contract**
   ```bash
   npx hardhat run scripts/deploy.js --network <your-network>
   ```
4. **Start the frontend**
   ```bash
   npm start
   ```

---

## Future Enhancements
- **Layer-2 Scaling** for cost efficiency
- **Multi-Chain Support** for broader adoption
- **AI-Based Fraud Detection** to prevent certificate forgery
- **Mobile App** for seamless certificate management

---

## References & Citations
For detailed insights and prior research, refer to the following sources:
- [NFTCert: Streamlining Certificate Creation & Verification](https://www.ijraset.com/research-paper/nftcert-streamlining-certificate-creation-and-verification)
- [Blockchain-Based Certificate Verification](https://www.researchgate.net/publication/374293796_Blockchain_Based_Certificate_Verification_System_Management)
- [Enterprise NFT Use Cases](https://www.kaleido.io/blockchain-blog/enterprise-nft-examples)


---

## License
This project is licensed under the **MIT License**.

---

## Contributing
We welcome contributions! Feel free to submit issues, feature requests, or pull requests to enhance the project.

---


---

**Built with ❤️ using Blockchain, Solidity, React & IPFS**
