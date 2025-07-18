import React from 'react';
import { Helmet } from 'react-helmet';
import BackToTop from './BackToTop';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Terms of Service | Laundry Pro</title>
        <meta name="description" content="Terms and conditions for using Laundry Pro" />
        <meta name="keywords" content="laundry terms, service agreement, laundry conditions" />
      </Helmet>
      <BackToTop/>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service Agreement</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              Welcome to <span className="font-medium">Laundry Pro</span> ("Service", "We", "Us", or "Our"). By accessing or using our website, mobile application, or services (collectively, the "Services"), you ("User", "You", or "Your") agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and Laundry Pro. If you do not agree with any part of these Terms, you must not use our Services.
            </p>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. Continued use of our Services after such modifications constitutes your acceptance of the new Terms. It is your responsibility to review these Terms periodically for updates.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Services Provided</h2>
            <p className="text-gray-700 mb-3">
              Laundry Pro provides professional laundry and garment care services through our platform. Our comprehensive services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-medium">Washing & Drying:</span> Professional cleaning using industry-standard detergents and equipment suitable for various fabric types</li>
              <li><span className="font-medium">Folding & Packaging:</span> Neat folding and hygienic packaging of your garments</li>
              <li><span className="font-medium">Dry Cleaning:</span> Specialized cleaning for delicate fabrics and formal wear</li>
              <li><span className="font-medium">Stain Treatment:</span> Specialized treatment for stubborn stains (additional charges may apply)</li>
              <li><span className="font-medium">Pickup & Delivery:</span> Convenient scheduled pickup and delivery services within our service areas</li>
              <li><span className="font-medium">Special Fabric Care:</span> Custom care for delicate items including wool, silk, and other specialty fabrics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-3">
              As a user of Laundry Pro services, you agree to the following responsibilities:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><span className="font-medium">Accurate Information:</span> Provide complete and accurate information about your laundry items, including special care instructions and any existing damage</li>
              <li><span className="font-medium">Proper Preparation:</span> Ensure all items are properly prepared for laundry service (empty pockets, remove non-laundry items, etc.)</li>
              <li><span className="font-medium">Payment Obligations:</span> Pay for all services rendered in accordance with our pricing structure and payment terms</li>
              <li><span className="font-medium">Prohibited Items:</span> Do not include any prohibited items (see Section 7) in your laundry bags</li>
              <li><span className="font-medium">Account Security:</span> Maintain the confidentiality of your account credentials and immediately notify us of any unauthorized use</li>
              <li><span className="font-medium">Legal Compliance:</span> Use our Services only for lawful purposes and in compliance with all applicable laws and regulations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Pricing & Payments</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Service Fees:</span> All prices for our services are listed on our website and mobile application. We reserve the right to modify our prices at any time without prior notice. Price changes will not affect orders already placed and confirmed.
              </p>
              <p>
                <span className="font-medium">Accepted Payment Methods:</span> We accept various payment methods including major credit/debit cards (Visa, MasterCard, American Express), PayPal, and in some locations, Cash on Delivery (COD). All payments must be made in the local currency as specified during checkout.
              </p>
              <p>
                <span className="font-medium">Additional Charges:</span> Additional fees may apply for special requests, expedited services, or overweight bags. These will be clearly communicated before service confirmation.
              </p>
              <p>
                <span className="font-medium">Taxes:</span> All applicable taxes will be added to your invoice as required by law.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Cancellation & Refunds</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Order Cancellation:</span> You may cancel your order free of charge if done at least 24 hours before your scheduled pickup time. Cancellations within 24 hours may incur a cancellation fee of up to 50% of the service cost.
              </p>
              <p>
                <span className="font-medium">Service Modifications:</span> Changes to your order (additions or reductions) must be made at least 12 hours before pickup. We will do our best to accommodate last-minute changes but cannot guarantee availability.
              </p>
              <p>
                <span className="font-medium">Refund Policy:</span> Refunds are issued for service errors or dissatisfaction within 7 business days of service completion. To request a refund, please contact our customer service with details of the issue. Refund amounts will be determined based on the nature of the service issue.
              </p>
              <p>
                <span className="font-medium">Quality Guarantee:</span> If you're not satisfied with the quality of our service, we will either re-clean the items at no charge or provide a full refund, at our discretion.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Prohibited Items</h2>
            <p className="text-gray-700 mb-3">
              For safety and legal reasons, the following items are strictly prohibited from our laundry services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Items containing hazardous materials or biological waste</li>
              <li>Money, jewelry, or other valuables left in pockets</li>
              <li>Firearms, weapons, or illegal items of any kind</li>
              <li>Items that are extremely soiled with hazardous substances</li>
              <li>Items that cannot withstand normal washing and drying temperatures</li>
              <li>Items with sentimental or irreplaceable value</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Laundry Pro is not responsible for any damage to or loss of prohibited items. If such items are discovered in your laundry, we will attempt to contact you and may refuse service for those items.
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Liability & Limitations</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">General Liability:</span> While we take utmost care with all garments, Laundry Pro's liability for any lost, damaged, or stolen items is limited to five times (5x) the service cost for that particular order. We are not liable for damage resulting from normal wear and tear, pre-existing conditions, or improper care labels.
              </p>
              <p>
                <span className="font-medium">Claims Process:</span> All claims must be reported within 24 hours of delivery. Please inspect your items immediately upon receipt. To file a claim, contact customer service with photos of the damaged item and your original receipt.
              </p>
              <p>
                <span className="font-medium">Force Majeure:</span> We are not liable for delays or failures in performance resulting from acts beyond our reasonable control, including but not limited to natural disasters, acts of government, labor disputes, or technical failures.
              </p>
              <p>
                <span className="font-medium">Insurance:</span> For high-value items, we recommend you obtain your own insurance coverage as our liability is limited as described above.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Privacy Policy</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Our collection and use of personal information in connection with our Services is described in our separate Privacy Policy, which is incorporated by reference into these Terms. By using our Services, you consent to our collection and use of personal data as outlined in the Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700">
              All content included on our platform, including text, graphics, logos, images, and software, is the property of Laundry Pro or its content suppliers and protected by intellectual property laws. You may not modify, reproduce, distribute, or commercially exploit any content without our express written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. Governing Law & Dispute Resolution</h2>
            <p className="text-gray-700 mb-3">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Laundry Pro is headquartered, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700">
              Any disputes arising from these Terms or your use of our Services shall first be attempted to be resolved through good-faith negotiations. If such negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in our headquarters city, and the decision shall be final and binding.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-2">
              For any questions or concerns regarding these Terms of Service, please contact our legal department:
            </p>
            <p className="mt-2 text-blue-600 hover:underline">
              <a href="mailto:legal@laundrypro.com">legal@laundrypro.com</a>
            </p>
            <p className="text-gray-700 mt-2">
              Mailing Address:<br />
              Laundry Pro Legal Department<br />
              123 Fabric Care Avenue<br />
              Suite 200<br />
              Clean City, CA 90210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;