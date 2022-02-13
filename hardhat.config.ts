import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "@tenderly/hardhat-tenderly";
import dotenv from "dotenv";
import {task} from "hardhat/config";

dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const INFURA_API_KEY = process.env.INFURA_API_KEY || '';

if (!DEPLOYER_PRIVATE_KEY) {
    console.warn('DEPLOYER_PRIVATE_KEY missing, deployment not working');
}
if (!INFURA_API_KEY) {
    console.warn('INFURA_API_KEY missing, deployments to the Ethereum network');
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const privateKeys = DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [];
const disableOptimizer = ['1', 'true'].indexOf((process.env.DISABLE_OPTIMIZER ?? '').toLowerCase()) !== -1;

export default {
    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: disableOptimizer ? {} : {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                },
            },
        ]
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: disableOptimizer,
        },
        mainnet: { // Ethereum mainnet
            url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
            accounts: privateKeys,
        },
        rinkeby: { // Ethereum mainnet
            url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
            accounts: privateKeys,
        },
        bsc: {
            url: 'https://bsc-dataseed.binance.org/',
            chainId: 56,
            gasPrice: 10_000_000_000, // 10 GWei
            accounts: privateKeys,
        },
        "bsc-testnet": {
            url: 'https://data-seed-prebsc-2-s2.binance.org:8545/',
            chainId: 97,
            gasPrice: 10_000_000_000, // 10 GWei
            accounts: privateKeys,
        },
        matic: {
            url: 'https://polygon-rpc.com/',
            chainId: 137,
            gasPrice: 50_000_000_000, // 50 GWei
            accounts: privateKeys,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    }
};
