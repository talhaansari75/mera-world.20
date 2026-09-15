import { useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import { loadFromSlot, listSaveSlots, saveToSlot, deleteSlot, SAVE_SLOT_COUNT } from "@/lib/v16/save/saveSlots";

export function SaveSlotsScreen({ onBack }: { onBack: () => void }) {
  const save = useGame((s) => s.save);
  const [refresh, setRefresh] = useState(0);
  const slots = useMemo(() => listSaveSlots(), [refresh]);
  const [message, setMessage] = useState("");
  const saveSlot = (slot: number) => { setMessage(saveToSlot(slot, save) ? `Saved to slot ${slot}.` : "Could not save this slot."); setRefresh((x) => x + 1); };
  const loadSlot = (slot: number) => {
    const next = loadFromSlot(slot);
    if (!next) { setMessage(`Slot ${slot} is empty or corrupted.`); return; }
    useGame.getState().applyCloud(next);
    useGame.getState().persist();
    setMessage(`Loaded slot ${slot}.`);
  };
  return <div className="min-h-screen p-5"><div className="mx-auto max-w-xl space-y-4">
    <div><p className="text-xs uppercase tracking-[0.2em] text-accent">Recovery vault</p><h1 className="mt-1 text-2xl font-bold">Save Slots</h1><p className="text-sm text-muted">Three local slots with checksums and rotating backups.</p></div>
    {Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => i + 1).map((slot) => {
      const meta = slots[slot - 1]!;
      return <div key={slot} className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><div><p className="font-semibold">Slot {slot}</p><p className="text-xs text-muted">{meta.savedAt ? new Date(meta.savedAt).toLocaleString() : "Empty"} · {meta.valid ? "Checksum OK" : meta.savedAt ? "Needs recovery" : ""}</p></div><div className="flex gap-2"><button className="hud-chip text-fg" onClick={() => saveSlot(slot)}>Save</button><button className="hud-chip text-fg" onClick={() => loadSlot(slot)} disabled={!meta.valid}>Load</button><button className="hud-chip text-fg" onClick={() => { deleteSlot(slot); setRefresh((x) => x + 1); }}>Clear</button></div></div></div>;
    })}
    {message && <p className="text-sm text-muted">{message}</p>}
    <button className="rounded-xl border px-4 py-2" onClick={onBack}>Back</button>
  </div></div>;
}
