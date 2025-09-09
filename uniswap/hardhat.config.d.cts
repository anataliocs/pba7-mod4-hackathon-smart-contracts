export const __esModule: boolean;
export default config;
declare namespace config {
    namespace ignition {
        let strategyConfig: {};
    }
    let solidity: string;
    namespace resolc {
        let compilerSource: string;
        namespace settings {
            namespace optimizer {
                let enabled: boolean;
            }
        }
    }
    namespace networks {
        namespace hardhat {
            let throwOnCallFailures: boolean;
            let throwOnTransactionFailures: boolean;
            let docker: boolean;
            let polkavm: boolean;
        }
        namespace localNode {
            let polkavm_1: boolean;
            export { polkavm_1 as polkavm };
            export let url: string;
            export let accounts: string[];
            let docker_1: boolean;
            export { docker_1 as docker };
            export let loggingEnabled: boolean;
            let throwOnCallFailures_1: boolean;
            export { throwOnCallFailures_1 as throwOnCallFailures };
            let throwOnTransactionFailures_1: boolean;
            export { throwOnTransactionFailures_1 as throwOnTransactionFailures };
        }
        namespace polkadotHubTestnet {
            let polkavm_2: boolean;
            export { polkavm_2 as polkavm };
            let url_1: string;
            export { url_1 as url };
            let accounts_1: string[];
            export { accounts_1 as accounts };
            export let chainId: number;
        }
    }
    namespace typechain {
        let target: string;
        let outDir: string;
    }
    namespace mocha {
        let globals: string[];
        let ui: string;
        namespace rootHooks {
            function beforeAll(done: any): void;
        }
    }
    namespace gasReporter {
        let enabled_1: boolean;
        export { enabled_1 as enabled };
    }
}
