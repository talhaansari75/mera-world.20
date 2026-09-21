# Mera World Production Blockchain Payments
The database remains the source of truth. Blockchain proves payment.
Supported configuration: Base Sepolia, Base mainnet, Ethereum mainnet.
Controls: exact chain/token/payer/recipient/amount verification, 12 confirmations, expiry check, transaction uniqueness, event persistence and refund lifecycle.
Environment: DATABASE_URL, BASE_RPC_URL, BASE_CHAIN_ID, BASE_USDC_ADDRESS, BASE_PAYMENT_RECIPIENT, BASE_REQUIRED_CONFIRMATIONS, BLOCKCHAIN_LISTENER_REORG_WINDOW.
Use Base Sepolia first. Mainnet requires real payment, reconciliation and refund testing.
The Solidity invoice escrow is optional and must be independently audited before production deployment.
The listener should run from a trusted worker/cron every 15-30 seconds. It records transfer events; server-side verification remains authoritative.
ERC-4337 account abstraction is represented by an adapter boundary and must not be enabled without a trusted bundler/paymaster.
Distributed anti-fraud rate limiting should use Redis or another shared store instead of the in-memory helper.