import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const from = process.env.EMAIL_FROM || "Mera World <onboarding@resend.dev>";
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY missing — email not sent:", opts.to, opts.subject);
    return { ok: false as const, error: "RESEND_API_KEY missing" };
  }
  const { data, error } = await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (error) {
    console.error("[email] send failed", error);
    return { ok: false as const, error: String(error) };
  }
  return { ok: true as const, id: data?.id };
}
