import { TrendingUp, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const benefits = [
  {
    icon: TrendingUp,
    title: "Efficient Digital Management",
    description: "Simple admin panel or WhatsApp bot to manage queues, update wait times, and scan patient QR codes for instant check-in.",
    color: "bg-primary",
  },
  {
    icon: Users,
    title: "Reduced Staff Burnout",
    description: "Eliminate manual queue management stress and reduce administrative chaos with automated patient flow.",
    color: "bg-success",
  },
  {
    icon: Settings,
    title: "Better Resource Allocation",
    description: "Optimize staff scheduling and improve operational efficiency with predictive patient flow data.",
    color: "bg-secondary",
  },
];

export default function ForClinics() {
  return (
    <section id="clinics" className="py-20 bg-gradient-to-br from-secondary/10 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Transform Your Clinic Operations</h3>
            <p className="text-xl text-gray-600">Reduce administrative burden and improve patient satisfaction</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Modern clinic reception area with digital check-in system" 
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow" data-testid={`clinic-benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <benefit.icon className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="pt-6">
                <Link href="/clinics">
                  <Button size="lg" className="bg-accent hover:bg-orange-600 text-white" data-testid="button-request-demo-home">
                    Request a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
