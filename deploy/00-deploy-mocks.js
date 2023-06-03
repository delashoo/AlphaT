const { network } = require("hardhat") //explicitly defining where the network originates from.
const { 
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
   // const chainId = network.config.chainId, deleted code line since Helper file works with network name. 

    if(developmentChains.includes(network.name)) {
        //includes keyword checks if a variable is inside an array. 
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args:[DECIMALS, INITIAL_ANSWER],
        }) //Arguments are from the MockV3Aggregator constructor. 
        log("Mocks deployed!")
        log("--------------------")
    }
}

module.exports.tags = ["all", "mocks"] //allows to only run the mocks
//confirmed!