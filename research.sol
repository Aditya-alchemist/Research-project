// SPDX-License-Identifier: MIT
pragma solidity 0.8.28; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {

    enum Degree{none,Btech,Mtech,Phd}

    address public owner; 
    error Not_owner();
    error DO_NOT_HAVE_BTECH();
    error DO_NOT_HAVE_MTECH();
    error DO_NOT_HAVE_PHD(); 

    struct certificateholder{
    string name;
    bool hasrecievedbtech;
    bool hasrecievedmtech;
    bool hasrecievedphd;
    Degree btech;
    Degree mtech;
    Degree Phd;
    uint256 btechcertificateid;
    uint256 mtechcertificateid;
    uint256 phdcertificateid;
 }
mapping (address=>certificateholder) public Certificateholder;
uint256 private s_tokencounter;
mapping (uint256=>string) public s_tokenidtouri;
certificateholder[] public Certificateholderlist; 

constructor() ERC721("RESEARCH","CERTI"){
s_tokencounter=0;
 owner= msg.sender;

}

function persondetails(string memory _name ,address holder, bool hasbetech, bool hasmtech, bool hasphd   ) public {
    require(owner==msg.sender,Not_owner());
    certificateholder storage person = Certificateholder[holder];
    person.name=_name;
    if(hasbetech){
        person.btech=Degree.Btech;
    }
    if(hasmtech){
        person.mtech=Degree.Mtech;
    }
    if(hasphd){
        person.Phd=Degree.Phd;
    }

    Certificateholderlist.push(person);

    

}


function mintbtechcertificate(string memory tokenUri) public {
    certificateholder storage person= Certificateholder[msg.sender];
    require(person.btech==Degree.Btech,DO_NOT_HAVE_BTECH());
    s_tokenidtouri[s_tokencounter]=tokenUri;
    _safeMint(msg.sender,s_tokencounter);
    person.btechcertificateid=s_tokencounter;
    s_tokencounter++;
    person.hasrecievedbtech=true;


}
function mintmtechcertificate(string memory tokenUri) public {
certificateholder storage person= Certificateholder[msg.sender];
require(person.mtech==Degree.Mtech,DO_NOT_HAVE_MTECH());
    s_tokenidtouri[s_tokencounter]=tokenUri;
    _safeMint(msg.sender,s_tokencounter);
    person.mtechcertificateid=s_tokencounter;
    s_tokencounter++;
    person.hasrecievedmtech=true;


}
function mintphdcertificate(string memory tokenUri) public {
    certificateholder storage person= Certificateholder[msg.sender];
require(person.Phd==Degree.Phd,DO_NOT_HAVE_PHD());
    s_tokenidtouri[s_tokencounter]=tokenUri;
    _safeMint(msg.sender,s_tokencounter);
    person.phdcertificateid=s_tokencounter;
    s_tokencounter++;
    person.hasrecievedphd=true;


}

function verifyyourticket(address holder) public view  returns(string memory name,bool hasrecievedbtech,bool hasrecievedmtech,bool haserecievedphd,Degree btech,Degree mtech,Degree phd,uint256 btechid,uint256 mtechid,uint256 phdid){
   certificateholder storage person = Certificateholder[holder];
   return(
   person.name,
   person.hasrecievedbtech,
   person.hasrecievedmtech,
   person.hasrecievedphd,
   person.btech,
   person.mtech,
   person.Phd,
   person.btechcertificateid,
   person.mtechcertificateid,
   person.phdcertificateid
   );
}

function transferFrom(address from, address to, uint256 tokenId) public virtual override  {
      revert();
        
    }

     function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override  {
       revert();
    }



}