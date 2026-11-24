export const metadata = {
  title: "Terms of Service — Umunsi.com",
  description: "Terms of service for using Umunsi.com.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: November 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-black text-lg mb-2">1. The service</h2>
            <p>Umunsi.com provides news and media content. By using the site you agree to these terms. Content is provided for personal, non-commercial reading only.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">2. Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Paid subscriptions remove advertising on Umunsi.com for the paid period (1 month, 3 months, or lifetime).</li>
              <li>Payments are made via MTN Mobile Money and are non-refundable once a subscription period has started, except where required by law.</li>
              <li>Subscriptions are personal and may not be shared or resold.</li>
              <li>We may change subscription pricing for future purchases; already-paid periods are honored in full.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">3. Accounts</h2>
            <p>You are responsible for keeping your account credentials confidential. We may suspend accounts used fraudulently or in violation of these terms.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">4. Content &amp; copyright</h2>
            <p>All articles, images, and design on Umunsi.com are our property or used under license. You may not republish our content without written permission, beyond normal sharing with attribution and links.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">5. Acceptable use</h2>
            <p>You agree not to scrape, crawl, or bulk-download the site, interfere with its operation, or use it for unlawful purposes.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">6. Liability</h2>
            <p>We provide the site &quot;as is.&quot; While we work hard to publish accurate news, we are not liable for decisions made based on our content or for temporary service interruptions.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">7. Contact</h2>
            <p>Questions: <a href="mailto:info@umunsi.com" className="text-[#b8940a] font-bold">info@umunsi.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
