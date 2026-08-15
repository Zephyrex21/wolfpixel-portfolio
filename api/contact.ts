import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Contact form endpoint — runs server-side on Vercel, never in the
 * browser. The Resend API key has to stay a secret (unlike EmailJS's
 * public-key model, which was designed to be safe to ship to the
 * client), so this exists specifically to keep it there.
 *
 * SETUP (~5 minutes):
 * 1. Create a free account at https://resend.com
 * 2. Dashboard -> API Keys -> create one, copy it
 * 3. In the Vercel project -> Settings -> Environment Variables, add:
 *      RESEND_API_KEY     = the key from step 2
 *      CONTACT_TO_EMAIL   = the inbox you want messages delivered to
 *      CONTACT_FROM_EMAIL = optional, see the note below — defaults
 *                           to Resend's shared test address otherwise
 * 4. Redeploy (env var changes need a new deployment to take effect)
 *
 * On the "from" address: Resend's shared `onboarding@resend.dev`
 * works immediately with zero setup, but can only deliver to the
 * email address on your own Resend account — fine for testing, not
 * for a real contact form other people will use. For that, verify a
 * domain you own under Domains in the Resend dashboard (a few DNS
 * records, takes a few minutes to propagate) and set
 * CONTACT_FROM_EMAIL to something like `contact@yourdomain.com`.
 *
 * Until RESEND_API_KEY / CONTACT_TO_EMAIL are set, this returns 503
 * and the form shows the same "not wired up yet" message it always
 * has — nothing breaks if it's left unconfigured.
 */

/**
 * Name/email/message are all attacker-controlled (anyone can POST to
 * this endpoint directly, not just the form) and get interpolated
 * straight into an HTML string below — without escaping, a message
 * containing `<img src=x onerror=...>` or similar would execute inside
 * the email client that opens it. This is the actual security boundary,
 * not just a formatting nicety.
 */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Inline-styled on purpose — email clients (Gmail included) strip or
 * unreliably support <style> blocks, so every rule has to travel with
 * its element to render consistently. Kept deliberately close to the
 * portfolio's own look: plain black/white, thin borders, no color.
 */
function buildEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
<div style="background:#f6f5f2;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e3e1dc;border-radius:16px;overflow:hidden;">
    <div style="padding:28px 32px;border-bottom:1px solid #e3e1dc;">
      <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8780;">
        Portfolio Contact Form
      </p>
      <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#141414;">
        New message from ${safeName}
      </h1>
    </div>

    <div style="padding:24px 32px 8px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:4px 0;font-size:12px;color:#8a8780;width:70px;">From</td>
          <td style="padding:4px 0;font-size:14px;color:#141414;font-weight:600;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:12px;color:#8a8780;">Email</td>
          <td style="padding:4px 0;font-size:14px;">
            <a href="mailto:${safeEmail}" style="color:#141414;text-decoration:underline;">${safeEmail}</a>
          </td>
        </tr>
      </table>

      <div style="background:#f6f5f2;border:1px solid #e3e1dc;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;line-height:1.7;color:#141414;white-space:pre-wrap;">${safeMessage}</p>
      </div>

      <a href="mailto:${safeEmail}" style="display:inline-block;background:#141414;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 22px;border-radius:999px;">
        Reply to ${safeName}
      </a>
    </div>

    <div style="padding:16px 32px;border-top:1px solid #e3e1dc;">
      <p style="margin:0;font-size:11px;color:#a5a29b;">
        Sent from the contact form on your portfolio — reply-to is already set to ${safeEmail}, so you can also just hit reply.
      </p>
    </div>
  </div>
</div>
`.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method-not-allowed" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.CONTACT_TO_EMAIL;
  const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!RESEND_API_KEY || !TO_EMAIL) {
    return res.status(503).json({ error: "not-configured" });
  }

  const { name, email, message } = (req.body ?? {}) as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };

  // Server-side validation — the client's own checks are just UX, this
  // is the real gate, since anyone can POST to this endpoint directly.
  const isValidEmail =
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.length > 200 ||
    !isValidEmail ||
    typeof message !== "string" ||
    message.trim().length < 8 ||
    message.length > 5000
  ) {
    return res.status(400).json({ error: "invalid-input" });
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Portfolio Contact <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: buildEmailHtml(name, email, message),
      }),
    });

    if (!resendRes.ok) {
      const body = await resendRes.text();
      console.error("Resend API error:", resendRes.status, body);
      return res.status(502).json({ error: "send-failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "server-error" });
  }
}
