//imports
//function deployFunc() {
    //console.log("Hi")
//}

//module.exports.default = deployFunc
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const { network } = require("hardhat")


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
    const Fund = await deploy("Fund", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put pricefeed address
        log: true,
    })
    log("----------------------------------------")
}
modules.exports.tags = ["all", "fundme"]