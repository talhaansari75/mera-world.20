export type ReviewDecision="approved"|"rejected"|"needs_review";
export type ReviewResult={decision:ReviewDecision;reasons:string[]};
export const reviewText=(text:string):ReviewResult=>{const t=text.trim();if(!t)return {decision:"rejected",reasons:["empty"]};if(t.length>5000)return {decision:"rejected",reasons:["too_long"]};return {decision:"needs_review",reasons:["human_or_policy_check_required"]};};
