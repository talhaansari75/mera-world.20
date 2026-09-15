export type WordPolicy={minLength:number;maxLength:number;allowDigits:boolean};
export const defaultWordPolicy:WordPolicy={minLength:2,maxLength:24,allowDigits:false};
export const validateWord=(word:string,p=defaultWordPolicy)=>{const w=word.normalize("NFC").trim();if(w.length<p.minLength||w.length>p.maxLength)return false;if(!p.allowDigits&&/[0-9]/.test(w))return false;return /[^\p{L}\p{M}' -]/u.test(w)===false;};
