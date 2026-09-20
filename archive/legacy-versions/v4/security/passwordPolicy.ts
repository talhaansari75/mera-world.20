export function passwordScore(value:string){let s=0;if(value.length>=12)s++;if(/[a-z]/.test(value))s++;if(/[A-Z]/.test(value))s++;if(/\d/.test(value))s++;if(/[^A-Za-z0-9]/.test(value))s++;return s}
export function passwordAllowed(value:string){return value.length>=12&&passwordScore(value)>=4}
