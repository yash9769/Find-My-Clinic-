import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Ambulance,
  Phone,
  AlertTriangle,
  MapPin,
  Loader2,
  CheckCircle,
  Navigation,
  Heart,
  Activity,
  Truck,
  Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ambulanceRequestSchema = z.object({
  emergencyType: z.string().min(1, "Please select the type of emergency"),
  urgencyLevel: z.string().min(1, "Please select the urgency level"),
  patientName: z.string().min(1, "Patient name is required"),
  patientAge: z.string().min(1, "Patient age is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  destinationHospital: z.string().optional(),
  symptoms: z.string().min(1, "Please describe the symptoms"),
  specialRequirements: z.string().optional(),
  hasInsurance: z.string().min(1, "Please specify insurance status"),
  insuranceProvider: z.string().optional(),
});

type AmbulanceRequestData = z.infer<typeof ambulanceRequestSchema>;

interface AmbulanceBookingProps {
  onBack?: () => void;
}

export default function AmbulanceBooking({ onBack }: AmbulanceBookingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [estimatedArrival, setEstimatedArrival] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AmbulanceRequestData>({
    resolver: zodResolver(ambulanceRequestSchema),
  });

  const hasInsurance = watch("hasInsurance");

  const emergencyTypes = [
    { value: "medical", label: "Medical", icon: "🏥" },
    { value: "cardiac", label: "Cardiac", icon: "❤️" },
    { value: "respiratory", label: "Breathing", icon: "🫁" },
    { value: "trauma", label: "Trauma", icon: "🩹" },
    { value: "stroke", label: "Stroke", icon: "🧠" },
    { value: "overdose", label: "Overdose", icon: "💊" },
    { value: "psychiatric", label: "Mental Health", icon: "🧘" },
    { value: "other", label: "Other", icon: "🆘" },
  ];

  const urgencyLevels = [
    {
      value: "critical",
      label: "Critical - Life threatening",
      color: "bg-red-600",
    },
    {
      value: "urgent",
      label: "Urgent - Serious condition",
      color: "bg-orange-500",
    },
    {
      value: "semi-urgent",
      label: "Semi-urgent - Stable but needs transport",
      color: "bg-yellow-500",
    },
  ];

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      // Simulate reverse geocoding
      const mockAddress = "123 Emergency St, Current City, State 12345";
      setValue("pickupAddress", mockAddress);
      setValue("city", "Current City");
      setValue("state", "State");
      setValue("zipCode", "12345");
      
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const calculateEstimatedArrival = (urgency: string) => {
    const baseTime = {
      critical: 4,
      urgent: 8,
      "semi-urgent": 12
    };
    
    const estimatedMinutes = baseTime[urgency as keyof typeof baseTime] || 10;
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + estimatedMinutes);
    
    return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onSubmit = async (data: AmbulanceRequestData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate estimated arrival
      const arrival = calculateEstimatedArrival(data.urgencyLevel);
      setEstimatedArrival(arrival);
      
      setRequestSubmitted(true);
      
      console.log("Ambulance request submitted:", data);
      
    } catch (error) {
      console.error("Error submitting ambulance request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (requestSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="shadow-2xl border-green-200">
            <CardHeader className="text-center bg-green-50">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-600 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-800">
                Ambulance Request Confirmed
              </CardTitle>
              <CardDescription className="text-green-700">
                Emergency services have been notified and an ambulance is on the way
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <Ambulance className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Estimated Arrival Time: {estimatedArrival}</strong>
                    <br />
                    Please stay calm and prepare for the ambulance arrival.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">Emergency Dispatcher</p>
                      <p className="text-sm text-blue-700">Available 24/7 for updates</p>
                    </div>
                    <Button size="sm" className="ml-auto">Call</Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Navigation className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-900">Live Tracking</p>
                      <p className="text-sm text-purple-700">Track ambulance location in real-time</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto">Track</Button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-2">While You Wait:</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Keep the patient comfortable and calm</li>
                    <li>• Gather insurance cards and identification</li>
                    <li>• Have a list of current medications ready</li>
                    <li>• Clear a path for emergency personnel</li>
                    <li>• Stay on the line if contacted by dispatch</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Close
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700">
                    Call 112 Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center bg-red-50">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Ambulance className="w-8 h-8 text-red-600" />
                <CardTitle className="text-2xl font-bold text-red-800">
                  Request Ambulance
                </CardTitle>
              </div>
              <CardDescription className="text-red-700">
                Complete this form to request emergency medical transport
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Emergency Type */}
                <div className="space-y-3">
                  <Label>Type of Emergency *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {emergencyTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setValue("emergencyType", type.value)}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-center"
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-xs font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                  {errors.emergencyType && (
                    <p className="text-sm text-red-600">{errors.emergencyType.message}</p>
                  )}
                </div>

                {/* Urgency Level */}
                <div className="space-y-3">
                  <Label>Urgency Level *</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("urgencyLevel", value)}
                    className="space-y-2"
                  >
                    {urgencyLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={level.value} id={level.value} />
                        <Label htmlFor={level.value} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.urgencyLevel && (
                    <p className="text-sm text-red-600">{errors.urgencyLevel.message}</p>
                  )}
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      placeholder="Full name"
                      {...register("patientName")}
                    />
                    {errors.patientName && (
                      <p className="text-sm text-red-600">{errors.patientName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Patient Age *</Label>
                    <Input
                      id="patientAge"
                      placeholder="Age in years"
                      {...register("patientAge")}
                    />
                    {errors.patientAge && (
                      <p className="text-sm text-red-600">{errors.patientAge.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1 (555) 123-4567"
                    {...register("contactPhone")}
                  />
                  {errors.contactPhone && (
                    <p className="text-sm text-red-600">{errors.contactPhone.message}</p>
                  )}
                </div>

                {/* Pickup Location */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Pickup Location *</Label>
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      variant="outline"
                      size="sm"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <MapPin className="w-4 h-4 mr-2" />
                      )}
                      Use Current Location
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Street address"
                    {...register("pickupAddress")}
                  />
                  {errors.pickupAddress && (
                    <p className="text-sm text-red-600">{errors.pickupAddress.message}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="City"
                        {...register("city")}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="State"
                        {...register("state")}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Zip Code"
                        {...register("zipCode")}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Destination Hospital */}
                <div className="space-y-2">
                  <Label htmlFor="destinationHospital">Preferred Hospital (Optional)</Label>
                  <Select onValueChange={(value) => setValue("destinationHospital", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital or leave blank for nearest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Hospital</SelectItem>
                      <SelectItem value="mercy">Mercy Medical Center</SelectItem>
                      <SelectItem value="saint-mary">Saint Mary's Hospital</SelectItem>
                      <SelectItem value="university">University Medical Center</SelectItem>
                      <SelectItem value="children">Children's Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Symptoms Description */}
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms & Condition Description *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe the patient's current condition, symptoms, and any relevant medical history..."
                    rows={4}
                    {...register("symptoms")}
                  />
                  {errors.symptoms && (
                    <p className="text-sm text-red-600">{errors.symptoms.message}</p>
                  )}
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any special equipment, wheelchair access, or other requirements..."
                    rows={2}
                    {...register("specialRequirements")}
                  />
                </div>

                {/* Insurance Information */}
                <div className="space-y-4">
                  <Label>Insurance Information *</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("hasInsurance", value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="insurance-yes" />
                      <Label htmlFor="insurance-yes">Yes, I have insurance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="insurance-no" />
                      <Label htmlFor="insurance-no">No insurance / Self-pay</Label>
                    </div>
                  </RadioGroup>
                  
                  {hasInsurance === "yes" && (
                    <Input
                      placeholder="Insurance provider name"
                      {...register("insuranceProvider")}
                    />
                  )}
                  
                  {errors.hasInsurance && (
                    <p className="text-sm text-red-600">{errors.hasInsurance.message}</p>
                  )}
                </div>

                {/* Important Notice */}
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> This is for non-life-threatening emergencies. 
                    For immediate life-threatening situations, call 112 directly.
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {onBack && (
                    <Button type="button" onClick={onBack} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Requesting Ambulance...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-4 h-4" />
                        Request Ambulance
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => window.location.href = "tel:112"}
                    className="flex-1 bg-red-700 hover:bg-red-800"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 112 Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}