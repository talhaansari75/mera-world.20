export type Role='player'|'creator'|'moderator'|'support'|'admin'|'owner';
const rank:Record<Role,number>={player:0,creator:1,moderator:2,support:2,admin:3,owner:4};
export function can(role:Role,required:Role){return rank[role]>=rank[required]}
