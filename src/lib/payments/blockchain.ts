const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

export const ERC20_TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952adf163c4a11628f55a4df523b3ef";

export function assertAddress(value: string): string {
  if (!ADDRESS_RE.test(value)) throw new Error("Invalid EVM address");
  return value.toLowerCase();
}

export function assertTxHash(value: string): string {
  if (!TX_HASH_RE.test(value)) throw new Error("Invalid transaction hash");
  return value.toLowerCase();
}

export function hexToBigInt(value: string): bigint {
  if (!/^0x[0-9a-fA-F]+$/.test(value)) throw new Error("Invalid hex quantity");
  return BigInt(value);
}

export function topicAddress(value: string): string {
  return assertAddress("0x" + value.replace(/^0x/, "").slice(-40));
}

export function topicAmount(value: string): bigint {
  return hexToBigInt(value);
}

export function hasMatchingErc20Transfer(
  logs: Array<{ address?: string; topics?: string[]; data?: string; removed?: boolean }>,
  tokenAddress: string,
  payerAddress: string,
  recipientAddress: string,
  amountAtomic: bigint,
): boolean {
  const token = assertAddress(tokenAddress);
  const payer = assertAddress(payerAddress);
  const recipient = assertAddress(recipientAddress);
  return logs.some((log) => {
    if (log.removed) return false;
    if (assertAddress(String(log.address ?? "")) !== token) return false;
    const topics = log.topics ?? [];
    if (String(topics[0]).toLowerCase() !== ERC20_TRANSFER_TOPIC) return false;
    if (topics.length < 3) return false;
    try {
      return (
        topicAddress(String(topics[1])) === payer &&
        topicAddress(String(topics[2])) === recipient &&
        topicAmount(String(log.data ?? "")) === amountAtomic
      );
    } catch {
      return false;
    }
  });
}
