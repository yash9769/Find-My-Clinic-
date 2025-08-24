import TeamMember from "@/components/ui/team-member";
import type { TeamMember as TeamMemberType } from "@/lib/types";

export default function Team() {
  const teamMembers: TeamMemberType[] = [
    {
      name: "Yashodhan Rajapkar",
      role: "Founder & Lead Developer",
      image: "@assets/my photo_1756052641439.jpg",
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

          <div className="flex justify-center mb-16">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
