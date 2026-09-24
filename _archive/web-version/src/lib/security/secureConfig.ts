export type PublicConfig = {
  apiBaseUrl: string;
  appVersion: string;
  aiEnabled: boolean;
  paymentsEnabled: boolean;
  web3Enabled: boolean;
};

/** Production secrets must never be returned to the browser. */
export function assertNoClientSecrets(env: Record<string, string | undefined>) {
  const forbidden = Object.keys(env).filter((key) => /(_KEY|_SECRET|TOKEN|PASSWORD|PRIVATE)/i.test(key));
  if (forbidden.length) throw new Error(`Refusing to expose secret-like configuration: ${forbidden.join(', ')}`);
}
