import { Card, CardContent } from "@/components/ui/card";
import type { TeamMember } from "@/lib/types";

interface TeamMemberProps {
  member: TeamMember;
  index: number;
}

export default function TeamMemberCard({ member, index }: TeamMemberProps) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow" data-testid={`team-member-${index}`}>
      <CardContent className="p-6">
        <img 
          src={member.image}
          alt={`Professional headshot of ${member.name}`}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          data-testid={`team-member-image-${index}`}
        />
        <h5 className="font-semibold text-gray-900 mb-1" data-testid={`team-member-name-${index}`}>
          {member.name}
        </h5>
        <p className="text-sm text-gray-600" data-testid={`team-member-role-${index}`}>
          {member.role}
        </p>
      </CardContent>
    </Card>
  );
}
