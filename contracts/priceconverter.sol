// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

//IMPORTS
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//address [ETH/USD] = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
//Interfaces - Smart contracts with function declarations with no implemented logic
library priceconverter {

    //All functions in a library are internal
    function getPrice() internal view returns(uint256) {
        AggregatorV3Interface  priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        (, int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e18);
    }
    
    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountUsd = (ethPrice * ethAmount)/ 1e18;
        return ethAmountUsd;
    }
}