import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Shield } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Sky Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-cyan-100 to-blue-200"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-300 via-transparent to-cyan-200 opacity-60 animate-pulse" style={{animationDuration: '3s'}}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-100 to-sky-300 opacity-40 animate-bounce" style={{animationDuration: '5s'}}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-transparent to-sky-200 opacity-30 animate-ping" style={{animationDuration: '7s'}}></div>
      
      {/* Content Container */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Heart className="w-12 h-12 text-primary" />
            </motion.div>
            
            {/* Floating Icons */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-8"
            >
              <Activity className="w-6 h-6 text-secondary" />
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 -left-8"
            >
              <Shield className="w-6 h-6 text-success" />
            </motion.div>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find My <span className="text-primary">Clinic</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            In need of care? We'll get you there.
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-primary rounded-full"
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-gray-500 mt-4"
        >
          Connecting you to care...
        </motion.p>
      </div>
    </div>
  );
}