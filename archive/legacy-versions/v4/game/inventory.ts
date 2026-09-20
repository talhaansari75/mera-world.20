export type InventoryEntry={itemId:string,quantity:number};
export function addItem(items:InventoryEntry[],itemId:string,quantity=1){const copy=items.map(x=>({...x}));const hit=copy.find(x=>x.itemId===itemId);if(hit)hit.quantity+=quantity;else copy.push({itemId,quantity});return copy}
