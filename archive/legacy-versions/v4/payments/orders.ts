export type Order={id:string,userId:string,sku:string,amount:number,currency:string,status:'pending'|'paid'|'failed'|'refunded'};
export function orderTotal(items:{amount:number,quantity:number}[]){return items.reduce((s,x)=>s+x.amount*x.quantity,0)}
