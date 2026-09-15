export interface FeatureDefinition { key:string; title:string; enabledByDefault:boolean; dependencies:string[] }
export const FEATURES: FeatureDefinition[] = [
  ...Array.from({length:120},(_,i)=>({key:`feature_${String(i+1).padStart(3,"0")}`,title:`Platform Feature ${i+1}`,enabledByDefault:true,dependencies:[]})),
];
export function isFeatureEnabled(key:string, overrides:Record<string,boolean>={}) {
  const f=FEATURES.find(x=>x.key===key); return f ? (overrides[key] ?? f.enabledByDefault) : false;
}
