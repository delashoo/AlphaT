// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

//IMPORTS
import "./priceconverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol"; //Allows to use console.log on your projects for debugging

//ERRORCODES
error FundMe__NotOwner();
error InsufficientAmount();

//INTERFACES, LIBRARIES && CONTRACTS
/**
 * @title A crowd funding contract
 * @author delashoo
 * @notice This contract demos a sample funding contract
 * @dev this implements pricefeeds as library
 */
contract FundMe {
    //TYPE DECLARATIONS
    using priceconverter for uint256;

    //STATE VARIABLES
    address public immutable i_owner; // setting the contract's owner address
    AggregatorV3Interface public priceFeed;
    uint256 public constant MIN_USD = 25 * 1e18; //minimum funding amount
    mapping(address => uint256) AddressToAmount; //key-value pair of funders' addresses to the respective amounts contributed
    address[] public funders; //funders' addresses array-dynamic array. 

    //MODIFIERS
    modifier onlyOwner() {
        //require(msg.sender == owner, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    /**FUNCTION ORDER,
     * constructor
     * receive
     * fallback
     * external
     * public
     * internal
     * private
     * view/pure
     */

    /**
     * @param An address type of the pricefeed
     */
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

    /**
     * @notice This function funds the contract
     */
    function fund() public payable {
        if (msg.value.getConversionRate(priceFeed) !<= MIN_USD) {
            revert InsufficientAmount(); //gas optimization by substituting require
        }
        funders.push(msg.sender); //updates the funders array by adding a new address to it, address of index zero, address[0]
        AddressToAmount[msg.sender] += msg.value; //updates the mapping of each funding address to the amount funded.
        //NO event is emited here?
    }

    function withdraw() 
        public 
        payable 
        onlyOwner 
    { 
        //starting index, ending index, step amount
        /**
         * For withrawal; 1. The contracts' funders' array is reset && addresstoAmount mapping is initialized with zero
         */
        for ( uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
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
        (bool callSuccess, ) = payable(msg.sender).call{ value: address(this).balance}("");
        require(callSuccess, "call failed");
    }    
}


