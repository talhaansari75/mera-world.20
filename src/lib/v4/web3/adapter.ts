export type WalletAdapter={connect():Promise<string>;sign(message:string):Promise<string>};
export function walletConfigured(adapter:WalletAdapter|null){return adapter!==null}
