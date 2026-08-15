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
        subject: `New message from ${name} via portfolio`,
        text: `From: ${name} <${email}>\n\n${message}`,
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
