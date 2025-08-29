import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Privacy Policy
        </CardTitle>
        <CardDescription>
          Last updated: {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Information We Collect</h3>
              <p className="text-gray-700 mb-2">
                We collect information you provide directly to us, such as:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Personal information (name, email, phone number)</li>
                <li>Medical information (health conditions, medications, allergies)</li>
                <li>Emergency contact details</li>
                <li>Location data for clinic recommendations</li>
                <li>QR code usage and scan history</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. How We Use Your Information</h3>
              <p className="text-gray-700 mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Provide and improve our healthcare locator services</li>
                <li>Generate and manage your personal QR codes</li>
                <li>Connect you with nearby healthcare facilities</li>
                <li>Process emergency and ambulance requests</li>
                <li>Send important service notifications</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Medical Information Security</h3>
              <p className="text-gray-700">
                Your medical information is encrypted using industry-standard encryption protocols. We implement physical, electronic, and procedural safeguards to protect your personal health information in compliance with healthcare privacy regulations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Information Sharing</h3>
              <p className="text-gray-700 mb-2">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Healthcare providers when you use our QR check-in system</li>
                <li>Emergency services when you request emergency assistance</li>
                <li>Legal authorities when required by law</li>
                <li>Service providers who assist in operating our platform</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Location Data</h3>
              <p className="text-gray-700">
                We collect location data to help you find nearby clinics and for emergency services coordination. You can control location sharing through your device settings, but this may limit some features of our service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Data Retention</h3>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Medical information is retained according to healthcare industry standards and applicable regulations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. Your Rights</h3>
              <p className="text-gray-700 mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of certain communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">8. Cookies and Tracking</h3>
              <p className="text-gray-700">
                We use cookies and similar technologies to improve user experience, analyze usage patterns, and maintain your session. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">9. Third-Party Services</h3>
              <p className="text-gray-700">
                Our platform may integrate with third-party services for maps, emergency services, and healthcare providers. These services have their own privacy policies that govern their data practices.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">10. Children's Privacy</h3>
              <p className="text-gray-700">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">11. International Data Transfers</h3>
              <p className="text-gray-700">
                If you access our service from outside our primary jurisdiction, your information may be transferred to and processed in countries with different privacy laws. We ensure appropriate safeguards are in place.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">12. Changes to This Policy</h3>
              <p className="text-gray-700">
                We may update this privacy policy periodically. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">13. Contact Us</h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@findmyclinic.com or through our customer support channels.
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}