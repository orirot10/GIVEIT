import React, { useEffect } from 'react';
import '../styles/pages/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'GiveIt Privacy Policy';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="privacy-policy" dir="ltr">
      <header className="privacy-policy__header">
        <div className="privacy-policy__container">
          <h1>GiveIt Privacy Policy</h1>
          <p>Effective Date: August 19, 2024</p>
        </div>
      </header>

      <main className="privacy-policy__main privacy-policy__container">
        <section className="privacy-policy__section">
          <h2>1. Overview</h2>
          <p>
            GiveIt (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a marketplace application that connects
            people who want to rent items or services. This Privacy Policy describes how we
            collect, use, disclose, and protect personal data when you use the GiveIt mobile
            application, website, and related services (collectively, the &quot;Services&quot;).
          </p>
          <p>
            By using the Services, you agree to the collection and use of information in
            accordance with this Privacy Policy. If you do not agree, please discontinue use of
            the Services.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>2. Information We Collect</h2>
          <p>We collect the following categories of information to provide and improve the Services:</p>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, phone number, profile
              photo, preferred language, and password or authentication credentials when you
              create an account.
            </li>
            <li>
              <strong>Content You Provide:</strong> Listings, photos, descriptions, pricing,
              rental preferences, messages, reviews, and any optional information you share with
              other users or with GiveIt support.
            </li>
            <li>
              <strong>Transaction and Payment Data:</strong> Rental history, order details,
              billing address, payment card token (handled by secure third-party payment
              processors), payout details, and tax information when required by law.
            </li>
            <li>
              <strong>Usage Data:</strong> Interactions with the app, viewed listings, search
              queries, app settings, and diagnostic logs that help us troubleshoot issues and
              improve performance.
            </li>
            <li>
              <strong>Device and Technical Data:</strong> Device model, operating system, unique
              device identifiers, network information, crash reports, and app version.
            </li>
            <li>
              <strong>Location Data:</strong> Approximate or precise location (with your consent)
              to show nearby listings, map interactions, pickup/drop-off locations, and fraud
              prevention signals.
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>3. How We Use Information</h2>
          <p>We process personal data for the following purposes:</p>
          <ul>
            <li>Creating and managing your GiveIt account.</li>
            <li>Facilitating rental listings, bookings, payments, and payouts.</li>
            <li>Providing customer support and responding to inquiries.</li>
            <li>Personalizing content, search results, and recommendations.</li>
            <li>Monitoring usage, preventing fraud, and maintaining platform safety.</li>
            <li>Sending transactional communications and service-related updates.</li>
            <li>Complying with legal obligations, resolving disputes, and enforcing agreements.</li>
            <li>Developing new features and performing analytics to improve the Services.</li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>4. Legal Bases for Processing</h2>
          <p>We rely on the following legal bases under applicable data protection laws:</p>
          <ul>
            <li>
              <strong>Performance of a Contract:</strong> To deliver the Services you request.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> To enhance safety, improve functionality, and
              protect our rights.
            </li>
            <li>
              <strong>Consent:</strong> For optional features such as marketing emails or
              location sharing, which you may withdraw at any time.
            </li>
            <li>
              <strong>Legal Obligation:</strong> To comply with accounting, taxation, anti-money
              laundering, and other regulatory requirements.
            </li>
          </ul>
        </section>

        <section className="privacy-policy__section">
          <h2>5. How We Share Information</h2>
          <p>We may disclose personal data in the following circumstances:</p>
          <ul>
            <li>
              <strong>With Other Users:</strong> To enable transactions, we share relevant listing
              and profile information, ratings, and messages.
            </li>
            <li>
              <strong>Service Providers:</strong> Trusted partners who assist with payment
              processing, identity verification, hosting, analytics, cloud storage,
              communications, and customer support.
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition,
              financing, or sale of assets, subject to confidentiality safeguards.
            </li>
            <li>
              <strong>Legal Compliance:</strong> When required by law, regulation, court order, or
              governmental request, or to protect the rights, safety, and property of GiveIt, our
              users, or others.
            </li>
            <li>
              <strong>With Your Consent:</strong> When you direct us to share information or
              otherwise provide permission.
            </li>
          </ul>
          <p>We do not sell personal data.</p>
        </section>

        <section className="privacy-policy__section">
          <h2>6. International Data Transfers</h2>
          <p>
            GiveIt operates globally. Your information may be processed and stored in countries
            other than the one where you reside. When we transfer data internationally, we use
            recognized safeguards such as standard contractual clauses, data processing
            agreements, and robust security controls.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>7. Data Retention</h2>
          <p>
            We retain personal data for as long as necessary to fulfill the purposes described in
            this Privacy Policy, including providing the Services, complying with legal
            obligations, resolving disputes, and enforcing our agreements. When data is no longer
            needed, we will delete or anonymize it.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>8. Your Rights and Choices</h2>
          <p>Depending on your location, you may have rights including to:</p>
          <ul>
            <li>Access, update, or delete certain personal data in your account settings.</li>
            <li>Object to or restrict our processing of your personal data.</li>
            <li>Withdraw consent at any time where processing relies on consent.</li>
            <li>
              Opt out of marketing communications by using the unsubscribe link in emails or
              changing notification preferences in the app.
            </li>
            <li>Request a copy of your data or portability where required by law.</li>
          </ul>
          <p>
            To exercise these rights, contact us using the details in the <strong>Contact Us</strong>
            section. We may require verification of your identity before fulfilling your request.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            GiveIt is not directed to children under 13 years of age (or the minimum age required
            by local law). We do not knowingly collect personal data from children. If we learn
            that personal data has been collected from a child without appropriate consent, we
            will delete it promptly. Parents or guardians who believe their child has provided us
            with personal data should contact us.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>10. Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards designed to protect
            personal data against unauthorized access, disclosure, alteration, and destruction.
            These measures include encryption in transit, secure development practices, access
            controls, monitoring, and regular security reviews. However, no method of transmission
            or storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>11. Third-Party Services and Links</h2>
          <p>
            The Services may contain links to third-party websites or integrations with external
            services. We are not responsible for the privacy practices of those third parties. We
            encourage you to review the privacy policies of any external services you use in
            connection with GiveIt.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make material changes, we
            will notify you through the app or by other appropriate means. The latest version will
            always be available at this page, and the effective date at the top will indicate when
            it was last revised.
          </p>
        </section>

        <section className="privacy-policy__section">
          <h2>13. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices,
            please contact GiveIt&apos;s privacy team at:
          </p>
          <p>
            Email: <a href="mailto:privacy@giveit.app">privacy@giveit.app</a>
            <br />
            Mailing Address: GiveIt Privacy Team, 123 Innovation Way, Tel Aviv, Israel 6100001
          </p>
        </section>
      </main>

      <footer className="privacy-policy__footer">
        &copy; {currentYear} GiveIt. All rights reserved.
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
