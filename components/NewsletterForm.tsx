"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Loader2, CheckCircle, Sparkles } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    setEmail("");
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-[#d5b34b]/10 border border-[#d5b34b]/20 px-4 py-5 text-center">
        <CheckCircle className="h-6 w-6 text-[#d5b34b]" />
        <p className="text-sm font-bold text-gray-900">You&apos;re subscribed!</p>
        <p className="text-xs text-gray-500">Welcome to the VisionHub community.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Sparkles className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#d5b34b] focus:bg-white focus:ring-2 focus:ring-[#d5b34b]/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#d5b34b] px-5 text-sm font-bold text-[#111313] shadow-sm transition-all duration-200 hover:bg-[#ead477] hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
