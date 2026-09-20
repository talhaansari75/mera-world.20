export function eloDelta(rating:number,opponent:number,actual:number,k=32){const expected=1/(1+10**((opponent-rating)/400));return Math.round(k*(actual-expected))}
