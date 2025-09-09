import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const UniswapV2ERC20Module = buildModule("UniswapV2ERC20", (m) => {
    // Deploy the core UniswapV2ERC20 contract (no constructor args)
    console.log("UniswapV2ERC20Module is being built")
    const token = m.contract("UniswapV2ERC20");

    return {token};
});

export default UniswapV2ERC20Module;
