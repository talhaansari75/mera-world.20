export type NetworkState = { online: boolean; changedAt: number };
export function currentNetworkState(): NetworkState { return { online: typeof navigator === "undefined" ? true : navigator.onLine, changedAt: Date.now() }; }
