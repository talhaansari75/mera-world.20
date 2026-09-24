import { OfflineQueue } from "../../src/lib/v4/offline/queue"; const q=new OfflineQueue(); q.push({id:"1",type:"x",payload:{},attempts:0}); console.assert(q.size()===1);
