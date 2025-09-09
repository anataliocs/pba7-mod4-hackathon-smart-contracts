import "@parity/hardhat-polkadot"
import "@nomicfoundation/hardhat-toolbox"
import '@nomicfoundation/hardhat-ignition-ethers'

import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
import '@nomiclabs/hardhat-solhint'
import 'chai'
import {HardhatUserConfig} from "hardhat/config";
import { randomBytes, createHash } from "crypto";

// Ensure PAPI treats "pending" as "latest" to avoid UnknownBlock on eth_getTransactionCount
process.env.PAPI_ETH_PENDING_IS_LATEST = process.env.PAPI_ETH_PENDING_IS_LATEST ?? "1";

// Generate or normalize a good 32-byte CREATE2 salt
function normalizeSalt(input: string): string {
    // Accept hex (with/without 0x) or arbitrary string to be hashed
    let stripped = input.startsWith("0x") ? input.slice(2) : input;
    const hexRegex = /^[0-9a-fA-F]+$/;
    if (!hexRegex.test(stripped) || stripped.length !== 64) {
        // Hash arbitrary input to 32 bytes
        stripped = createHash("sha256").update(input).digest("hex");
        // Ensure exactly 32 bytes (64 hex chars)
        if (stripped.length < 64) {
            stripped = stripped.padStart(64, "0");
        } else if (stripped.length > 64) {
            stripped = stripped.slice(0, 64);
        }
    }
    return "0x" + stripped.toLowerCase();
}

const create2Salt: string = normalizeSalt(
    process.env.IGNITION_CREATE2_SALT ||
    process.env.CREATE2_SALT ||
    randomBytes(32).toString("hex")
);

const config: HardhatUserConfig = {
    ignition: {
        maxFeeBumps: 5,
        strategyConfig: {
            create2: {
                salt: create2Salt,
            }
        }
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
    defaultNetwork: "localNode",
    networks: {
        hardhat: {
            throwOnCallFailures: true,
            throwOnTransactionFailures: true,
            docker: true,
            polkavm: true,
        },
        localNode: {
            polkavm: true,
            url: "http://127.0.0.1:8545",
            accounts: ["0x5fb92c48bebcd6e98884f76de468fa3f6278f880713595d45af5b0000a702133"],
            docker: true,
            loggingEnabled: true,
            throwOnCallFailures: true,
            throwOnTransactionFailures: true,
            gasPrice: 0
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
        kusamaHub: {
            polkavm: true,
            url: "https://kusama-asset-hub-eth-rpc.polkadot.io",
            accounts: ["0x5fb92c48bebcd6e98884f76de468fa3f6278f880713595d45af5b0000a702133"],
            chainId: 420420418,
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
                console.log("Running beforeAll hook");
                done();
            }
        }
    },
    // Disable gas reporter (it requires opcode traces that aren't available here)
    gasReporter: {
        enabled: false,
    },
};

export default config;