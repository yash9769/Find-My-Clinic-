import { motion } from "framer-motion";
import { AlertTriangle, Ambulance, Phone, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmergencyDashboardProps {
  onEmergencyAccess: () => void;
  onAmbulanceRequest: () => void;
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
}

export default function EmergencyDashboard({ onEmergencyAccess, onAmbulanceRequest, userInfo }: EmergencyDashboardProps) {
  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 p-6 rounded-2xl shadow-lg border border-red-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900">
              Emergency <span className="text-red-600">Services</span>
            </h2>
          </div>
          <p className="text-gray-600">
            Quick access to emergency assistance and medical transport
          </p>
        </div>

        {/* Emergency Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Emergency Services */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center bg-red-50 group-hover:bg-red-100 transition-colors">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-red-700">
                  Emergency Services
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Immediate response for critical situations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  onClick={onEmergencyAccess}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
                  size="lg"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Access Emergency Services
                </Button>
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Available</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambulance Request */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <Ambulance className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-blue-700">
                  Request Ambulance
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Non-emergency medical transport
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  onClick={onAmbulanceRequest}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
                  size="lg"
                >
                  <Ambulance className="w-5 h-5 mr-2" />
                  Request Ambulance
                </Button>
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>Average arrival: 8-12 min</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency Calls</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">112</p>
            <p className="text-xs text-gray-500">Direct emergency line</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Response Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">&lt;3min</p>
            <p className="text-xs text-gray-500">Average response</p>
          </div>
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="bg-white/50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Logged in as <span className="font-medium text-gray-900">{userInfo.firstName} {userInfo.lastName}</span>
            </p>
            <p className="text-xs text-gray-500 text-center">
              Your medical profile is ready for emergency services
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}