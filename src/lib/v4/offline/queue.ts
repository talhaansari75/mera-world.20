export type QueueItem={id:string,type:string,payload:unknown,attempts:number};
export class OfflineQueue{private q:QueueItem[]=[];push(x:QueueItem){this.q.push(x)}peek(){return this.q[0]??null}shift(){return this.q.shift()??null}size(){return this.q.length}}
