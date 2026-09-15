export type OnlineUser={id:string;email:string;name:string;role:"player"|"moderator"|"admin"};
const base=()=>import.meta.env.VITE_API_URL||"http://localhost:8787";
const tokenKey="mwsj.online.token";
export const getToken=()=>localStorage.getItem(tokenKey);
export const setToken=(t:string)=>localStorage.setItem(tokenKey,t);
export const clearToken=()=>localStorage.removeItem(tokenKey);
async function call(path:string,init:RequestInit={}){
 const headers=new Headers(init.headers);headers.set("content-type","application/json");
 const t=getToken();if(t)headers.set("authorization",`Bearer ${t}`);
 const r=await fetch(base()+path,{...init,headers});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(data.error||`HTTP ${r.status}`);return data;
}
export async function apiLogin(email:string,password:string){const d=await call("/auth/login",{method:"POST",body:JSON.stringify({email,password})});setToken(d.token);return d.user as OnlineUser;}
export async function apiSignup(email:string,password:string,name:string){const d=await call("/auth/signup",{method:"POST",body:JSON.stringify({email,password,name})});setToken(d.token);return d.user as OnlineUser;}
export async function apiLoadSave(){return call("/save");}
export async function apiSave(payload:unknown,version=1,baseUpdatedAt:number|null=null,deviceId?:string){
 return call("/save",{method:"PUT",body:JSON.stringify({version,payload,baseUpdatedAt,deviceId})});
}
export async function apiAdminUsers(){return call("/admin/users");}
export async function apiAdminBlock(id:string){return call(`/admin/users/${id}/block`,{method:"POST"});}
export async function apiAdminUnblock(id:string){return call(`/admin/users/${id}/unblock`,{method:"POST"});}
export async function apiAdminRole(id:string,role:"player"|"moderator"|"admin"){return call(`/admin/users/${id}/role`,{method:"PATCH",body:JSON.stringify({role})});}
export async function apiAdminDelete(id:string){return call(`/admin/users/${id}`,{method:"DELETE"});}
