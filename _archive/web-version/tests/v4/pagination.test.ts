import { page } from "../../src/lib/v4/api/pagination"; console.assert(page([1,2,3],2).items.length===2);
