import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const CONTRACT_ADDRESS = "0x26684C0Fd95554A7516D55Dda122D0F7Ea80fD2A";
const PINATA_API_KEY = "223553f88ea60420fae4";
const PINATA_SECRET_KEY = "36b531be959f28db2b3a9b8672fe4243dd82ccf518624ebbffd1b5b1280ec78d";
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

const createMetadata = async (certificate, cid) => {
  const metadata = {
    name: certificate.name,
    description: certificate.description,
    image: `ipfs://${cid}`,
    attributes: [
      {
        trait_type: "Certificate",
        value: certificate.name,
      },
    ],
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

    return response.data.IpfsHash;
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

  const mintCertificate = async (certificateType, cid) => {
    if (!window.ethereum) {
      setError("Please connect your wallet");
      alert("Please connect your wallet");
      return;
    }
    try {
      const certificate = {
        name: `${certificateType} Certificate`,
        description: `This is a certificate for ${certificateType}`,
      };
      const createMetadataHash = await createMetadata(certificate, cid);
      const metadataUrl = `ipfs://${createMetadataHash}`;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract[`mint${certificateType.toLowerCase()}certificate`](metadataUrl);
      await tx.wait();
      alert(`${certificateType} certificate minted successfully`);
      setError('');
    } catch (error) {
      setError(error.message);
      alert(`Only person with ${certificateType} qualification can mint certificate`);
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
          <button 
            onClick={connectButton}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {walletAddress ? `Connected: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

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

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Mint Certificates</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">BTech Certificate</h3>
              <button
                onClick={() => mintCertificate('Btech', 'QmbFNmuRSvn1McetnKbEk7Y5cvf2sogmUzxMXToW1PyEf4')}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Mint BTech Certificate
              </button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">MTech Certificate</h3>
              <button
                onClick={() => mintCertificate('Mtech', 'bafybeie2mpq7yeusflqse3mics5pqrzwnhtisvlxq4fx33g6jctg4vs23q')}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Mint MTech Certificate
              </button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PhD Certificate</h3>
              <button
                onClick={() => mintCertificate('Phd', 'bafybeihx5adynixnqzley4twbpixgcuxnb5e4ectqilwznlyjuciunyrfq')}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Mint PhD Certificate
              </button>
            </div>
          </div>
        </div>

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

            {verificationDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Verification Results:</h3>
                <p><strong>Name:</strong> {verificationDetails.name}</p>
                <p><strong>Qualifications:</strong></p>
                <ul className="list-disc pl-5">
                  {verificationDetails.hasBtech && <li>BTech (ID: {verificationDetails.btechId})</li>}
                  {verificationDetails.hasMtech && <li>MTech (ID: {verificationDetails.mtechId})</li>}
                  {verificationDetails.hasPhd && <li>PhD (ID: {verificationDetails.phdId})</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
