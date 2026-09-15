export const featureFlags={ai:true,multiplayer:true,cloudSync:true,creatorTools:true,analytics:true,payments:true,web3:false,voice:false} as const;
export type FeatureFlag=keyof typeof featureFlags;
export function enabled(flag:FeatureFlag){return featureFlags[flag]}
