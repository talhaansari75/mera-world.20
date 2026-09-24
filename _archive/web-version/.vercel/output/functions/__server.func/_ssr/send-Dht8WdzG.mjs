import { t as Resend } from "../_libs/resend+standardwebhooks.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/send-Dht8WdzG.js
var resend = new Resend(process.env.RESEND_API_KEY);
async function sendEmail(opts) {
	const from = process.env.EMAIL_FROM || "Mera World <onboarding@resend.dev>";
	if (!process.env.RESEND_API_KEY) {
		console.warn("[email] RESEND_API_KEY missing — email not sent:", opts.to, opts.subject);
		return {
			ok: false,
			error: "RESEND_API_KEY missing"
		};
	}
	const { data, error } = await resend.emails.send({
		from,
		to: opts.to,
		subject: opts.subject,
		html: opts.html,
		text: opts.text
	});
	if (error) {
		console.error("[email] send failed", error);
		return {
			ok: false,
			error: String(error)
		};
	}
	return {
		ok: true,
		id: data?.id
	};
}
//#endregion
export { sendEmail };
