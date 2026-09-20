import { validateContentPack, type ContentPack } from "./content-pack";
export interface GameCommand {type:string; payload:unknown; id:string; timestamp:number}
export interface CommandResult {ok:boolean; code:string; data?:unknown; errors?:string[]}
export function executeContentPackCommand(pack:ContentPack):CommandResult {
 const errors=validateContentPack(pack); return errors.length?{ok:false,code:"INVALID_CONTENT",errors}:{ok:true,code:"OK",data:{packId:pack.id,wordCount:pack.words.length}};
}
