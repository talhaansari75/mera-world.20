export function validWord(word:string){return /^[\p{L}]+$/u.test(word)&&word.length>=2&&word.length<=24}
export function dedupeWords(words:string[]){return [...new Set(words.map(w=>w.normalize('NFC').trim().toLocaleLowerCase()).filter(validWord))]}
