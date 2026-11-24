export const metadata = {
  title: "Privacy Policy — Umunsi.com",
  description: "Privacy policy for Umunsi.com readers and subscribers.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: November 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-black text-lg mb-2">1. Who we are</h2>
            <p>Umunsi.com is a news and media website operated from Rwanda. This policy explains what information we collect when you use our website and how we use it.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">2. Information we collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account information:</strong> if you create a subscriber account, we store your email address, name, and a securely hashed password. If you sign in with Google, we receive your name, email, and profile picture from Google.</li>
              <li><strong>Payment information:</strong> subscription payments are processed by MTN Mobile Money. We store your phone number and payment status — we never see your MoMo PIN.</li>
              <li><strong>Usage data:</strong> pages viewed, time on site, and anonymized analytics to understand how readers use the site.</li>
              <li><strong>Cookies &amp; local storage:</strong> used to remember your subscription status and preferences on your device.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">3. Advertising</h2>
            <p>We display advertising through Google AdSense and Adsterra on public pages. These partners may use cookies to serve relevant ads. Paid subscribers see an ad-free experience. You can learn about Google&apos;s ad cookies at google.com/policies/technologies/ads.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">4. How we use information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To provide and improve our news service</li>
              <li>To process and manage subscriptions and payments</li>
              <li>To communicate with you about your account when needed</li>
              <li>To measure site traffic and performance</li>
            </ul>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">5. Sharing</h2>
            <p>We do not sell your personal information. Payment data is shared only with MTN for processing. Analytics may be shared in aggregate form with our analytics providers (Google Analytics).</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">6. Data retention &amp; your rights</h2>
            <p>You may request deletion of your account and personal data at any time by emailing us. Subscription payment records are kept for accounting purposes.</p>
          </section>

          <section>
            <h2 className="font-black text-lg mb-2">7. Contact</h2>
            <p>Questions about this policy: <a href="mailto:info@umunsi.com" className="text-[#b8940a] font-bold">info@umunsi.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
