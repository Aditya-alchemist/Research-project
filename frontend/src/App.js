import React , {useState} from 'react';
import {ethers, BrowserProvider} from 'ethers';
import axios from 'axios';

const CONTRACT_ADDRESS= "0x26684C0Fd95554A7516D55Dda122D0F7Ea80fD2A";
const PINATA_API_KEY="223553f88ea60420fae4";
const PINATA_SECRET_KEY="36b531be959f28db2b3a9b8672fe4243dd82ccf518624ebbffd1b5b1280ec78d";
const CONTRACT_ABI= [
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
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
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
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "holder",
                "type": "address"
            }
        ],
        "name": "Certificateholder",
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
                "name": "hasrecievedphd",
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
                "name": "Phd",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "btechcertificateid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "mtechcertificateid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "phdcertificateid",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
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
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
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
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
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
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
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
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
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
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
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
    }
];

const BTECHCERTIFICATE= {
    id: 1,
    name: "Btech Certificate",
    description: "This is a certificate for Btech",
    imageCID:""
};

const MTECHCERTIFICATE= {
    id: 1,
    name: "Mtech Certificate",
    description: "This is a certificate for Mtech",
    imageCID:""
};

const PHDCERTIFICATE= {
    id: 3,
    name: "Phd Certificate",
    description: "This is a certificate for Phd",
    imageCID:""
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
    const [account, setAccount] = useState('');

    const connectbutton = async () => {
        if (window.ethereum) {
            try {
                
}