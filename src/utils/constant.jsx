import { bsc, bscTestnet, mainnet } from "viem/chains";
import bnbImg from '../images/bsc.svg';
import ethImg from '../images/eth.png';
import bstImg from '../images/bst.png';
import bsdImg from '../images/bsd.png';


export const blockstar_test = {
    id: 55,
    name: 'BlockStar TEST',
    network: 'blockstar-test',
    nativeCurrency: {
        decimals: 18,
        name: 'BlockStar',
        symbol: 'TBST',
    },
    rpcUrls: {
        public: { http: ['https://testnet-rpc.blockstar.one'] },
        default: { http: ['https://testnet-rpc.blockstar.one'] },
    },
    blockExplorers: {
        etherscan: { name: 'BlockStarScan', url: 'https://testnet-scan.blockstar.one' },
        default: { name: 'BlockStarScan', url: 'https://testnet-scan.blockstar.one' },
    },
    contracts: {
        multicall3: {
            address: '0xBF429308D450182B13afB96413ffc6855c3388C9',
            blockCreated: 12230,
        },
    },
}

export const blockstar = {
    id: 5512,
    name: 'BlockStar',
    network: 'blockstar',
    nativeCurrency: {
        decimals: 18,
        name: 'BlockStar',
        symbol: 'BST',
    },
    rpcUrls: {
        public: { http: ['https://mainnet-rpc.blockstar.one'] },
        default: { http: ['https://mainnet-rpc.blockstar.one'] },
    },
    blockExplorers: {
        etherscan: { name: 'BlockStarScan', url: 'https://scan.blockstar.one' },
        default: { name: 'BlockStarScan', url: 'https://scan.blockstar.one' },
    },
    contracts: {
        multicall3: {
            address: '0x3c9d85F5C95E40C52980a8648397ca6E7cfA7932',
            blockCreated: 12230,
        },
    }
}


export const ALL_NETWORKS = {
    // 97: {
    //     name: "Binance Testnet",
    //     symbol: "TBNB",
    //     decimals: 18,
    //     rpc: "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
    //     chainId: 97,
    //     explorer: "https://testnet.bscscan.com/",
    //     image: bnbImg,
    //     color: "#f0b90b",
    //     network: bscTestnet,
    //     MULTICALL_ADDRESS: "0xa54fE4a3DbD1Eb21524Cd73754666b7E13b4cB18",
    //     PRESALE_ADDRESS: "0x2aC2B3897542608D5B8311744b4e3A2B8B4c3B67",
    //     TOKEN_ADDRESS: "0x7913f0153833249aF34ADaea9D7D6b1f33797F16"
    // },
    56: {
        name: "Binance Mainnet",
        symbol: "TBNB",
        decimals: 18,
        rpc: "https://bsc-dataseed2.bnbchain.org",
        chainId: 56,
        explorer: "https://bscscan.com/",
        image: bnbImg,
        color: "#f0b90b",
        network: bscTestnet,
        MULTICALL_ADDRESS: "0xcf591ce5574258ac4550d96c545e4f3fd49a74ec",
        PRESALE_ADDRESS: "0x2aC2B3897542608D5B8311744b4e3A2B8B4c3B67",
        TOKEN_ADDRESS: "0x7913f0153833249aF34ADaea9D7D6b1f33797F16"
    },
    55: {
        name: "BlockStar Testnet",
        symbol: "TBST",
        decimals: 18,
        rpc: "https://testnet-rpc.blockstar.one",
        chainId: 55,
        explorer: "https://testnet-scan.blockstar.one/",
        image: bstImg,
        color: "#f0b90b",
        network: blockstar_test,
        MULTICALL_ADDRESS: "0xBF429308D450182B13afB96413ffc6855c3388C9",
        PRESALE_ADDRESS: "0xCED774e540cec8a337cA0957F3559E37dAF217a4",
        TOKEN_ADDRESS: "0x7913f0153833249aF34ADaea9D7D6b1f33797F16",
        NFT_ADDRESS: "0xEb032B93c2bEA2CdddDC5810Dbe42C12fE28C2B7"
    },
    5512: {
        name: "BlockStar Mainnet",
        symbol: "BST",
        decimals: 18,
        rpc: "https://mainnet-rpc.blockstar.one",
        chainId: 5512,
        explorer: "https://scan.blockstar.one/",
        image: bstImg,
        color: "#f0b90b",
        network: blockstar,
        MULTICALL_ADDRESS: "0x3c9d85F5C95E40C52980a8648397ca6E7cfA7932",
        PRESALE_ADDRESS: "0xfCa109E9efD4385AEB2D5e44F476F573A0f8e17f",
        TOKEN_ADDRESS: "0x2eDa77eFaF47881C64B917fd35eD7889Ed1f59f5",
        NFT_ADDRESS: "0xAB81BFcb3B2E0b6A60C09Da496276F273755BDd2"
    },
    1: {
        name: "Ethereum Mainnet",
        symbol: "ETH",
        decimals: 18,
        rpc: "https://ethereum-rpc.publicnode.com",
        chainId: 1,
        explorer: "https://testnet.bscscan.com/",
        image: ethImg,
        color: "#f0b90b",
        network: mainnet,
        MULTICALL_ADDRESS: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
        PRESALE_ADDRESS: "0x2aC2B3897542608D5B8311744b4e3A2B8B4c3B67",
        TOKEN_ADDRESS: "0x7913f0153833249aF34ADaea9D7D6b1f33797F16"
    }
};

export const DEFAULT_CHAIN_ID = 5512;
export const chains = [blockstar, bsc, mainnet , blockstar_test]
export const projectId = import.meta.env.VITE_PROJECT_ID;
export const projectName = import.meta.env.VITE_PROJECT_NAME;
export const projectDesc = import.meta.env.VITE_PROJECT_DESC;
export const projectUrl = import.meta.env.VITE_PROJECT_URL;
export const projectIcon = import.meta.env.VITE_PROJECT_ICON;
export const modalColorCode = import.meta.env.VITE_CONNECT_MODAL_COLOR_CODE;
export const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
export const IPFS_URL = "https://alchemy.mypinata.cloud/ipfs/";
export const ADD_AMOUNT = 0;

export const SUPPORED_CURRENCY = [
    {
        name: "BlockStar Token",
        symbol: "BST",
        address: "",
        img: bstImg,
        blockstarchain: true,
        native: true,
        chainId: 5512
    },
    {
        name: "BlockStar Dollar",
        symbol: "BSD",
        address: "0x7729A49b9833A08598E2aEE7e1c7D7b4c4F7f822",
        img: bsdImg,
        blockstarchain: true,
        native: false,
        chainId: 5512
    },
    {
        name: "Ethereum Token",
        symbol: "ETH",
        address: "",
        img: ethImg,
        blockstarchain: false,
        native: true,
        chainId: 1
    },
    {
        name: "Binanace Token",
        symbol: "BNB",
        address: "",
        img: bnbImg,
        blockstarchain: false,
        native: true,
        chainId: 56
    }
]

export const targetAmount = "100k";
export const targetAmountNumber = 100000;
export const ENDTIME = 1751068800000;
export const BACKEND_API = "https://presale.blockstar.zone/"

export const CREDIT_RATE = 10;
export const RECEVIER_WALLET = "0x2aC2B3897542608D5B8311744b4e3A2B8B4c3B67";

export const COMIC_STYLE = [
    {
        id: "random",
        label: "Random style",
    },
    {
        id: "neutral",
        label: "Neutral (no style)",
    },

    {
        id: "japanese_manga",
        label: "Japanese"
    },
    {
        id: "japanese_color_manga",
        label: "Japanese (color)",
    },
    {
        id: "nihonga",
        label: "Nihonga"
    },
    {
        id: "traditional_chinese_painting",
        label: "Traditional Chinese"
    },
    {
        id: "franco_belgian",
        label: "Franco-Belgian"
    },
    {
        id: "american_comic_90",
        label: "American (modern)",
    },

    {
        id: "american_comic_50",
        label: "American (1950)"
    },
    {
        id: "flying_saucer",
        label: "Flying saucer",
    },

    {
        id: "humanoid",
        label: "Humanoid"
    },
    {
        id: "haddock",
        label: "Haddock"
    },

    {
        id: "armorican",
        label: "Armorican",
    },
    {
        id: "render",
        label: "3D Render"
    },
    {
        id: "klimt",
        label: "Klimt"
    },
    {
        id: "medieval",
        label: "Medieval"
    },

    {
        id: "egyptian",
        label: "Egyptian"
    },

    {
        id: "photonovel",
        label: "Vintage photonovel"
    },
    {
        id: "stockphoto",
        label: "Stock photo"
    }
]