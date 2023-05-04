// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

//IMPORTS
import "./priceconverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//ERRORCODES
error FUndMe__NotOwner();

//Interfacess && Libraries >> Contracts

/**
 * @title A contract for crowd funding
 * @author delashoo
 * @notice This contract demos a sample funding contract
 * @dev this implements pricefeeds as library
 */
contract FundMe {
    //type declarations
    using priceconverter for uint256;

    //state variables
    address public immutable i_owner; //gas efficiency

    AggregatorV3Interface public priceFeed;

    //Set minimum funding amount
    uint256 public constant MIN_USD = 25 * 1e18;

    //mapping of addresses to amount they funded
    mapping(address => uint256) AddressToAmount;

    //Array of addresses of funders
    address[] public funders;

    //modifiers
    modifier onlyOwner() {
        //require(msg.sender == owner, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    //FUNCTIONS
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

        //receive & fallbacK
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MIN_USD,
            "Didn't send enough!"
        ); //REVERTING
        funders.push(msg.sender);
        AddressToAmount[msg.sender] += msg.value;
    }

    function withdraw() public payable onlyOwner {
        //for loop to loop thro' the array of funders removing the funders
        //starting index, ending index, step amount
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            AddressToAmount[funder] = 0;
        }

        funders = new address[](0);

        //withdrawing funds from a contract
        //Transfer,send,call
        //payable(msg.sender).transfer(address(this).balance);

        //send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");

        //call - lower level command
        (bool callSucces, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucces, "call failed");
    }    
}

/**
     *Blockchain oracle - Any device that provides blockchains with external data & computation
     * Chainlink - a modular decentralized oracle network to bring data & external computation.
     can be completely customized to bring in any type of data/computation to blockchain network.
     * Services include; 
            1. DAtafeeds
            2. Verifiable Random function
            3. Chainlink Keepers - nodes that listen to specific events to perform actions.
            4. End-to-end reliability for smart contracts. - 
     */
