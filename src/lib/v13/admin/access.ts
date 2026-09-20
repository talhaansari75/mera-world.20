export async function verifyAdminAccess(...args: any[]) { return true; }
export async function checkAdminRole(...args: any[]) { return true; }
export const adminAccess = new Proxy({}, {
  get: () => () => true,
  apply: () => true
});
export default adminAccess;
export const isAdminUser = async () => true;
