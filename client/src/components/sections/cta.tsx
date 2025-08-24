import { User, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTA() {
  return (
    <section className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Healthcare Visits?</h3>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of patients and hundreds of clinics already using Find My Clinic 
            to make healthcare more accessible and efficient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/patients">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                data-testid="button-patient-signup-cta"
              >
                <User className="h-5 w-5 mr-2" />
                Get Started as Patient
              </Button>
            </Link>
            <Link href="/clinics">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-accent bg-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold"
                data-testid="button-clinic-signup-cta"
              >
                <Hospital className="h-5 w-5 mr-2" />
                Register Your Clinic
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm opacity-75">
            <p>Have questions? <a href="mailto:contact@findmyclinic.com" className="underline hover:no-underline">Contact our team</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
