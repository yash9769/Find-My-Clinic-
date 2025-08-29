import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import Patients from "@/pages/patients";
import Clinics from "@/pages/clinics";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SplashScreen from "@/components/sections/splash-screen";
import AuthSelection from "@/components/auth/auth-selection";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import EmergencyScreen from "@/components/auth/emergency-screen";
import PatientInfoForm from "@/components/patient/patient-info-form";
import PatientQRCode from "@/components/patient/patient-qr-code";
import AmbulanceBooking from "@/components/emergency/ambulance-booking";
import EmergencyDashboard from "@/components/dashboard/emergency-dashboard";

type AppState = 'splash' | 'auth-selection' | 'login' | 'signup' | 'emergency' | 'patient-info' | 'patient-qr' | 'ambulance-booking' | 'main-app';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  patientId?: string;
  [key: string]: any; // For additional patient info fields
}

interface RouterProps {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  onEmergencyAccess: () => void;
  onAmbulanceRequest: () => void;
}

function Router({ isAuthenticated, userInfo, onEmergencyAccess, onAmbulanceRequest }: RouterProps) {
  return (
    <Switch>
      <Route path="/" component={() => (
        <div>
          <Home />
          {isAuthenticated && (
            <div className="container mx-auto px-4 py-8">
              <EmergencyDashboard 
                onEmergencyAccess={onEmergencyAccess}
                onAmbulanceRequest={onAmbulanceRequest}
                userInfo={userInfo}
              />
            </div>
          )}
        </div>
      )} />
      <Route path="/patients" component={() => <Patients isAuthenticated={isAuthenticated} userInfo={userInfo} />} />
      <Route path="/clinics" component={Clinics} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('find-my-clinic-user');
    const savedAuth = localStorage.getItem('find-my-clinic-auth');
    
    if (savedUser && savedAuth === 'true') {
      setUserInfo(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setAppState('main-app');
    }
  }, []);

  const handleSplashComplete = () => {
    setAppState('auth-selection');
  };

  const handleAuthSelection = (type: 'login' | 'signup' | 'emergency') => {
    setAppState(type);
  };

  const handleLogin = (data: { email: string; password: string }) => {
    // In a real app, this would validate credentials with the backend
    console.log('Login attempt:', data);
    // For demo purposes, we'll simulate a successful login
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: data.email,
      phone: '+1 (555) 123-4567'
    };
    setUserInfo(mockUser);
    localStorage.setItem('find-my-clinic-user', JSON.stringify(mockUser));
    localStorage.setItem('find-my-clinic-auth', 'true');
    setIsAuthenticated(true);
    setAppState('main-app');
  };

  const handleSignup = (data: any) => {
    console.log('Signup data:', data);
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone
    };
    setUserInfo(newUser);
    setAppState('patient-info');
  };

  const handlePatientInfoComplete = (patientData: any) => {
    console.log('Patient info completed:', patientData);
    // Generate unique patient ID
    const patientId = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save complete profile to localStorage and backend
    const completeProfile = { ...userInfo, ...patientData, patientId };
    setUserInfo(completeProfile);
    localStorage.setItem('find-my-clinic-user', JSON.stringify(completeProfile));
    localStorage.setItem('find-my-clinic-auth', 'true');
    setIsAuthenticated(true);
    setAppState('patient-qr'); // Show QR code after profile completion
  };

  const handleShowQRCode = () => {
    setAppState('patient-qr');
  };

  const handleProfile = () => {
    // For now, show the patient info form to edit profile
    if (userInfo) {
      setAppState('patient-info');
    }
  };

  const handleQRCodeBack = () => {
    setAppState('main-app');
  };

  const handleRequestAmbulance = () => {
    setAppState('ambulance-booking');
  };

  const handleAmbulanceBookingComplete = () => {
    console.log('Ambulance booking completed');
    setAppState('auth-selection');
  };

  const handleBack = () => {
    setAppState('auth-selection');
  };

  const handleLogout = () => {
    localStorage.removeItem('find-my-clinic-user');
    localStorage.removeItem('find-my-clinic-auth');
    setUserInfo(null);
    setIsAuthenticated(false);
    setAppState('splash');
  };

  const handleEmergencyAccess = () => {
    setAppState('emergency');
  };

  const handleAmbulanceFromApp = () => {
    setAppState('ambulance-booking');
  };

  const handleBackToMainApp = () => {
    setAppState('main-app');
  };

  // Render based on current app state
  if (appState === 'splash') {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <SplashScreen onComplete={handleSplashComplete} />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'auth-selection') {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <AuthSelection onSelectAuth={handleAuthSelection} />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'login') {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <LoginForm 
            onBack={handleBack}
            onLogin={handleLogin}
            onSwitchToSignup={() => setAppState('signup')}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'signup') {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <SignupForm 
            onBack={handleBack}
            onSignup={handleSignup}
            onSwitchToLogin={() => setAppState('login')}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'emergency') {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <EmergencyScreen 
            onBack={isAuthenticated ? handleBackToMainApp : handleBack}
            onRequestAmbulance={handleRequestAmbulance}
            onShowAmbulanceBooking={() => setAppState('ambulance-booking')}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'ambulance-booking') {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <AmbulanceBooking 
            onBack={isAuthenticated ? handleBackToMainApp : () => setAppState('emergency')}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'patient-info' && userInfo) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <PatientInfoForm 
            userInfo={userInfo}
            onComplete={handlePatientInfoComplete}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  if (appState === 'patient-qr' && userInfo) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
          <PatientQRCode 
            patientInfo={{
              ...userInfo,
              patientId: userInfo.patientId || `patient_${Date.now()}`
            }}
            onBack={handleQRCodeBack}
          />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Main app with authentication
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="find-my-clinic-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header 
              isAuthenticated={isAuthenticated} 
              userInfo={userInfo} 
              onLogout={handleLogout}
              onProfile={handleProfile}
              onShowQRCode={handleShowQRCode}
              onEmergencyAccess={handleEmergencyAccess}
              onAmbulanceRequest={handleAmbulanceFromApp}
            />
            <main>
              <Router 
                isAuthenticated={isAuthenticated}
                userInfo={userInfo}
                onEmergencyAccess={handleEmergencyAccess}
                onAmbulanceRequest={handleAmbulanceFromApp}
              />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
