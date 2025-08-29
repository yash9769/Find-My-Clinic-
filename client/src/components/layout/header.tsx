import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MapPin, Stethoscope, User, LogOut, QrCode, AlertTriangle, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isAuthenticated?: boolean;
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  onLogout?: () => void;
  onShowQRCode?: () => void;
  onEmergencyAccess?: () => void;
  onAmbulanceRequest?: () => void;
}

export default function Header({ isAuthenticated = false, userInfo, onLogout, onShowQRCode, onEmergencyAccess, onAmbulanceRequest }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "For Patients", href: "/patients" },
    { name: "For Clinics", href: "/clinics" },
    { name: "About", href: "/about" },
  ];

  const getUserInitials = () => {
    if (userInfo) {
      return `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`;
    }
    return "U";
  };

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
              
              {isAuthenticated && userInfo ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{userInfo.firstName} {userInfo.lastName}</p>
                      <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onShowQRCode}>
                      <QrCode className="mr-2 h-4 w-4" />
                      <span>My QR Code</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onEmergencyAccess} className="text-red-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Emergency Services</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onAmbulanceRequest} className="text-blue-600">
                      <Ambulance className="mr-2 h-4 w-4" />
                      <span>Request Ambulance</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/patients">
                  <Button className="bg-accent text-white hover:bg-orange-600" data-testid="button-find-clinic">
                    Find a Clinic
                  </Button>
                </Link>
              )}
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
              
              {isAuthenticated && userInfo ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{userInfo.firstName} {userInfo.lastName}</p>
                      <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { onShowQRCode?.(); setIsMenuOpen(false); }}>
                    <QrCode className="mr-2 h-4 w-4" />
                    My QR Code
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => { onEmergencyAccess?.(); setIsMenuOpen(false); }}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Emergency Services
                  </Button>
                  <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => { onAmbulanceRequest?.(); setIsMenuOpen(false); }}>
                    <Ambulance className="mr-2 h-4 w-4" />
                    Request Ambulance
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { onLogout?.(); setIsMenuOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <Link href="/patients" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-accent text-white hover:bg-orange-600 mt-4" data-testid="mobile-button-find-clinic">
                    Find a Clinic
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
