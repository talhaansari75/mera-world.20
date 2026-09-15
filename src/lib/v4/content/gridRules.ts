export type Direction=[number,number];
export const directions:Direction[]=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
export function inBounds(r:number,c:number,size:number){return r>=0&&c>=0&&r<size&&c<size}
