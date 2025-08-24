import { QrCode, Brain, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { FeatureItem } from "@/lib/types";

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

const iconMap = {
  qrcode: QrCode,
  brain: Brain,
  "message-square": MessageSquare,
};

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || QrCode;

  return (
    <Card className="text-center group hover:shadow-lg transition-shadow" data-testid={`feature-card-${index}`}>
      <CardContent className="p-8">
        <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
          <IconComponent className="text-white h-8 w-8" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
        <p className="text-gray-600 mb-4">{feature.description}</p>
        <div className="text-sm font-medium text-primary">{feature.badge}</div>
      </CardContent>
    </Card>
  );
}
