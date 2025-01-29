// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import {Script} from  "lib/forge-std/src/Script.sol";
import  {Research} from "../src/research.sol";

contract deploycontract is Script{
    function run() external{
        vm.startBroadcast();
        Research research = new Research();
        vm.stopBroadcast();
    }
}