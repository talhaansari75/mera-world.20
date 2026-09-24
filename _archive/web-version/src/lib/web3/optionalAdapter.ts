export interface Web3Adapter {
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  sign(message: string): Promise<string>;
}

/** Optional boundary only. Core gameplay must not depend on Web3. */
export class DisabledWeb3Adapter implements Web3Adapter {
  async connect(): Promise<string> { throw new Error('WEB3_DISABLED'); }
  async disconnect(): Promise<void> { /* no-op */ }
  async sign(): Promise<string> { throw new Error('WEB3_DISABLED'); }
}
