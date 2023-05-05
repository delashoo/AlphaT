const { deployments } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function(){

    let fundMe
    let deployer
    let MockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async function(){
        //deploy hardhat contract>>>using hardhat-deploy
        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", async function(){
        it("sets the aggregator addresses correctly", async function(){
            const response = await fundMe.priceFeed()
            assert.equal(response, MockV3Aggregator.address)
            //assigns the pricefeed address correct to the mockv3aggregator
        })
    })

    describe("fund", async function(){
        it("fails if you don't send enough eth", async function(){
            await expect(fundMe.fund()).to.be.revertedwith("you need to send more eth!")
        })
        it("updated the amount funded data structure", async function(){
            await fundMe.fund({value: sendValue })
            const response = await fundMe.addressToAmount(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("adds funder to funders array", async function(){
            await fundMe.fund({value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })

    describe("fund", async function(){
        beforeEach(async function(){
            await fundMe.fund({ value: sendValue})
        })
        it("withdraw eth from a single founder", async function(){
            //Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.null(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).tostring(), endingDeployerBalance.add(gascost).tostring())
        })

        it("allow us to withdraw eth from multiple funders", async function(){
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

            //act 
            const transactionResponse = await fundMe.withdraw()
            const transactReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.null(effectiveGasPrice)

            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).tostring(), endingDeployerBalance.add(gascost).tostring())

            //funders array is reset properly
            await expect(fundMe.funders(0)).to.be.reverted
            for (let i = 1; i < 6; i++) {
                assert.equal(await fundMe.addressToAmount(accounts[i].address), 0)
            }
        })

        it("only allows the owner to withdraw funds", async function(){
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract =await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.revertedwith("Fund__NotOwner")
        })
    })
})