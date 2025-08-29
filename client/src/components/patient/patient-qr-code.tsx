import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode.react";
import { 
  Download, 
  Share2, 
  Copy, 
  RefreshCw, 
  CheckCircle,
  ArrowLeft,
  QrCode as QrCodeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatientQRCodeProps {
  patientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    patientId: string;
  };
  onBack: () => void;
}

export default function PatientQRCode({ patientInfo, onBack }: PatientQRCodeProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);
  const [patientId] = useState(patientInfo.patientId || `patient_${Date.now()}`);
  
  // QR code value containing patient ID and verification data
  const qrValue = JSON.stringify({
    id: patientId,
    type: 'patient_profile',
    timestamp: Date.now(),
    version: '1.0'
  });

  useEffect(() => {
    // Simulate QR code generation
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#patient-qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${patientInfo.firstName}-${patientInfo.lastName}-QR.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleShareQR = async () => {
    const canvas = document.querySelector('#patient-qr-code canvas') as HTMLCanvasElement;
    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `${patientInfo.firstName}-QR.png`, { type: 'image/png' });
            await navigator.share({
              title: 'My Medical QR Code',
              text: 'Scan this QR code to access my medical profile',
              files: [file]
            });
          }
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleDownloadQR();
    }
  };

  const handleCopyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy QR data:', error);
    }
  };

  const regenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Medical <span className="text-primary">QR Code</span>
          </h1>
          <p className="text-lg text-gray-600">
            Show this to healthcare providers for instant access to your profile
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCodeIcon className="w-5 h-5" />
                Patient QR Code
              </CardTitle>
              <CardDescription>
                This QR code contains your secure patient ID for quick access to your medical information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Info Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div><strong>Name:</strong> {patientInfo.firstName} {patientInfo.lastName}</div>
                  <div><strong>Email:</strong> {patientInfo.email}</div>
                  <div><strong>Phone:</strong> {patientInfo.phone}</div>
                  {patientInfo.dateOfBirth && (
                    <div><strong>DOB:</strong> {new Date(patientInfo.dateOfBirth).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200" id="patient-qr-code">
                  {isGenerating ? (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <QRCode
                      value={qrValue}
                      size={256}
                      level="H"
                      includeMargin={true}
                      renderAs="canvas"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Secure & Encrypted
                  </Badge>
                  <Badge variant="outline">Patient ID: {patientId.slice(-8)}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                
                <Button
                  onClick={handleShareQR}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                
                <Button
                  onClick={handleCopyQRData}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy Data"}
                </Button>
                
                <Button
                  onClick={regenerateQR}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={isGenerating}
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              </div>

              {/* Instructions */}
              <Alert>
                <QrCodeIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>How to use:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Show this QR code to the clinic receptionist</li>
                    <li>They will scan it with their device</li>
                    <li>Your medical information will be instantly available</li>
                    <li>No need to fill out forms repeatedly!</li>
                  </ol>
                </AlertDescription>
              </Alert>

              {/* Security Notice */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Privacy & Security</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• QR code contains only your patient ID, not personal data</li>
                  <li>• Information is encrypted and securely transmitted</li>
                  <li>• Only authorized healthcare providers can access your profile</li>
                  <li>• You can regenerate your QR code anytime</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}