import {
  apiAdminUsers, apiAdminBlock, apiAdminUnblock, apiAdminRole, apiAdminDelete, getToken
} from "./onlineApi.ts";

export type AdminStats={total:number;active:number;blocked:number;admins:number;players:number;moderators:number};

export async function loadAdminDashboard(){
  if(!getToken()) throw new Error("Admin login required.");
  const data=await apiAdminUsers();
  const users=data.users||[];
  const stats:AdminStats={
    total:users.length,
    active:users.filter((u:any)=>!u.blocked).length,
    blocked:users.filter((u:any)=>!!u.blocked).length,
    admins:users.filter((u:any)=>u.role==="admin").length,
    players:users.filter((u:any)=>u.role==="player").length,
    moderators:users.filter((u:any)=>u.role==="moderator").length
  };
  return {users,stats};
}
export {apiAdminBlock,apiAdminUnblock,apiAdminRole,apiAdminDelete};
