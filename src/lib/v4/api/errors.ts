export type ApiErrorCode='BAD_REQUEST'|'UNAUTHORIZED'|'FORBIDDEN'|'NOT_FOUND'|'CONFLICT'|'RATE_LIMITED'|'INTERNAL';
export type ApiError={code:ApiErrorCode;message:string;requestId?:string};
export const apiError=(code:ApiErrorCode,message:string,requestId?:string):ApiError=>({code,message,requestId});
