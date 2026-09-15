export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ApiRequest = { method: HttpMethod; path: string; headers: Record<string,string>; body?: unknown; requestId: string };
export type ApiResponse<T=unknown> = { status: number; body: T; headers?: Record<string,string> };
export const json = <T>(status:number, body:T): ApiResponse<T> => ({status, body, headers:{"content-type":"application/json"}});
