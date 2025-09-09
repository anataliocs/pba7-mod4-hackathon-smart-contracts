"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importStar(require("hardhat")); // chai.use(solidity)
const chai_1 = require("chai");
const expandTo18Decimals = (n) => hardhat_1.default.ethers.getBigInt(n) * hardhat_1.default.ethers.getBigInt('1000000000000000000');
const TOTAL_SUPPLY = expandTo18Decimals(10000);
const TEST_AMOUNT = expandTo18Decimals(10);
describe('UniswapV2ERC20 Happy Path', () => {
    let token;
    let wallet;
    let other;
    beforeEach(async () => {
        const [w, o] = await hardhat_1.ethers.getSigners();
        wallet = w;
        other = o;
        const ERC20Factory = await hardhat_1.ethers.getContractFactory("ERC20");
        token = await ERC20Factory.deploy(TOTAL_SUPPLY);
        await token.waitForDeployment();
        let value;
        if (hardhat_1.network.name === 'localNode') {
            value = hardhat_1.ethers.parseEther('1000000'); // Local node has higher gas fees
        }
        else {
            value = hardhat_1.ethers.parseEther('1');
        }
        // send balance to other
        await wallet.sendTransaction({
            to: await other.getAddress(),
            value,
        });
    });
    it("name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH", async () => {
        const deployer = await wallet.getAddress();
        const abiCoder = new hardhat_1.ethers.AbiCoder();
        const name = await token.name();
        (0, chai_1.expect)(name)
            .to.eq("Uniswap V2");
        (0, chai_1.expect)(await token.symbol())
            .to.eq("UNI-V2");
        (0, chai_1.expect)(await token.decimals())
            .to.eq(18);
        (0, chai_1.expect)(await token.totalSupply())
            .to.eq(TOTAL_SUPPLY);
        (0, chai_1.expect)(await token.balanceOf(deployer))
            .to.eq(TOTAL_SUPPLY);
        const tokenAddress = await token.waitForDeployment();
        const { chainId } = await hardhat_1.ethers.provider.getNetwork();
        (0, chai_1.expect)(await token.DOMAIN_SEPARATOR())
            .to.eq(hardhat_1.ethers.keccak256(abiCoder.encode(["bytes32", "bytes32", "bytes32", "uint256", "address"], [
            hardhat_1.ethers.keccak256(hardhat_1.ethers.toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
            hardhat_1.ethers.keccak256(hardhat_1.ethers.toUtf8Bytes(name)),
            hardhat_1.ethers.keccak256(hardhat_1.ethers.toUtf8Bytes("1")),
            chainId,
            tokenAddress,
        ])));
        (0, chai_1.expect)(await token.PERMIT_TYPEHASH())
            .to.eq(hardhat_1.ethers.keccak256(hardhat_1.ethers.toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")));
    });
    it("approve", async () => {
        const walletAddress = await wallet.getAddress();
        await (0, chai_1.expect)(token.approve(await other.getAddress(), TEST_AMOUNT))
            .to.emit(token, "Approval")
            .withArgs(walletAddress, await other.getAddress(), TEST_AMOUNT);
        (0, chai_1.expect)(await token.allowance(walletAddress, await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });
    it("transfer", async () => {
        await (0, chai_1.expect)(token.transfer(await other.getAddress(), TEST_AMOUNT))
            .to.emit(token, "Transfer")
            .withArgs(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT);
        (0, chai_1.expect)(await token.balanceOf(await wallet.getAddress()))
            .to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        (0, chai_1.expect)(await token.balanceOf(await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });
    it("transfer:fail", async () => {
        await (0, chai_1.expect)(token.transfer(await other.getAddress(), TOTAL_SUPPLY + 1n))
            .to.be.reverted;
        await (0, chai_1.expect)(token.connect(other).transfer(await wallet.getAddress(), 1n))
            .to.be.reverted;
    });
    it("transferFrom", async () => {
        await token.approve(await other.getAddress(), TEST_AMOUNT);
        (0, chai_1.expect)(await token.allowance(await wallet.getAddress(), await other.getAddress()))
            .to.eq(TEST_AMOUNT);
        await (0, chai_1.expect)(token.connect(other)
            .transferFrom(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT))
            .to.emit(token, "Transfer")
            .withArgs(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT);
        (0, chai_1.expect)(await token.allowance(await wallet.getAddress(), await other.getAddress()))
            .to.eq(0n);
        (0, chai_1.expect)(await token.balanceOf(await wallet.getAddress()))
            .to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        (0, chai_1.expect)(await token.balanceOf(await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });
    it("transferFrom:max", async () => {
        await token.approve(await other.getAddress(), hardhat_1.ethers.MaxUint256);
        await (0, chai_1.expect)(token.connect(other)
            .transferFrom(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT))
            .to.emit(token, "Transfer")
            .withArgs(await wallet.getAddress(), await other.getAddress(), TEST_AMOUNT);
        (0, chai_1.expect)(await token.allowance(await wallet.getAddress(), await other.getAddress()))
            .to.eq(hardhat_1.ethers.MaxUint256);
        (0, chai_1.expect)(await token.balanceOf(await wallet.getAddress()))
            .to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        (0, chai_1.expect)(await token.balanceOf(await other.getAddress()))
            .to.eq(TEST_AMOUNT);
    });
});
