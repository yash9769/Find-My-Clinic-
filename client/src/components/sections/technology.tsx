import { Server, Zap, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Technology() {
  const techFeatures = [
    {
      icon: Server,
      title: "Microservices Architecture",
      description: "Scalable and reliable system architecture ensuring 99.9% uptime and seamless performance.",
    },
    {
      icon: Zap,
      title: "Real-time Communication",
      description: "WebSockets and Twilio integration for instant notifications via SMS and WhatsApp.",
    },
    {
      icon: Smartphone,
      title: "Modern Tech Stack",
      description: "React Native, Node.js, Python, and MongoDB powering a fast, responsive platform.",
    },
  ];

  const techStack = [
    { name: "React Native", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Python", icon: "🐍" },
    { name: "MongoDB", icon: "🍃" },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Built on Robust Technology</h3>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Enterprise-grade architecture designed for scalability, reliability, and seamless user experience
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {techFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700" data-testid={`tech-feature-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold mb-3 text-white">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Tech Stack Icons */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-gray-800">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center opacity-70 hover:opacity-100 transition-opacity" data-testid={`tech-stack-${index}`}>
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="text-sm text-gray-300">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
