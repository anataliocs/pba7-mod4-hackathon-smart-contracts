import env, {ethers, network} from "hardhat"; // chai.use(solidity)
import {expect} from "chai";

console.log("test");

function expandTo18Decimals(n) {
    return env.ethers.getBigInt(n) * env.ethers.getBigInt('1000000000000000000');
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);
const TEST_AMOUNT = expandTo18Decimals(10);
describe('UniswapV2ERC20', function () {
    let token;
    let wallet;
    let other;
    beforeEach(async function () {
        const ERC20 = await ethers.getContractFactory("ERC20");
        token = await ERC20.deploy(TOTAL_SUPPLY);
        await token.waitForDeployment();
        wallet = await wallet.getAddress();
        other = wallet.address;
        let value;
        if (network.name === 'localNode') {
            value = ethers.parseEther('1000000'); // Local node has higher gas fees
        } else {
            value = ethers.parseEther('1');
        }
        // send balance to other
        await wallet.sendTransaction({
            to: other.address,
            value: value
        });
    });
    it('name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH', async () => {
        const deployer = await other.getAddress();
        const abiCoder = new ethers.AbiCoder();
        const name = await token.name();
        expect(name).to.eq('Uniswap V2');
        expect(await token.symbol()).to.eq('UNI-V2');
        expect(await token.decimals()).to.eq(18);
        expect(await token.totalSupply()).to.eq(TOTAL_SUPPLY);
        expect(await token.balanceOf(deployer.address)).to.eq(TOTAL_SUPPLY);
        let token_address = await other.getAddress();
        let chainId = env.network.config.chainId;
        expect(await token.DOMAIN_SEPARATOR()).to.eq(ethers.keccak256(abiCoder.encode(['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'], [
            ethers.keccak256(ethers.toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
            ethers.keccak256(ethers.toUtf8Bytes(name)),
            ethers.keccak256(ethers.toUtf8Bytes('1')),
            chainId,
            token_address
        ])));
        expect(await token.PERMIT_TYPEHASH()).to.eq(ethers.keccak256(ethers.toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')));
    });
    it('approve', async () => {
        let walletAddress = await wallet.getAddress();
        await expect(token.approve(other.address, TEST_AMOUNT))
            .to.emit(token, 'Approval')
            .withArgs(walletAddress, other.getAddress(), TEST_AMOUNT);
        expect(await token.allowance(walletAddress, other.address)).to.eq(TEST_AMOUNT);
    });
    it('transfer', async () => {
        await expect(token.transfer(other.address, TEST_AMOUNT))
            .to.emit(token, 'Transfer')
            .withArgs(wallet.address, other.address, TEST_AMOUNT);
        expect(await token.balanceOf(wallet.address)).to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        expect(await token.balanceOf(other.address)).to.eq(TEST_AMOUNT);
    });
    it('transfer:fail', async () => {
        await expect(token.transfer(other.address, TOTAL_SUPPLY + 1)).to.be.reverted; // ds-math-sub-underflow
        await expect(token.connect(other).transfer(wallet.address, 1)).to.be.reverted; // ds-math-sub-underflow
    });
    it('transferFrom', async () => {
        token.approve(other.address, TEST_AMOUNT);
        expect(await token.allowance(wallet.address, other.address)).to.eq(TEST_AMOUNT);
        await expect(token.connect(other).transferFrom(wallet.address, other.address, TEST_AMOUNT))
            .to.emit(token, 'Transfer')
            .withArgs(wallet.address, other.address, TEST_AMOUNT);
        expect(await token.allowance(wallet.address, other.address)).to.eq(0);
        expect(await token.balanceOf(wallet.address)).to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        expect(await token.balanceOf(other.address)).to.eq(TEST_AMOUNT);
    });
    it('transferFrom:max', async () => {
        token.approve(other.address, ethers.MaxUint256);
        await expect(token.connect(other).transferFrom(wallet.address, other.address, TEST_AMOUNT))
            .to.emit(token, 'Transfer')
            .withArgs(wallet.address, other.address, TEST_AMOUNT);
        expect(await token.allowance(wallet.address, other.address)).to.eq(ethers.MaxUint256);
        expect(await token.balanceOf(wallet.address)).to.eq(TOTAL_SUPPLY - TEST_AMOUNT);
        expect(await token.balanceOf(other.address)).to.eq(TEST_AMOUNT);
    });
});
