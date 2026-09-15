export function validDisplayName(value: string) { return /^[\p{L}\p{N} _-]{2,24}$/u.test(value.trim()); }
export function validClanName(value: string) { return /^[\p{L}\p{N} _-]{2,32}$/u.test(value.trim()); }
