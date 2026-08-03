import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/app/components/SiteShell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for CodeLovers services and website usage.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions | CodeLovers",
    description: "Terms and Conditions for CodeLovers services and website usage.",
    url: "https://wearecodelovers.com/terms",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodeLovers" }],
  },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <span>←</span> Back to home
          </Link>

          <h1 className="text-4xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: February 2025</p>

          <div className="mt-12 space-y-8 text-sm leading-relaxed text-slate-300">
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">1. Services</h2>
              <p>
                CodeLovers provides software development, consulting, and engineering services as
                described in individual project agreements. All engagements are governed by specific
                statements of work agreed upon by both parties.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">2. Intellectual Property</h2>
              <p>
                Upon full payment, clients receive ownership of all deliverables produced during the
                engagement, unless otherwise specified in the project agreement. CodeLovers retains
                the right to showcase the work in our portfolio unless a non-disclosure agreement is
                in place.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">3. Confidentiality</h2>
              <p>
                Both parties agree to keep all shared information confidential during and after the
                engagement. This includes project details, business strategies, technical
                architectures, and any proprietary information.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">4. Payment Terms</h2>
              <p>
                Payment terms are defined in individual project agreements. Unless otherwise
                specified, invoices are due within 30 days of receipt. Late payments may incur
                additional charges as outlined in the agreement.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">5. Limitation of Liability</h2>
              <p>
                CodeLovers shall not be liable for indirect, incidental, or consequential damages
                arising from the use of our services. Our total liability is limited to the amount
                paid for the specific service giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">6. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Kingdom of Morocco. Any disputes shall
                be resolved through the courts of Rabat, Morocco.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">7. Contact</h2>
              <p>
                For questions about these terms, contact us at{" "}
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
      </div>
    </SiteShell>
  );
}
