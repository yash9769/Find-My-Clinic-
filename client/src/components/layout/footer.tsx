import { Link } from "wouter";
import { MapPin, Stethoscope, Mail, Phone, Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "For Patients", href: "/patients" },
    { name: "For Clinics", href: "/clinics" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center relative">
                  <MapPin className="text-white h-4 w-4" />
                  <Stethoscope className="text-white h-2.5 w-2.5 absolute -top-0.5 -right-0.5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Find My Clinic</h4>
                  <p className="text-sm text-gray-400">In need of care? We'll get you there.</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making healthcare visits predictable and stress-free through innovative 
                queue management technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-twitter">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-linkedin">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:contact@findmyclinic.com" className="hover:text-white transition-colors" data-testid="contact-email">
                    contact@findmyclinic.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span data-testid="contact-phone">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Find My Clinic. All rights reserved. Built with ❤️ for better healthcare.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
