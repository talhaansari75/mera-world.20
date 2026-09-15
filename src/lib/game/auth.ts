export type AuthUser={id:string;email:string;name:string;createdAt:number};
export type AuthResult={ok:boolean;user?:AuthUser;error?:string;token?:string};

const KEY="mwsj.auth.session";
export function getSession():AuthUser|null{
 try{return JSON.parse(localStorage.getItem(KEY)||"null") as AuthUser|null}catch{return null}
}
export function signOut(){localStorage.removeItem(KEY);}
export function localSignUp(email:string,password:string,name:string):AuthResult{
 if(!email.includes("@")||password.length<8)return {ok:false,error:"Use a valid email and an 8+ character password."};
 const user={id:`local-${email.toLowerCase()}`,email:email.toLowerCase(),name:name.trim()||"Player",createdAt:Date.now()};
 localStorage.setItem(KEY,JSON.stringify(user)); return {ok:true,user,token:user.id};
}
export function localSignIn(email:string,password:string):AuthResult{
 if(!email.includes("@")||password.length<8)return {ok:false,error:"Invalid email or password."};
 const user={id:`local-${email.toLowerCase()}`,email:email.toLowerCase(),name:email.split("@")[0]||"Player",createdAt:Date.now()};
 localStorage.setItem(KEY,JSON.stringify(user)); return {ok:true,user,token:user.id};
}
