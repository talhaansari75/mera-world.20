export type LedgerEntry = { id: string; currency: 'coins'|'diamonds'|'stars'; amount: number; reason: string; at: number };
export class EconomyLedger {
  private entries: LedgerEntry[] = [];
  append(entry: LedgerEntry): void { if (!entry.id || !entry.reason || !Number.isInteger(entry.amount)) throw new Error('invalid_ledger_entry'); if (this.entries.some(e => e.id === entry.id)) return; this.entries.push({ ...entry }); }
  balance(currency: LedgerEntry['currency']): number { return this.entries.filter(e => e.currency === currency).reduce((n,e) => n + e.amount, 0); }
  history(): readonly LedgerEntry[] { return this.entries.slice(); }
}
