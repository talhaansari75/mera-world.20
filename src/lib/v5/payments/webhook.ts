export type PaymentWebhook={eventId:string;type:string;payload:unknown;signature:string};
export const validateEventId=(id:string)=>/^[A-Za-z0-9._:-]{8,200}$/.test(id);
