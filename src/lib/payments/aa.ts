export type AccountAbstractionAdapter={createUserOperation:(input:{sender:string;callData:string;nonce:bigint})=>Promise<unknown>;sponsorUserOperation?:(userOperation:unknown)=>Promise<unknown>;submitUserOperation:(userOperation:unknown)=>Promise<{userOpHash:string}>};
export function accountAbstractionEnabled(){return String(process.env.AA_ENABLED||"false").toLowerCase()==="true";}
