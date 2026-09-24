import type { ApiRequest, ApiResponse } from "../../../../lib/v5/api/http";
/** V5 legacy endpoint retired. Use current server functions; this endpoint intentionally has no side effects. */
export async function metrics(_request: ApiRequest): Promise<ApiResponse> {
  return { status: 410, body: { ok: false, route: "admin/metrics", message: "Legacy V5 endpoint retired; use the current server API." } };
}
