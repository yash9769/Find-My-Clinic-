import { MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Clinic } from "@shared/schema";

interface ClinicCardProps {
  clinic: Clinic;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success text-success-foreground";
      case "busy": return "bg-yellow-500 text-white";
      case "closed": return "bg-destructive text-destructive-foreground";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="bg-white shadow-lg border border-gray-200" data-testid={`map-clinic-card-${clinic.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-gray-900" data-testid={`map-clinic-name-${clinic.id}`}>
              {clinic.name}
            </h4>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {clinic.address}
            </p>
          </div>
          <Badge className={getStatusColor(clinic.status)} data-testid={`map-clinic-status-${clinic.id}`}>
            {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center text-lg font-bold text-primary">
                <Clock className="h-3 w-3 mr-1" />
                <span data-testid={`map-clinic-wait-time-${clinic.id}`}>{clinic.currentWaitTime} min</span>
              </div>
              <div className="text-xs text-gray-500">Wait Time</div>
            </div>
            <div className="text-center">
              <div className="flex items-center text-lg font-bold text-secondary">
                <Users className="h-3 w-3 mr-1" />
                <span data-testid={`map-clinic-queue-size-${clinic.id}`}>{clinic.queueSize}</span>
              </div>
              <div className="text-xs text-gray-500">In Queue</div>
            </div>
          </div>
          <Button 
            size="sm"
            className="bg-accent hover:bg-orange-600 text-white text-xs px-3 py-2"
            disabled={clinic.status === "closed"}
            data-testid={`map-button-join-queue-${clinic.id}`}
          >
            Join Queue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
