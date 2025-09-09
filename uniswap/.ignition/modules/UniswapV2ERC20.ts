const UniswapV2ERC20Module = buildModule("UniswapV2ERC20", (m) => {
    // Deploy the core UniswapV2ERC20 contract (no constructor args)
    const token = m.contract("UniswapV2ERC20");

    return {token};
});

export default UniswapV2ERC20Module;
