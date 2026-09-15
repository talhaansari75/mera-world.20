export const roles={user:["read:own"],moderator:["read:reports","write:reports"],admin:["*"]} as const;
export function allowed(role:keyof typeof roles,permission:string){const p=roles[role] as readonly string[];return p.includes("*")||p.includes(permission);}
