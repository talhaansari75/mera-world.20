import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CGx5mu5K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_SEPOLIA_CHAIN_ID = 84532;
function getEthereum() {
	if (typeof window === "undefined" || !window.ethereum) throw new Error("No EVM wallet found. Install MetaMask or another compatible wallet.");
	return window.ethereum;
}
async function connectWallet() {
	const address = (await getEthereum().request({ method: "eth_requestAccounts" }))?.[0];
	if (!address) throw new Error("No wallet account was selected.");
	return address;
}
async function switchToChain(chainId) {
	const ethereum = getEthereum();
	const hex = "0x" + chainId.toString(16);
	try {
		await ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: hex }]
		});
	} catch (error) {
		if (error?.code !== 4902) throw error;
		const isSepolia = chainId === BASE_SEPOLIA_CHAIN_ID;
		await ethereum.request({
			method: "wallet_addEthereumChain",
			params: [{
				chainId: hex,
				chainName: isSepolia ? "Base Sepolia" : "Base",
				nativeCurrency: {
					name: "Ether",
					symbol: "ETH",
					decimals: 18
				},
				rpcUrls: [isSepolia ? "https://sepolia.base.org" : "https://mainnet.base.org"],
				blockExplorerUrls: [isSepolia ? "https://sepolia.basescan.org" : "https://basescan.org"]
			}]
		});
	}
}
var TRANSFER_SELECTOR = "0xa9059cbb";
function encodeErc20Transfer(recipient, amountAtomic) {
	if (!/^0x[0-9a-fA-F]{40}$/.test(recipient)) throw new Error("Invalid payment recipient.");
	if (!/^\d+$/.test(amountAtomic)) throw new Error("Invalid token amount.");
	return TRANSFER_SELECTOR + recipient.slice(2).padStart(64, "0") + BigInt(amountAtomic).toString(16).padStart(64, "0");
}
async function sendUsdcPayment(tokenAddress, recipient, amountAtomic) {
	const ethereum = getEthereum();
	const from = (await ethereum.request({ method: "eth_accounts" }))?.[0] ?? await connectWallet();
	return String(await ethereum.request({
		method: "eth_sendTransaction",
		params: [{
			from,
			to: tokenAddress,
			data: encodeErc20Transfer(recipient, amountAtomic)
		}]
	}));
}
function Shop() {
	const [config, setConfig] = (0, import_react.useState)(null), [wallet, setWallet] = (0, import_react.useState)(""), [busy, setBusy] = (0, import_react.useState)(false), [message, setMessage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		fetch("/api/payments/base").then((r) => r.json()).then(setConfig).catch(() => setMessage("Payment service unavailable."));
	}, []);
	async function buy(item) {
		if (!config) return;
		setBusy(true);
		setMessage("");
		try {
			const address = await connectWallet();
			setWallet(address);
			await switchToChain(config.chainId);
			const ir = await fetch("/api/payments/base", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "create",
					productId: item.id,
					payerAddress: address
				})
			});
			const intent = await ir.json();
			if (!ir.ok) throw new Error(intent.error || "Could not create payment.");
			const txHash = await sendUsdcPayment(intent.tokenAddress, intent.recipientAddress, intent.amountAtomic);
			const vr = await fetch("/api/payments/base", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					action: "verify",
					intentId: intent.intentId,
					txHash
				})
			});
			const verified = await vr.json();
			if (!vr.ok && vr.status !== 202) throw new Error(verified.error || "Payment verification failed.");
			setMessage(verified.status === "paid" ? `Payment confirmed. ${item.diamonds.toLocaleString()} gems unlocked.` : "Transaction submitted. Press Verify again after confirmation.");
		} catch (e) {
			setMessage(e instanceof Error ? e.message : "Payment failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-[#060914] px-4 py-10 text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.3em] text-indigo-300",
						children: "Ink & Starlight"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-4xl font-semibold",
						children: "Gem Shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-slate-400",
						children: "Pay with USDC on Base. Blockchain verification happens on the server."
					}),
					wallet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-slate-500",
						children: [
							"Wallet: ",
							wallet.slice(0, 6),
							"…",
							wallet.slice(-4)
						]
					})
				]
			}), !config ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message || "Loading payment options…" }) : config.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-200",
				children: config.error
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-3",
				children: config.products.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold",
							children: item.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-3xl font-bold",
							children: ["$", item.priceUsd]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-slate-400",
							children: [item.diamonds.toLocaleString(), " Gems"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: busy,
							onClick: () => buy(item),
							className: "mt-6 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold disabled:opacity-50",
							children: busy ? "Processing…" : "Pay with USDC"
						})
					]
				}, item.id))
			})]
		})
	});
}
//#endregion
export { Shop as component };
