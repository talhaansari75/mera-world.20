const blocked=[/\bjavascript:/i,/\bdata:text\/html/i,/<script\b/i,/onerror\s*=/i];
export function safeText(input:string,max=2000){const value=input.trim().slice(0,max);return blocked.some(r=>r.test(value))?'':value}
