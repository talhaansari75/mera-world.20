export type FeatureStatus = "implemented" | "integrated" | "external" | "pending";
export interface FeatureRow { id:string; area:string; status:FeatureStatus; owner:string; notes?:string }
export const V6_FEATURES: FeatureRow[] = [
  {id:"progression",area:"Game",status:"integrated",owner:"core"},
  {id:"economy",area:"Game",status:"integrated",owner:"core"},
  {id:"multiplayer",area:"Online",status:"implemented",owner:"server"},
  {id:"security",area:"Platform",status:"integrated",owner:"server"},
  {id:"admin",area:"Operations",status:"implemented",owner:"ops"},
  {id:"payments",area:"External",status:"external",owner:"provider",notes:"Requires provider credentials/webhook deployment"},
  {id:"push",area:"External",status:"external",owner:"provider",notes:"Requires push provider credentials"},
  {id:"ai",area:"External",status:"external",owner:"provider",notes:"Requires server-side model credentials"},
];
