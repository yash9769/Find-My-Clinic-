import { Goal, Eye, Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TeamMember from "@/components/ui/team-member";
import type { TeamMember as TeamMemberType } from "@/lib/types";

export default function About() {
  const teamMembers: TeamMemberType[] = [
    {
      name: "Yashodhan Rajapkar",
      role: "Co-Founder & Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "Madhura Patil",
      role: "Co-Founder & UX Designer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b093?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "Kaivalya Gharat",
      role: "Co-Founder & Backend Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    },
    {
      name: "Swarali Mahishi",
      role: "Co-Founder & Product Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Find My Clinic
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our mission is to create a more efficient, accessible, and organized local healthcare network 
              for the entire community through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                Passionate healthcare technology innovators working to transform clinic experiences
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={index}
                  member={member}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="bg-primary/5 border-primary/20" data-testid="mission-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                    <Goal className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To eliminate the frustration of uncertain wait times in healthcare by providing 
                    real-time, accessible technology that connects patients with clinics efficiently 
                    and compassionately.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/5 border-secondary/20" data-testid="vision-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6">
                    <Eye className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    To create a comprehensive healthcare ecosystem where every clinic visit is 
                    predictable, every patient is informed, and healthcare providers can focus 
                    on what they do best—caring for people.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-xl text-gray-600">
                The principles that guide our work and shape our platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow" data-testid="value-accessibility">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="text-white h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h4>
                  <p className="text-gray-600">
                    Healthcare technology should be inclusive and accessible to everyone, 
                    regardless of their technical comfort level or infrastructure.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow" data-testid="value-empathy">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-white h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Empathy</h4>
                  <p className="text-gray-600">
                    We understand the stress and uncertainty of seeking healthcare, 
                    and we design with compassion for both patients and providers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow" data-testid="value-innovation">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Goal className="text-white h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Innovation</h4>
                  <p className="text-gray-600">
                    We continuously innovate to solve real healthcare challenges 
                    with practical, user-friendly technology solutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            </div>
            
            <Card className="p-8 md:p-12 shadow-lg">
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  Find My Clinic was born from a simple observation: healthcare visits don't have to be 
                  unpredictable and stressful. Our founders experienced firsthand the frustration of 
                  long, uncertain waits at clinics and witnessed the burnout affecting healthcare staff 
                  managing chaotic queues.
                </p>
                
                <p className="text-gray-600 mb-6">
                  We realized that the gap wasn't in medical expertise—it was in information flow. 
                  Patients needed to know when to arrive, and clinics needed tools to manage their 
                  patient flow efficiently. This insight led to the creation of our platform that 
                  bridges this information gap with real-time queue management.
                </p>
                
                <p className="text-gray-600">
                  Today, Find My Clinic serves as a comprehensive solution that not only reduces wait 
                  times and stress for patients but also alleviates administrative burden for healthcare 
                  providers. We're proud to be building technology that makes healthcare more human 
                  and accessible for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
