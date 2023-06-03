//imports
//function deployFunc() {
    //console.log("Hi")
//}

//module.exports.default = deployFunc
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")


module.exports = async ({ getNamedAccounts, deployments }) => {
    //hre.getNamedAccounts, hre.deployments
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    /**
     * If chainId is X use address Y OR IF chaiId is Z use address A
     */
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"], changing of variable from 
    let ethUsdPriceFeedAddress //Enables updating it.
    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator  = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else { //if we didn't deploy the mock, logic below follows
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //using a mock for localhost/hardhat network
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put pricefeed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1, //waits for block confirmations, && if no block confirmations present, wait for one block.
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        //VERIFY, verify takes the contract address && args
         await verify(fundMe.address, args)
    }

    log("----------------------------------------")
}
modules.exports.tags = ["all", "fundme"] //allows to deploy only the fundme