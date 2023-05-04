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
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    /**
     * If chainId is X use address Y OR IF chaiId is Z use address A
     */
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator  = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //using a mock for localhost/hardhat network
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put pricefeed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        //VERIFY
        await verify(fundMe.address, args)
    }

    log("----------------------------------------")
}
modules.exports.tags = ["all", "fundme"]