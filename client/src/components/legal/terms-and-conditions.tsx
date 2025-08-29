import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Terms and Conditions
        </CardTitle>
        <CardDescription>
          Last updated: {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing and using Find My Clinic ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. Medical Disclaimer</h3>
              <p className="text-gray-700">
                Find My Clinic is a healthcare facility locator service and does not provide medical advice, diagnosis, or treatment. The information provided through our platform is for informational purposes only and should not be considered as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Emergency Services</h3>
              <p className="text-gray-700">
                For life-threatening emergencies, always call 112 immediately. Find My Clinic's emergency and ambulance request features are for non-life-threatening situations only. We are not responsible for emergency response times or the availability of emergency services.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. User Responsibilities</h3>
              <p className="text-gray-700">
                Users are responsible for providing accurate and up-to-date information when using our services. You must not misuse our platform for fraudulent activities or provide false medical information.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Privacy and Data Protection</h3>
              <p className="text-gray-700">
                Your privacy is important to us. We collect and process personal and medical information in accordance with applicable privacy laws. Medical information is encrypted and stored securely. We do not share your personal information with third parties without your consent, except as required by law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Platform Availability</h3>
              <p className="text-gray-700">
                While we strive to provide 24/7 availability, we do not guarantee uninterrupted access to our services. We may perform maintenance or updates that temporarily affect service availability.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. QR Code System</h3>
              <p className="text-gray-700">
                Our QR code system is designed to streamline clinic check-ins. You are responsible for keeping your QR code secure and not sharing it with unauthorized persons. QR codes may expire and need to be regenerated periodically.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">8. Clinic Information Accuracy</h3>
              <p className="text-gray-700">
                While we strive to provide accurate and up-to-date clinic information, including wait times and availability, we cannot guarantee the accuracy of this information. Actual wait times may vary, and clinic availability is subject to change.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">9. Limitation of Liability</h3>
              <p className="text-gray-700">
                Find My Clinic shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to medical treatment decisions based on information obtained through our platform.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">10. User Account Security</h3>
              <p className="text-gray-700">
                You are responsible for maintaining the security of your account credentials. Notify us immediately if you suspect unauthorized access to your account. We are not responsible for losses due to compromised account security.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">11. Service Modifications</h3>
              <p className="text-gray-700">
                We reserve the right to modify, suspend, or discontinue any part of our service at any time with or without notice. We may also update these terms and conditions periodically.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">12. Intellectual Property</h3>
              <p className="text-gray-700">
                All content, features, and functionality of Find My Clinic are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">13. Governing Law</h3>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with applicable healthcare and privacy laws. Any disputes shall be resolved through binding arbitration.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">14. Contact Information</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please contact us at legal@findmyclinic.com or through our customer support channels.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">15. Acceptance</h3>
              <p className="text-gray-700">
                By using Find My Clinic, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}