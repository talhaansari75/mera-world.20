export const localeCodes=["en","ur","ur-Latn","hi","ar","bn","pa","sd","ps","tr","es","fr","de","zh","ja"] as const;
export type Locale=typeof localeCodes[number];
export const isRtl=(l:Locale)=>["ur","ar","sd","ps"].includes(l);
