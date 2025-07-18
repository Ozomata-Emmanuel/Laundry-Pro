import React from 'react';
import { Helmet } from 'react-helmet';
import BackToTop from './BackToTop';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy | Laundry Pro</title>
        <meta name="description" content="Learn how we protect your data when using Laundry Pro services" />
        <meta name="keywords" content="laundry privacy policy, data protection, personal information handling" />
      </Helmet>
      <BackToTop/>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Laundry Pro ("we", "us", or "our") is committed to protecting the privacy of our customers. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website, mobile application, and services (collectively, the "Services").
            </p>
            <p className="text-gray-700">
              By accessing or using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, you should not use our Services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-3">
              We collect several types of information from and about users of our Services, including:
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Personal Identification Information:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Full name and contact details (email address, phone number)</li>
              <li>Physical address for service delivery</li>
              <li>Payment information (credit card details are processed through secure payment gateways and not stored on our servers)</li>
              <li>Account credentials (username and encrypted password)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Service-Related Information:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Order history and preferences</li>
              <li>Pickup and delivery instructions</li>
              <li>Special garment care requirements</li>
              <li>Customer service communications</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Technical and Usage Data:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Cookies and tracking technologies data (see Section 5)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">
              We use the information we collect for various business purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-medium">Service Provision:</span> To process and fulfill your laundry orders, arrange pickup and delivery, and provide customer support</li>
              <li><span className="font-medium">Account Management:</span> To create and manage your account, verify your identity, and process payments</li>
              <li><span className="font-medium">Communication:</span> To send service-related notices, order confirmations, and respond to inquiries</li>
              <li><span className="font-medium">Improvement:</span> To analyze usage patterns and improve our Services, website functionality, and customer experience</li>
              <li><span className="font-medium">Marketing:</span> To send promotional offers and newsletters (only with your explicit consent, which you can withdraw at any time)</li>
              <li><span className="font-medium">Security:</span> To detect and prevent fraud, unauthorized activities, and security breaches</li>
              <li><span className="font-medium">Legal Compliance:</span> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-3">
              We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Service Providers:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Payment processors to complete transactions</li>
              <li>Delivery partners to fulfill pickup and delivery services</li>
              <li>IT service providers for website maintenance and data storage</li>
              <li>Customer support platforms to handle inquiries</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Legal Requirements:</h3>
            <p className="text-gray-700 mb-2">
              We may disclose your information if required by law or in response to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Court orders or legal processes</li>
              <li>Government requests or investigations</li>
              <li>Protection of our rights, property, or safety</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">Business Transfers:</h3>
            <p className="text-gray-700">
              In the event of a merger, acquisition, or sale of assets, customer information may be transferred as part of the transaction, with appropriate privacy protections.
            </p>

            <p className="text-gray-700 mt-4 font-medium">
              We never sell your personal information to third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-3">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Authenticate users and maintain session information</li>
              <li>Remember user preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Deliver targeted advertisements (with consent)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              You can control cookies through your browser settings. However, disabling cookies may affect certain features of our Services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Data Security Measures</h2>
            <p className="text-gray-700 mb-3">
              We implement robust security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-medium">Encryption:</span> SSL/TLS encryption for all data transmissions</li>
              <li><span className="font-medium">Access Controls:</span> Strict access limitations to personal data</li>
              <li><span className="font-medium">Secure Storage:</span> Data stored on protected servers with firewalls</li>
              <li><span className="font-medium">Regular Audits:</span> Security assessments and vulnerability testing</li>
              <li><span className="font-medium">Employee Training:</span> Privacy and security awareness programs</li>
            </ul>
            <p className="text-gray-700 mt-3">
              While we implement these security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but we continuously work to maintain the highest standards of data protection.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-3">
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-medium">Access:</span> Request a copy of your personal data we hold</li>
              <li><span className="font-medium">Correction:</span> Request correction of inaccurate data</li>
              <li><span className="font-medium">Deletion:</span> Request deletion of your personal data under certain conditions</li>
              <li><span className="font-medium">Restriction:</span> Request limitation of processing your data</li>
              <li><span className="font-medium">Portability:</span> Request transfer of your data to another service provider</li>
              <li><span className="font-medium">Objection:</span> Object to certain processing activities</li>
              <li><span className="font-medium">Withdraw Consent:</span> Withdraw previously given consent for processing</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, please contact us using the information in Section 9. We may need to verify your identity before processing certain requests.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 mb-3">
              We retain personal information only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Active customer accounts: Retained while account remains active plus 3 years</li>
              <li>Transaction records: 7 years for tax and accounting purposes</li>
              <li>Customer service communications: 5 years from last interaction</li>
              <li>Marketing data: Until consent is withdrawn or 3 years from last engagement</li>
            </ul>
            <p className="text-gray-700 mt-3">
              After retention periods expire, we securely delete or anonymize your data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              Our Services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If we become aware that we have inadvertently received personal information from a child under 16, we will delete such information from our records.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 mb-3">
              We may update this Privacy Policy periodically. We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Posting the new policy on our website with an updated date</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Your continued use of our Services after such changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Email: <a href="mailto:privacy@laundrypro.com" className="text-blue-600 hover:underline">privacy@laundrypro.com</a></li>
              <li>Phone: +1 (234) 567-7890 (Mon-Fri, 9AM-5PM EST)</li>
              <li>Mailing Address:
                <br />
                Laundry Pro Privacy Office
                <br />
                123 Data Protection Lane
                <br />
                Suite 300
                <br />
                Privacy City, PC 90210
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              For complaints that cannot be resolved directly with us, you may contact your local data protection authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;