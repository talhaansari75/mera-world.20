import type { ApiRequest, ApiResponse, HttpMethod } from "./http";
export type Handler = (req: ApiRequest) => Promise<ApiResponse> | ApiResponse;
export type Route = { method: HttpMethod; pattern: RegExp; handler: Handler };
export class RouteRegistry { private routes: Route[]=[]; add(route:Route){this.routes.push(route);return this;} match(req:ApiRequest){return this.routes.find(r=>r.method===req.method && r.pattern.test(req.path));} }
