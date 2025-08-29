import { useState } from "react";
import { motion } from "framer-motion";
import { User, UserPlus, AlertTriangle, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthSelectionProps {
  onSelectAuth: (type: 'login' | 'signup' | 'emergency') => void;
  onBack?: () => void;
}

export default function AuthSelection({ onSelectAuth, onBack }: AuthSelectionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const authOptions = [
    {
      id: 'login',
      title: 'Login',
      description: 'Access your existing account',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'signup',
      title: 'Sign Up',
      description: 'Create a new patient account',
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'emergency',
      title: 'Emergency',
      description: 'Immediate medical assistance',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute top-8 left-8 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">
              Find My <span className="text-primary">Clinic</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Choose how you'd like to proceed
          </p>
        </motion.div>

        {/* Auth Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {authOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                    selectedOption === option.id 
                      ? 'border-primary shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id);
                    setTimeout(() => onSelectAuth(option.id as any), 200);
                  }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${option.color} ${option.hoverColor} flex items-center justify-center transition-all duration-300 transform hover:scale-110`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className={`w-full bg-gradient-to-r ${option.color} ${option.hoverColor} text-white border-0 transition-all duration-300`}
                      size="lg"
                    >
                      {option.id === 'emergency' ? 'Get Help Now' : `Continue with ${option.title}`}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}