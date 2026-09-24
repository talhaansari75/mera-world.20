export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_MAINNET_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const BASE_SEPOLIA_USDC = "0x036CbD53842c5426634aDC6F8B1F4F4Ff6C8B0b";

export type EthereumProvider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
};
declare global { interface Window { ethereum?: EthereumProvider; } }

export function getEthereum(): EthereumProvider {
  if (typeof window === "undefined" || !window.ethereum) throw new Error("No EVM wallet found. Install MetaMask or another compatible wallet.");
  return window.ethereum;
}
export async function connectWallet(): Promise<string> {
  const ethereum = getEthereum();
  const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("No wallet account was selected.");
  return address;
}
export async function switchToChain(chainId: number): Promise<void> {
  const ethereum = getEthereum();
  const hex = "0x" + chainId.toString(16);
  try { await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] }); }
  catch (error: any) {
    if (error?.code !== 4902) throw error;
    const isSepolia = chainId === BASE_SEPOLIA_CHAIN_ID;
    await ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: hex, chainName: isSepolia ? "Base Sepolia" : "Base", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, rpcUrls: [isSepolia ? "https://sepolia.base.org" : "https://mainnet.base.org"], blockExplorerUrls: [isSepolia ? "https://sepolia.basescan.org" : "https://basescan.org"] }] });
  }
}
const TRANSFER_SELECTOR = "0xa9059cbb";
export function encodeErc20Transfer(recipient: string, amountAtomic: string): string {
  if (!/^0x[0-9a-fA-F]{40}$/.test(recipient)) throw new Error("Invalid payment recipient.");
  if (!/^\d+$/.test(amountAtomic)) throw new Error("Invalid token amount.");
  return TRANSFER_SELECTOR + recipient.slice(2).padStart(64, "0") + BigInt(amountAtomic).toString(16).padStart(64, "0");
}
export async function sendUsdcPayment(tokenAddress: string, recipient: string, amountAtomic: string): Promise<string> {
  const ethereum = getEthereum();
  const accounts = (await ethereum.request({ method: "eth_accounts" })) as string[];
  const from = accounts?.[0] ?? (await connectWallet());
  return String(await ethereum.request({ method: "eth_sendTransaction", params: [{ from, to: tokenAddress, data: encodeErc20Transfer(recipient, amountAtomic) }] }));
}
