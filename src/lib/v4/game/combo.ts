export function comboBonus(combo:number){return Math.min(2,1+combo*.04)}
export function comboTier(combo:number){return combo>=50?'legendary':combo>=25?'epic':combo>=10?'rare':combo>=5?'uncommon':'common'}
