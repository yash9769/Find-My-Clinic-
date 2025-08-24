import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MapPin, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "For Patients", href: "/patients" },
    { name: "For Clinics", href: "/clinics" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity" data-testid="logo-link">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
              <MapPin className="text-white h-5 w-5" />
              <Stethoscope className="text-white h-3 w-3 absolute -top-0.5 -right-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Find My Clinic</h1>
              <p className="text-xs text-muted-foreground">In need of care? We'll get you there.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-foreground hover:text-primary transition-colors",
                  location === item.href && "text-primary font-medium"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Link href="/patients">
                <Button className="bg-accent text-white hover:bg-orange-600" data-testid="button-find-clinic">
                  Find a Clinic
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="pt-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-foreground hover:text-primary transition-colors py-2",
                    location === item.href && "text-primary font-medium"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-center mt-4">
                <ThemeToggle />
              </div>
              <Link href="/patients" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-accent text-white hover:bg-orange-600 mt-4" data-testid="mobile-button-find-clinic">
                  Find a Clinic
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
