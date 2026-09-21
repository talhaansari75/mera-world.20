const required = ["BASE_CHAIN_ID","BASE_USDC_ADDRESS","BASE_PAYMENT_RECIPIENT","BASE_RPC_URL"];
const missing = required.filter((k) => !String(process.env[k] || "").trim());
if (missing.length) {
  console.error("Missing blockchain payment configuration:", missing.join(", "));
  process.exit(1);
}
const address = (name) => /^0x[0-9a-fA-F]{40}$/.test(String(process.env[name]));
for (const name of ["BASE_USDC_ADDRESS","BASE_PAYMENT_RECIPIENT"]) {
  if (!address(name)) {
    console.error(`Invalid EVM address in ${name}`);
    process.exit(1);
  }
}
const chainId = Number(process.env.BASE_CHAIN_ID);
if (!Number.isInteger(chainId) || chainId <= 0) {
  console.error("BASE_CHAIN_ID must be a positive integer");
  process.exit(1);
}
console.log("Blockchain payment configuration preflight passed.");
