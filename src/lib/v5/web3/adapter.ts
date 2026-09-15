export type WalletState={connected:boolean;address?:string;chainId?:number};
export interface Web3Adapter{connect():Promise<WalletState>;disconnect():Promise<void>;sign(message:string):Promise<string>;}
