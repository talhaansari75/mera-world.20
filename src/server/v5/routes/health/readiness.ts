import type { ApiRequest, ApiResponse } from "../../../../lib/v5/api/http";
/** V5 legacy endpoint retired. Use current server functions; this endpoint intentionally has no side effects. */
export async function readiness(_request: ApiRequest): Promise<ApiResponse> {
  return { status: 410, body: { ok: false, route: "health/readiness", message: "Legacy V5 endpoint retired; use the current server API." } };
}
