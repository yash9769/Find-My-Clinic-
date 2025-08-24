import { useState } from "react";
import { Search, Clock, Ticket, Bell, CheckCircle, LogIn, Users, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"patient" | "clinic">("patient");

  const patientSteps = [
    {
      icon: Search,
      title: "Discover Clinics",
      description: "Find nearby clinics on an interactive map",
      color: "bg-primary",
    },
    {
      icon: Clock,
      title: "View Wait Times",
      description: "See live, accurate wait times before leaving home",
      color: "bg-primary",
    },
    {
      icon: Ticket,
      title: "Get Digital Token",
      description: "Receive your queue number instantly",
      color: "bg-primary",
    },
    {
      icon: Bell,
      title: "Get Notifications",
      description: "Receive alerts when it's almost your turn",
      color: "bg-primary",
    },
    {
      icon: CheckCircle,
      title: "Check-in",
      description: "Arrive at the clinic at the right time",
      color: "bg-success",
    },
  ];

  const clinicSteps = [
    {
      icon: LogIn,
      title: "Easy Login",
      description: "Access your admin panel or use WhatsApp bot",
      color: "bg-secondary",
    },
    {
      icon: Users,
      title: "Manage Queue",
      description: "View and manage patient queue in real-time",
      color: "bg-secondary",
    },
    {
      icon: RefreshCw,
      title: "Update Status",
      description: "Keep wait times accurate with simple updates",
      color: "bg-secondary",
    },
    {
      icon: MessageCircle,
      title: "Communicate",
      description: "Send automated notifications to patients",
      color: "bg-success",
    },
  ];

  const currentSteps = activeTab === "patient" ? patientSteps : clinicSteps;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h3>
            <p className="text-xl text-gray-600">Simple steps for both patients and clinics</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-lg">
              <Button
                variant={activeTab === "patient" ? "default" : "ghost"}
                onClick={() => setActiveTab("patient")}
                className={cn(
                  "px-6 py-3 rounded-md text-sm font-medium transition-colors",
                  activeTab === "patient" ? "bg-primary text-white" : "text-gray-700 hover:text-primary"
                )}
                data-testid="tab-patient"
              >
                <Users className="h-4 w-4 mr-2" />
                For Patients
              </Button>
              <Button
                variant={activeTab === "clinic" ? "default" : "ghost"}
                onClick={() => setActiveTab("clinic")}
                className={cn(
                  "px-6 py-3 rounded-md text-sm font-medium transition-colors",
                  activeTab === "clinic" ? "bg-primary text-white" : "text-gray-700 hover:text-primary"
                )}
                data-testid="tab-clinic"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                For Clinics
              </Button>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            <div className={cn(
              "grid gap-6",
              activeTab === "patient" ? "md:grid-cols-5" : "md:grid-cols-4"
            )}>
              {currentSteps.map((step, index) => (
                <div key={index} className="text-center" data-testid={`step-${activeTab}-${index}`}>
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110`}>
                    <step.icon className="text-white h-6 w-6" />
                  </div>
                  <div className={`w-full h-1 ${step.color} rounded mb-4`}></div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
