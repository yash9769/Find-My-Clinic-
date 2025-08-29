import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Calendar, MapPin, Heart, AlertTriangle, Plus, X, Phone, Home, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const patientInfoSchema = z.object({
  // Personal Information
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select your gender"),
  bloodType: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  
  // Contact & Address Information
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  
  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Valid phone number is required"),
  emergencyContactRelation: z.string().min(1, "Relationship is required"),
  
  // Medical Information
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  
  // Insurance Information
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceGroupNumber: z.string().optional(),
  
  // Additional Information for Receptionist
  primaryPhysician: z.string().optional(),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  
  // Consent and Notes
  photoConsent: z.boolean().default(true),
  smsConsent: z.boolean().default(true),
  emailConsent: z.boolean().default(true),
  additionalNotes: z.string().optional(),
});

type PatientInfoData = z.infer<typeof patientInfoSchema>;

interface PatientInfoFormProps {
  onComplete: (data: PatientInfoData) => void;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    [key: string]: any; // For existing patient data
  };
}

export default function PatientInfoForm({ onComplete, userInfo }: PatientInfoFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<PatientInfoData>({
    resolver: zodResolver(patientInfoSchema),
  });

  const totalSteps = 6;

  // Calculate actual completion percentage based on filled fields
  const calculateCompletionPercentage = () => {
    const watchedValues = watch();
    const requiredFields = [
      'dateOfBirth', 'gender', 'address', 'city', 'state', 'zipCode',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
      'preferredLanguage'
    ];
    
    const optionalFields = [
      'bloodType', 'height', 'weight', 'occupation', 'maritalStatus',
      'insuranceProvider', 'insurancePolicyNumber', 'insuranceGroupNumber',
      'primaryPhysician', 'additionalNotes'
    ];
    
    let filledRequired = 0;
    let filledOptional = 0;
    
    // Count filled required fields
    requiredFields.forEach(field => {
      if (watchedValues[field as keyof PatientInfoData] && 
          String(watchedValues[field as keyof PatientInfoData]).trim() !== '') {
        filledRequired++;
      }
    });
    
    // Count filled optional fields
    optionalFields.forEach(field => {
      if (watchedValues[field as keyof PatientInfoData] && 
          String(watchedValues[field as keyof PatientInfoData]).trim() !== '') {
        filledOptional++;
      }
    });
    
    // Count medical arrays
    const medicalArrays = [allergies, medications, medicalConditions];
    const filledArrays = medicalArrays.filter(arr => arr.length > 0).length;
    
    // Weight: Required fields = 70%, Optional fields = 20%, Medical arrays = 10%
    const requiredPercentage = (filledRequired / requiredFields.length) * 70;
    const optionalPercentage = (filledOptional / optionalFields.length) * 20;
    const arrayPercentage = (filledArrays / medicalArrays.length) * 10;
    
    return Math.round(requiredPercentage + optionalPercentage + arrayPercentage);
  };

  // Initialize form with existing data
  useEffect(() => {
    if (userInfo) {
      // Set existing allergies, medications, and conditions
      if (userInfo.allergies && Array.isArray(userInfo.allergies)) {
        setAllergies(userInfo.allergies);
        setValue('allergies', userInfo.allergies);
      }
      if (userInfo.medications && Array.isArray(userInfo.medications)) {
        setMedications(userInfo.medications);
        setValue('medications', userInfo.medications);
      }
      if (userInfo.medicalConditions && Array.isArray(userInfo.medicalConditions)) {
        setMedicalConditions(userInfo.medicalConditions);
        setValue('medicalConditions', userInfo.medicalConditions);
      }
      
      // Set all other form fields
      const fieldsToSet = [
        'dateOfBirth', 'gender', 'bloodType', 'height', 'weight',
        'address', 'city', 'state', 'zipCode',
        'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
        'preferredLanguage', 'occupation', 'maritalStatus',
        'insuranceProvider', 'insurancePolicyNumber', 'insuranceGroupNumber',
        'primaryPhysician', 'photoConsent', 'smsConsent', 'emailConsent', 'additionalNotes'
      ];
      
      fieldsToSet.forEach(field => {
        if (userInfo[field] !== undefined) {
          setValue(field as keyof PatientInfoData, userInfo[field]);
        }
      });
    }
  }, [userInfo, setValue]);

  const addItem = (type: 'allergy' | 'medication' | 'condition') => {
    switch (type) {
      case 'allergy':
        if (newAllergy.trim()) {
          const updated = [...allergies, newAllergy.trim()];
          setAllergies(updated);
          setValue('allergies', updated);
          setNewAllergy("");
        }
        break;
      case 'medication':
        if (newMedication.trim()) {
          const updated = [...medications, newMedication.trim()];
          setMedications(updated);
          setValue('medications', updated);
          setNewMedication("");
        }
        break;
      case 'condition':
        if (newCondition.trim()) {
          const updated = [...medicalConditions, newCondition.trim()];
          setMedicalConditions(updated);
          setValue('medicalConditions', updated);
          setNewCondition("");
        }
        break;
    }
  };

  const removeItem = (type: 'allergy' | 'medication' | 'condition', index: number) => {
    switch (type) {
      case 'allergy':
        const updatedAllergies = allergies.filter((_, i) => i !== index);
        setAllergies(updatedAllergies);
        setValue('allergies', updatedAllergies);
        break;
      case 'medication':
        const updatedMedications = medications.filter((_, i) => i !== index);
        setMedications(updatedMedications);
        setValue('medications', updatedMedications);
        break;
      case 'condition':
        const updatedConditions = medicalConditions.filter((_, i) => i !== index);
        setMedicalConditions(updatedConditions);
        setValue('medicalConditions', updatedConditions);
        break;
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['dateOfBirth', 'gender', 'bloodType', 'height', 'weight'] as (keyof PatientInfoData)[];
      case 2:
        return ['address', 'city', 'state', 'zipCode'] as (keyof PatientInfoData)[];
      case 3:
        return ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'] as (keyof PatientInfoData)[];
      case 4:
        return ['preferredLanguage', 'occupation', 'maritalStatus'] as (keyof PatientInfoData)[];
      case 5:
        return ['insuranceProvider', 'insurancePolicyNumber', 'primaryPhysician'] as (keyof PatientInfoData)[];
      case 6:
        return [] as (keyof PatientInfoData)[]; // Medical info and consents - optional
      default:
        return [] as (keyof PatientInfoData)[];
    }
  };

  const onSubmit = (data: PatientInfoData) => {
    onComplete({
      ...data,
      allergies,
      medications,
      medicalConditions,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setValue("gender", value)} value={watch("gender")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type (Optional)</Label>
                <Select onValueChange={(value) => setValue("bloodType", value)} value={watch("bloodType")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (Optional)</Label>
                <Input
                  id="height"
                  placeholder="e.g., 5'8 or 173 cm"
                  {...register("height")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="weight">Weight (Optional)</Label>
                <Input
                  id="weight"
                  placeholder="e.g., 150 lbs or 68 kg"
                  {...register("weight")}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    {...register("state")}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="12345"
                    {...register("zipCode")}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Full name"
                  {...register("emergencyContactName")}
                />
                {errors.emergencyContactName && (
                  <p className="text-sm text-red-600">{errors.emergencyContactName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Phone Number</Label>
                  <Input
                    id="emergencyContactPhone"
                    placeholder="+1 (555) 123-4567"
                    {...register("emergencyContactPhone")}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation">Relationship</Label>
                  <Select onValueChange={(value) => setValue("emergencyContactRelation", value)} value={watch("emergencyContactRelation")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.emergencyContactRelation && (
                    <p className="text-sm text-red-600">{errors.emergencyContactRelation.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select onValueChange={(value) => setValue("preferredLanguage", value)} value={watch("preferredLanguage")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredLanguage && (
                  <p className="text-sm text-red-600">{errors.preferredLanguage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select onValueChange={(value) => setValue("maritalStatus", value)} value={watch("maritalStatus")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="occupation">Occupation (Optional)</Label>
                <Input
                  id="occupation"
                  placeholder="Your profession or job title"
                  {...register("occupation")}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance & Healthcare Provider</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider (Optional)</Label>
                <Input
                  id="insuranceProvider"
                  placeholder="e.g., Blue Cross Blue Shield, Aetna"
                  {...register("insuranceProvider")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurancePolicyNumber">Policy Number (Optional)</Label>
                  <Input
                    id="insurancePolicyNumber"
                    placeholder="Policy number"
                    {...register("insurancePolicyNumber")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceGroupNumber">Group Number (Optional)</Label>
                  <Input
                    id="insuranceGroupNumber"
                    placeholder="Group number"
                    {...register("insuranceGroupNumber")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryPhysician">Primary Physician (Optional)</Label>
                <Input
                  id="primaryPhysician"
                  placeholder="Dr. Smith, Family Medicine"
                  {...register("primaryPhysician")}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information & Consents</h3>
            
            {/* Allergies */}
            <div className="space-y-3">
              <Label>Allergies</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add allergy (e.g., Penicillin, Peanuts)"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergy'))}
                />
                <Button type="button" onClick={() => addItem('allergy')} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeItem('allergy', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-3">
              <Label>Current Medications</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add medication (e.g., Aspirin 81mg)"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('medication'))}
                />
                <Button type="button" onClick={() => addItem('medication')} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {medication}
                    <button
                      type="button"
                      onClick={() => removeItem('medication', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-3">
              <Label>Medical Conditions</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add condition (e.g., Diabetes, Hypertension)"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('condition'))}
                />
                <Button type="button" onClick={() => addItem('condition')} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {medicalConditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeItem('condition', index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Consent Forms */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-semibold text-gray-900">Communication Preferences</h4>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register("photoConsent")}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Allow photo identification for medical records</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register("smsConsent")}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Receive SMS notifications for appointments and reminders</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register("emailConsent")}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Receive email updates about your health records</span>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional medical information, special instructions, or concerns you'd like to share with healthcare providers..."
                {...register("additionalNotes")}
                rows={4}
              />
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📋 For Receptionist Reference</h4>
              <p className="text-sm text-blue-800 mb-2">
                This comprehensive profile enables receptionists to:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Quickly access your information via QR code scanning</li>
                <li>• Verify your identity and contact details</li>
                <li>• Check insurance and medical history instantly</li>
                <li>• Prepare for your visit with relevant information</li>
                <li>• Ensure faster, more efficient check-in process</li>
              </ul>
            </div>
            

          </div>
        );

      default:
        return null;
    }
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              Complete Your <span className="text-primary">Profile</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Welcome, {userInfo.firstName}! Let's set up your medical profile.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{calculateCompletionPercentage()}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${calculateCompletionPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                This information helps healthcare providers give you the best care possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                {renderStep()}

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  {currentStep === totalSteps ? (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Complete Profile
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}