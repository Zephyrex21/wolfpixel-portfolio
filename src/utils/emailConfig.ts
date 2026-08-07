/**
 * EmailJS configuration — lets the contact form send you an email
 * directly from the browser, no backend required.
 *
 * SETUP (free, ~3 minutes):
 * 1. Create an account at https://www.emailjs.com
 * 2. Add an Email Service (e.g. connect your Gmail) — copy its Service ID
 * 3. Create an Email Template with variables: {{from_name}}, {{from_email}},
 *    {{message}} — copy its Template ID
 * 4. Account > General > copy your Public Key
 * 5. Fill in the three values below
 *
 * Until these are filled in, the contact form will show a friendly
 * error and the person can still reach you via the email/social cards
 * above it — nothing breaks if you skip this.
 */
export const EMAILJS_CONFIG = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY",
};

export function isEmailjsConfigured(): boolean {
  return (
    EMAILJS_CONFIG.serviceId !== "YOUR_SERVICE_ID" &&
    EMAILJS_CONFIG.templateId !== "YOUR_TEMPLATE_ID" &&
    EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY"
  );
}
