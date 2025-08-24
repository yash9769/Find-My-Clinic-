import { Clock, UserX, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "@/components/ui/feature-card";

export default function ProblemSolution() {
  const problems = [
    {
      icon: Clock,
      title: "Wasted Time in Queues",
      description: "Hours spent waiting in crowded clinics with no idea when you'll be seen.",
      color: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      icon: UserX,
      title: "Staff Burnout",
      description: "Healthcare workers overwhelmed by manual queue management and administrative chaos.",
      color: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: AlertTriangle,
      title: "Poor Patient Experience",
      description: "Unpredictable wait times leading to stress and frustration for patients seeking care.",
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
  ];

  const solutions = [
    {
      icon: "📍",
      title: "Real-Time Clinic Discovery",
      description: "Find nearby clinics instantly with live wait times and availability status.",
    },
    {
      icon: "📱",
      title: "Digital Queue Management",
      description: "Get your queue token remotely and receive notifications when it's your turn.",
    },
    {
      icon: "🔗",
      title: "Hybrid QR System",
      description: "Seamless integration with physical QR standees for accessibility and convenience.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* The Problem */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">The Problem with Current Clinic Visits</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {problems.map((problem, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow" data-testid={`problem-card-${index}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${problem.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                      <problem.icon className={`${problem.iconColor} h-6 w-6`} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h4>
                    <p className="text-gray-600">{problem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Solution */}
          <Card className="bg-white shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-primary mb-4">Our Smart Solution</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find My Clinic bridges the information gap in local healthcare with real-time queue management 
                and intelligent wait time predictions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Smartphone displaying healthcare app interface" 
                  className="rounded-xl shadow-lg w-full object-cover"
                />
              </div>
              
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`solution-item-${index}`}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-sm">
                      {solution.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{solution.title}</h4>
                      <p className="text-gray-600">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
