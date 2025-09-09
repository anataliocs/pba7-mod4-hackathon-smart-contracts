import env, {ethers, network} from "hardhat"; // chai.use(solidity)
import {expect} from "chai";
import {ERC20} from "../typechain-types";
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";
import "@nomicfoundation/hardhat-ethers"
import hre from "hardhat"

const expandTo18Decimals = (n: number): bigint =>
    env.ethers.getBigInt(n) * env.ethers.getBigInt('1000000000000000000');

const TOTAL_SUPPLY = expandTo18Decimals(10000);
const TEST_AMOUNT = expandTo18Decimals(10);

describe('UniswapV2ERC20 Happy Path', () => {

    let token: ERC20;
    let wallet: SignerWithAddress;
    let other: SignerWithAddress;

    beforeEach(async () => {

        const [w, o] = await ethers.getSigners();
        wallet = w;
        other = o;

        const ERC20Factory = await ethers.getContractFactory("ERC20");

        token = await ERC20Factory.deploy(TOTAL_SUPPLY);
        await token.waitForDeployment();

        let value;

        if (network.name === 'localNode') {
            value = ethers.parseEther('1000000') // Local node has higher gas fees
        } else {
            value = ethers.parseEther('1')
        }

        // send balance to other
        await wallet.sendTransaction({
            to: await other.getAddress(),
            value,
        });
    });

    it("name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH", async () => {
        const deployer = await wallet.getAddress();
        const abiCoder = new ethers.AbiCoder();

        const name = await token.name();
        expect(name)
            .to.eq("Uniswap V2");
        expect(await token.symbol())
            .to.eq("UNI-V2");
        expect(await token.decimals())
            .to.eq(18);
        expect(await token.totalSupply())
            .to.eq(TOTAL_SUPPLY);
        expect(await token.balanceOf(deployer))
            .to.eq(TOTAL_SUPPLY);

        const tokenAddress: ERC20 = await token.waitForDeployment();
        const {chainId} = await ethers.provider.getNetwork();

        expect(await token.DOMAIN_SEPARATOR())
            .to.eq(
            ethers.keccak256(
                abiCoder.encode(
                    ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                    [
                        ethers.keccak256(
                            ethers.toUtf8Bytes(
                                "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                            )
                        ),
                        ethers.keccak256(ethers.toUtf8Bytes(name)),
                        ethers.keccak256(ethers.toUtf8Bytes("1")),
                        chainId,
                        tokenAddress,
                    ])));

        expect(await token.PERMIT_TYPEHASH())
            .to.eq(ethers.keccak256(
            ethers.toUtf8Bytes(
                "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
            )));
    });


    it("approve", async () => {
        const walletAddress = await wallet.getAddress();

        await expect(token.approve(await other.getAddress(), TEST_AMOUNT))
            .to.emit(token, "Approval")
            .withArgs(walletAddress, await other.getAddress(), TEST_AMOUNT);

        expect(await token.allowance(walletAddress, await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });


    it("transfer", async () => {
        await expect(token.transfer(await other.getAddress(), TEST_AMOUNT))
            .to.emit(token, "Transfer")
            .withArgs(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT);

        expect(await token.balanceOf(await wallet.getAddress()))
            .to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        expect(await token.balanceOf(await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });

    it("transfer:fail", async () => {
        await expect(token.transfer(await other.getAddress(), TOTAL_SUPPLY + 1n))
            .to.be.reverted;

        await expect(token.connect(other).transfer(await wallet.getAddress(), 1n))
            .to.be.reverted;
    });


    it("transferFrom", async () => {
        await token.approve(await other.getAddress(), TEST_AMOUNT);

        expect(await token.allowance(
            await wallet.getAddress(),
            await other.getAddress()
        ))
            .to.eq(TEST_AMOUNT);

        await expect(
            token.connect(other)
                .transferFrom(
                    await wallet.getAddress(),
                    await other.getAddress(),
                    TEST_AMOUNT
                ))
            .to.emit(token, "Transfer")
            .withArgs(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT);

        expect(await token.allowance(
            await wallet.getAddress(),
            await other.getAddress()
        ))
            .to.eq(0n);

        expect(await token.balanceOf(await wallet.getAddress()))
            .to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        expect(await token.balanceOf(await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });


    it("transferFrom:max", async () => {
        await token.approve(await other.getAddress(), ethers.MaxUint256);

        await expect(token.connect(other)
            .transferFrom(await wallet.getAddress(),
                await other.getAddress(),
                TEST_AMOUNT
            ))
            .to.emit(token, "Transfer")
            .withArgs(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT);

        expect(await token.allowance(
            await wallet.getAddress(),
            await other.getAddress()
        ))
            .to.eq(ethers.MaxUint256);

        expect(await token.balanceOf(await wallet.getAddress()))
            .to.eq(TOTAL_SUPPLY - TEST_AMOUNT);

        expect(await token.balanceOf(await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });
});