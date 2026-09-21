export type BlockchainChain={chainId:number;name:string;rpcEnv:string;usdcEnv:string;confirmations:number};
export const SUPPORTED_CHAINS:BlockchainChain[]=[
 {chainId:84532,name:"Base Sepolia",rpcEnv:"BASE_SEPOLIA_RPC_URL",usdcEnv:"BASE_SEPOLIA_USDC_ADDRESS",confirmations:12},
 {chainId:8453,name:"Base",rpcEnv:"BASE_RPC_URL",usdcEnv:"BASE_USDC_ADDRESS",confirmations:12},
 {chainId:1,name:"Ethereum",rpcEnv:"ETHEREUM_RPC_URL",usdcEnv:"ETHEREUM_USDC_ADDRESS",confirmations:12}
];
export function getChain(chainId:number){return SUPPORTED_CHAINS.find(c=>c.chainId===chainId);}