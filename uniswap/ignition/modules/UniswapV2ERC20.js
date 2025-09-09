"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UniswapV2ERC20Module = buildModule("UniswapV2ERC20", function (m) {
    // Deploy the core UniswapV2ERC20 contract (no constructor args)
    var token = m.contract("UniswapV2ERC20");
    return { token: token };
});
exports.default = UniswapV2ERC20Module;
