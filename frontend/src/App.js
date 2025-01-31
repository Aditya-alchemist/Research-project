import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './App.css';

const CONTRACT_ADDRESS = "0xb339bDc0aC8B7Fe8ae1B987D16957b91f709F875";
const PINATA_API_KEY = "223553f88ea60420fae4";
const PINATA_SECRET_KEY = "36b531be959f28db2b3a9b8672fe4243dd82ccf518624ebbffd1b5b1280ec78d";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "DO_NOT_HAVE_BTECH",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DO_NOT_HAVE_MTECH",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DO_NOT_HAVE_PHD",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Not_owner",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "holder",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "hasbetech",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "hasmtech",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "hasphd",
                "type": "bool"
            }
        ],
        "name": "persondetails",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenUri",
                "type": "string"
            }
        ],
        "name": "mintbtechcertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenUri",
                "type": "string"
            }
        ],
        "name": "mintmtechcertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenUri",
                "type": "string"
            }
        ],
        "name": "mintphdcertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "holder",
                "type": "address"
            }
        ],
        "name": "verifyyourticket",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "hasrecievedbtech",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "hasrecievedmtech",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "haserecievedphd",
                "type": "bool"
            },
            {
                "internalType": "enum Research.Degree",
                "name": "btech",
                "type": "uint8"
            },
            {
                "internalType": "enum Research.Degree",
                "name": "mtech",
                "type": "uint8"
            },
            {
                "internalType": "enum Research.Degree",
                "name": "phd",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "btechid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "mtechid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "phdid",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "s_tokenidtouri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
;

const CERTIFICATE_IMAGES = [
  {
    id: 1,
    name: "Btech Certificate",
    description: "Bachelor of Technology Degree Certificate",
    imageCID: "bafkreignwirp27fiqlrearvqsrwkw3pfio23xphetzev3oncg5i4bb5fee"
  },
  {
    id: 2,
    name: "Mtech Certificate",
    description: "Master of Technology Degree Certificate",
    imageCID: "bafybeid7hffg3doj2zz7rvqwa6r27ko5tdz4pde7yrldct54psdfgyugji"
  },
  {
    id: 3,
    name: "Phd Certificate",
    description: "Doctor of Philosophy Degree Certificate",
    imageCID: "bafybeigr7bsxko7u5mhw4zj5kueauhcp5t3uou3tvyb6w7c7m7j65hygh4"
  }
];

const createMetadata = async (certificate) => {
  const metadata = {
    name: certificate.name,
    description: certificate.description,
    image: `ipfs://${certificate.imageCID}`,
    external_url: `${PINATA_GATEWAY}${certificate.imageCID}`,
    attributes: [
      {
        trait_type: "Certificate Type",
        value: certificate.name.split(' ')[0]
      },
      {
        trait_type: "Institution",
        value: "Your Institution Name"
      },
      {
        display_type: "date", 
        trait_type: "Issue Date",
        value: Math.floor(Date.now() / 1000)
      }
    ]
  };

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    return {
      ipfsHash: response.data.IpfsHash,
      metadataUrl: `ipfs://${response.data.IpfsHash}`,
      httpUrl: `${PINATA_GATEWAY}${response.data.IpfsHash}`
    };
  } catch (err) {
    console.error("Error uploading to Pinata:", err);
    throw new Error("Failed to upload metadata to Pinata");
  }
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [holder, setHolder] = useState('');
  const [hasbtech, setHasBtech] = useState(false);
  const [hasmtech, setHasMtech] = useState(false);
  const [hasphd, setHasPhd] = useState(false);
  const [verifyingaddress, setVerifyingAddress] = useState('');
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metadataInfo, setMetadataInfo] = useState(null);

  const connectButton = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const personDetails = async () => {
    if (!window.ethereum) {
      setError("Please connect your wallet");
      alert("Please connect your wallet");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.persondetails(name, holder, hasbtech, hasmtech, hasphd);
      await tx.wait();
      alert("Details added successfully");
      setHasBtech(false);
      setHasMtech(false);
      setHasPhd(false);
      setName('');
      setHolder('');
    } catch (error) {
      setError(error.message);
      alert("Only organisation can add details");
    }
  };

  // Separate functions for minting each type of certificate
  const mintBtechCertificate = async () => {
    if (!window.ethereum) {
      setError("Please connect your wallet");
      alert("Please connect your wallet");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const certificate = CERTIFICATE_IMAGES[0]; // Btech certificate
      const metadata = await createMetadata(certificate);
      setMetadataInfo(metadata);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.mintbtechcertificate(metadata.metadataUrl);
      await tx.wait();
      
      alert("BTech certificate minted successfully");
      setError('');
    } catch (error) {
      setError(error.message);
      alert("Only person with BTech qualification can mint this certificate");
    } finally {
      setLoading(false);
    }
  };

  const mintMtechCertificate = async () => {
    if (!window.ethereum) {
      setError("Please connect your wallet");
      alert("Please connect your wallet");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const certificate = CERTIFICATE_IMAGES[1]; // Mtech certificate
      const metadata = await createMetadata(certificate);
      setMetadataInfo(metadata);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.mintmtechcertificate(metadata.metadataUrl);
      await tx.wait();
      
      alert("MTech certificate minted successfully");
      setError('');
    } catch (error) {
      setError(error.message);
      alert("Only person with MTech qualification can mint this certificate");
    } finally {
      setLoading(false);
    }
  };

  const mintPhdCertificate = async () => {
    if (!window.ethereum) {
      setError("Please connect your wallet");
      alert("Please connect your wallet");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const certificate = CERTIFICATE_IMAGES[2]; // PhD certificate
      const metadata = await createMetadata(certificate);
      setMetadataInfo(metadata);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.mintphdcertificate(metadata.metadataUrl);
      await tx.wait();
      
      alert("PhD certificate minted successfully");
      setError('');
    } catch (error) {
      setError(error.message);
      alert("Only person with PhD qualification can mint this certificate");
    } finally {
      setLoading(false);
    }
  };

  const verifyYourTicket = async () => {
    if (!window.ethereum) {
      setError("Please connect your wallet");
      alert("Please connect your wallet");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const details = await contract.verifyyourticket(verifyingaddress);
      setVerificationDetails({
        name: details[0],
        hasBtech: details[1],
        hasMtech: details[2],
        hasPhd: details[3],
        btech: details[4],
        mtech: details[5],
        phd: details[6],
        btechId: details[7].toString(),
        mtechId: details[8].toString(),
        phdId: details[9].toString()
      });
      alert("Details verified successfully");
      setVerifyingAddress('');
    } catch (error) {
      setError(error.message);
      alert("Details not found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wallet Connection Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
          <button 
            onClick={connectButton}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {walletAddress ? `Connected: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

        {/* Add Person Details Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Add Person Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Holder Address"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasbtech}
                  onChange={(e) => setHasBtech(e.target.checked)}
                  className="mr-2"
                />
                BTech
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasmtech}
                  onChange={(e) => setHasMtech(e.target.checked)}
                  className="mr-2"
                />
                MTech
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasphd}
                  onChange={(e) => setHasPhd(e.target.checked)}
                  className="mr-2"
                />
                PhD
              </label>
            </div>
            <button
              onClick={personDetails}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Details
            </button>
          </div>
        </div>

        {/* Mint Certificates Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Mint Certificates</h2>
          <div className="space-y-6">
            {/* BTech Certificate */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">{CERTIFICATE_IMAGES[0].name}</h3>
              <img 
                src={`${PINATA_GATEWAY}${CERTIFICATE_IMAGES[0].imageCID}`}
                alt={CERTIFICATE_IMAGES[0].name}
                className="w-64 h-auto mb-4 rounded"
              />
              <button
                onClick={mintBtechCertificate}
                disabled={loading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Mint BTech Certificate"}
              </button>
            </div>

            {/* MTech Certificate */}
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">{CERTIFICATE_IMAGES[1].name}</h3>
              <img 
                src={`${PINATA_GATEWAY}${CERTIFICATE_IMAGES[1].imageCID}`}
                alt={CERTIFICATE_IMAGES[1].name}
                className="w-64 h-auto mb-4 rounded"
              />
              <button
                onClick={mintMtechCertificate}
                disabled={loading}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Mint MTech Certificate"}
              </button>
            </div>

            {/* PhD Certificate */}
            <div className="pb-6">
              <h3 className="text-xl font-semibold mb-4">{CERTIFICATE_IMAGES[2].name}</h3>
              <img 
                src={`${PINATA_GATEWAY}${CERTIFICATE_IMAGES[2].imageCID}`}
                alt={CERTIFICATE_IMAGES[2].name}
                className="w-64 h-auto mb-4 rounded"
              />
              <button
                onClick={mintPhdCertificate}
                disabled={loading}
                className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Mint PhD Certificate"}
              </button>
            </div>
          </div>
        </div>

        {/* Verify Certificate Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Verify Certificate</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Address to Verify"
              value={verifyingaddress}
              onChange={(e) => setVerifyingAddress(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={verifyYourTicket}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Verify Certificate
              </button>
            </div>
  
            {/* Verification Results Display */}
            {verificationDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Verification Results</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {verificationDetails.name}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {/* BTech Details */}
                    <div className="p-3 bg-white rounded shadow-sm">
                      <h4 className="font-semibold">BTech</h4>
                      <p>Status: {verificationDetails.hasBtech ? "Verified" : "Not Verified"}</p>
                      {verificationDetails.hasBtech && (
                        <p>Certificate ID: {verificationDetails.btechId}</p>
                      )}
                    </div>
                    
                    {/* MTech Details */}
                    <div className="p-3 bg-white rounded shadow-sm">
                      <h4 className="font-semibold">MTech</h4>
                      <p>Status: {verificationDetails.hasMtech ? "Verified" : "Not Verified"}</p>
                      {verificationDetails.hasMtech && (
                        <p>Certificate ID: {verificationDetails.mtechId}</p>
                      )}
                    </div>
                    
                    {/* PhD Details */}
                    <div className="p-3 bg-white rounded shadow-sm">
                      <h4 className="font-semibold">PhD</h4>
                      <p>Status: {verificationDetails.hasPhd ? "Verified" : "Not Verified"}</p>
                      {verificationDetails.hasPhd && (
                        <p>Certificate ID: {verificationDetails.phdId}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
  
          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
  
          {/* Metadata Info Display */}
          {metadataInfo && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Metadata Information</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">IPFS Hash:</span> {metadataInfo.ipfsHash}</p>
                <p><span className="font-semibold">Metadata URL:</span> {metadataInfo.metadataUrl}</p>
                <p>
                  <span className="font-semibold">HTTP URL:</span>
                  <a 
                    href={metadataInfo.httpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 ml-2"
                  >
                    View on IPFS
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default App;