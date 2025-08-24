import TeamMember from "@/components/ui/team-member";
import type { TeamMember as TeamMemberType } from "@/lib/types";

export default function Team() {
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
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate healthcare technology innovators working to create a more efficient, 
              accessible, and organized local healthcare network for the entire community.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
