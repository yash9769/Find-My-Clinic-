import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock, AlertTriangle, Ambulance, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmergencyScreenProps {
  onBack: () => void;
  onRequestAmbulance: () => void;
  onShowAmbulanceBooking?: () => void;
}

export default function EmergencyScreen({ onBack, onRequestAmbulance, onShowAmbulanceBooking }: EmergencyScreenProps) {
  const [isCallingEmergency, setIsCallingEmergency] = useState(false);
  const [showLocationRequest, setShowLocationRequest] = useState(false);

  const handleEmergencyCall = () => {
    setIsCallingEmergency(true);
    // In a real app, this would initiate a call to emergency services
    setTimeout(() => {
      setIsCallingEmergency(false);
      // Show confirmation or redirect to call
      window.location.href = "tel:112";
    }, 2000);
  };

  const handleRequestLocation = () => {
    setShowLocationRequest(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location:", position.coords);
          setShowLocationRequest(false);
          // In a real app, this would send location to emergency services
        },
        (error) => {
          console.error("Error getting location:", error);
          setShowLocationRequest(false);
        }
      );
    }
  };

  const emergencyContacts = [
    { name: "Emergency Services", number: "112", description: "Police, Fire, Medical" },
    { name: "Poison Control", number: "1-800-222-1222", description: "24/7 Poison Help" },
    { name: "Crisis Hotline", number: "988", description: "Mental Health Crisis" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center justify-center gap-3 mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-900">
              Emergency <span className="text-red-600">Assistance</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Immediate help is available. Choose the assistance you need.
          </p>
        </motion.div>

        {showLocationRequest && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Requesting your location to help emergency services find you...
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Emergency Call */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center bg-red-50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-700">
                  Call Emergency Services
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Immediate response for life-threatening emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button
                  onClick={handleEmergencyCall}
                  disabled={isCallingEmergency}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                  size="lg"
                >
                  {isCallingEmergency ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Call 112 Now
                    </div>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Your location will be shared automatically
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambulance Request */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center bg-blue-50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center">
                  <Ambulance className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-700">
                  Request Ambulance
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Non-emergency medical transport to nearest facility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button
                  onClick={onShowAmbulanceBooking || onRequestAmbulance}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                  size="lg"
                >
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-5 h-5" />
                    Request Ambulance
                  </div>
                </Button>
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Estimated arrival: 8-12 minutes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-gray-900">
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                Quick access to important emergency numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `tel:${contact.number}`}
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.number}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={handleRequestLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Share Location
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Medical ID
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            In case of emergency, medical information will be shared with first responders
          </p>
        </motion.div>
      </div>
    </div>
  );
}