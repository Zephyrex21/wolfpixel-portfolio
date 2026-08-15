import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { fadeUp } from "../../utils/animations";

type Status = "idle" | "sending" | "success" | "error" | "not-configured";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit =
    name.trim().length > 1 &&
    isValidEmail &&
    message.trim().length >= 8 &&
    status !== "sending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.status === 503) {
        setStatus("not-configured");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center gap-3 py-10 text-background"
      >
        <CheckCircle2 size={32} />
        <p className="font-semibold text-lg">Message sent.</p>
        <p className="text-sm text-background/70 max-w-xs">
          Thanks for reaching out — I'll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs underline text-background/70 hover:text-background transition-colors cursor-pointer"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={fadeUp}
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="sr-only">
            Your name
          </label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="w-full rounded-xl border border-background/25 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/60 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="sr-only">
            Your email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoComplete="email"
            className="w-full rounded-xl border border-background/25 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/60 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="sr-only">
          Message
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to talk about?"
          rows={4}
          className="w-full resize-none rounded-xl border border-background/25 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/60 transition-colors"
        />
      </div>

      {(status === "error" || status === "not-configured") && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 text-xs text-background/70"
        >
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            {status === "not-configured"
              ? "The message form isn't wired up yet — email me directly instead using the card above."
              : "Something went wrong sending that — try again, or email me directly using the card above."}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        aria-busy={status === "sending"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "sending" ? "Sending..." : "Send message"}
        <Send size={15} />
      </button>
    </motion.form>
  );
};

export default ContactForm;
