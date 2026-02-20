import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for CodeLovers - how we handle your data and protect your privacy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="relative pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <span>←</span> Back to home
          </Link>

          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: February 2025</p>

          <div className="mt-12 space-y-8 text-sm leading-relaxed text-slate-300">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">1. Information We Collect</h2>
              <p>
                When you contact us through our website, book a working session, or communicate via
                email, we may collect your name, email address, phone number, company name, and
                project details. We also collect anonymous usage data through PostHog analytics to
                improve our website experience.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-slate-400">
                <li>Respond to your inquiries and project requests</li>
                <li>Schedule and manage working sessions</li>
                <li>Improve our website and services</li>
                <li>Send relevant communications about our services (only with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">3. Data Protection</h2>
              <p>
                We take reasonable measures to protect your personal information. We do not sell,
                trade, or rent your personal data to third parties. Analytics data is processed
                through PostHog (EU-hosted) in compliance with GDPR.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">4. Cookies</h2>
              <p>
                Our website uses essential cookies for functionality and analytics cookies (PostHog)
                to understand how visitors use our site. You can control cookie preferences through
                your browser settings.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. To exercise
                these rights, please contact us at{" "}
                <a
                  href="mailto:tech@wearecodelovers.com"
                  className="text-rose-400 transition hover:text-rose-300"
                >
                  tech@wearecodelovers.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">6. Contact</h2>
              <p>
                For any privacy-related questions, reach us at{" "}
                <a
                  href="mailto:tech@wearecodelovers.com"
                  className="text-rose-400 transition hover:text-rose-300"
                >
                  tech@wearecodelovers.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
