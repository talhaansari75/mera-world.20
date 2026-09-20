export function dedupeKey(parts:string[]){return parts.map(p=>p.normalize('NFC').trim()).join(':')}
