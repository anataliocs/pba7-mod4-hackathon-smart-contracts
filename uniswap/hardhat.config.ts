import "@parity/hardhat-polkadot"
import "@nomicfoundation/hardhat-toolbox"
import '@nomicfoundation/hardhat-ignition-ethers'

import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomiclabs/hardhat-solhint'
import 'chai'
import {HardhatUserConfig} from "hardhat/config.js";

// Ensure PAPI treats "pending" as "latest" to avoid UnknownBlock on eth_getTransactionCount
process.env.PAPI_ETH_PENDING_IS_LATEST = process.env.PAPI_ETH_PENDING_IS_LATEST ?? "1";


const config: HardhatUserConfig = {
    ignition: {

        strategyConfig: {}
    },
    solidity: '0.8.26',
    resolc: {
        compilerSource: "npm",
        settings: {
            optimizer: {
                enabled: true,
            }
        }
    },
    networks: {
        hardhat: {
            throwOnCallFailures: true,
            throwOnTransactionFailures: true,
            docker: true,
            polkavm: true,
        },
        localNode: {
            polkavm: true,
            url: `http://127.0.0.1:8545`,
            accounts: ["0x5fb92c48bebcd6e98884f76de468fa3f6278f880713595d45af5b0000a702133"],
            docker: true,
            loggingEnabled: true,
            throwOnCallFailures: true,
            throwOnTransactionFailures: true
        },
        /** Polkadot Hub Testnet
         * faucet: https://faucet.polkadot.io/?parachain=1111
         * EVM explorer: https://blockscout-passet-hub.parity-testnet.parity.io/
         * Substrate/EVM explorer: https://assethub-paseo.subscan.io/
         * PAPI explorer: https://dev.papi.how/explorer#networkId=passet_hub&endpoint=wss%3A%2F%2Ftestnet-passet-hub.polkadot.io
         */
        polkadotHubTestnet: {
            polkavm: true,
            url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
            accounts: ["0x5fb92c48bebcd6e98884f76de468fa3f6278f880713595d45af5b0000a702133"],
            chainId: 420420422,
        },
    },
    typechain: {
        target: "ethers-v6",
        outDir: "typechain-types",
    },
    mocha: {
        globals: ["hre"],
        ui: "bdd",
        rootHooks: {
            beforeAll: done => {
            }
        }
    },
    // Disable gas reporter (it requires opcode traces that aren't available here)
    gasReporter: {
        enabled: false,
    },


};

export default config;