export function validateGeneratedWords(words:string[],min=2,max=24){return words.filter(w=>/^[\p{L}]+$/u.test(w)&&w.length>=min&&w.length<=max).filter((w,i,a)=>a.indexOf(w)===i)}
