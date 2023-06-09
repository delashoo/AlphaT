const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"//goerli
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"
    },
}

const developmentChains = ["hardhat", "localhost"] //setting the development chains to be equal to hardhat && localhost, not chains with actual datafeeds.
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}