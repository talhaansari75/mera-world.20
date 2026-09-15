import type { PlayerSave } from "@/lib/game/types";
import { defaultSave, migrateSave } from "@/lib/game/persist";

export const SAVE_SLOT_COUNT = 3;
const PREFIX = "mwsj:v16:slot:";

type SlotRecord = { version: 1; savedAt: number; checksum: string; save: PlayerSave };

function checksum(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function key(slot: number) { return `${PREFIX}${slot}`; }

export function listSaveSlots(): Array<{ slot: number; savedAt: number | null; valid: boolean }> {
  if (typeof localStorage === "undefined") return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => ({ slot: i + 1, savedAt: null, valid: false }));
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => {
    try {
      const raw = localStorage.getItem(key(i + 1));
      if (!raw) return { slot: i + 1, savedAt: null, valid: false };
      const record = JSON.parse(raw) as SlotRecord;
      const body = JSON.stringify(record.save);
      return { slot: i + 1, savedAt: Number(record.savedAt) || null, valid: record.checksum === checksum(body) };
    } catch { return { slot: i + 1, savedAt: null, valid: false }; }
  });
}

export function saveToSlot(slot: number, save: PlayerSave): boolean {
  if (slot < 1 || slot > SAVE_SLOT_COUNT || typeof localStorage === "undefined") return false;
  try {
    const body = JSON.stringify(save);
    const record: SlotRecord = { version: 1, savedAt: Date.now(), checksum: checksum(body), save: migrateSave(save) };
    localStorage.setItem(`${key(slot)}.bak`, localStorage.getItem(key(slot)) ?? "");
    localStorage.setItem(key(slot), JSON.stringify(record));
    return true;
  } catch { return false; }
}

export function loadFromSlot(slot: number): PlayerSave | null {
  if (slot < 1 || slot > SAVE_SLOT_COUNT || typeof localStorage === "undefined") return null;
  const candidates = [key(slot), `${key(slot)}.bak`];
  for (const k of candidates) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const record = JSON.parse(raw) as SlotRecord;
      const save = migrateSave(record.save);
      if (record.checksum === checksum(JSON.stringify(record.save))) return save;
    } catch { /* try backup */ }
  }
  return null;
}

export function deleteSlot(slot: number): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(key(slot));
  localStorage.removeItem(`${key(slot)}.bak`);
}

export function createEmptySlotPreview(): PlayerSave { return defaultSave(); }
