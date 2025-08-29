import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MapPin, Clock, Users, Phone, Mail, UserPlus, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Clinic } from "@shared/schema";
import { useDebounce } from "@/hooks/use-debounce";

interface PatientsProps {
  isAuthenticated?: boolean;
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-success text-success-foreground";
    case "busy": return "bg-yellow-500 text-white";
    case "closed": return "bg-destructive text-destructive-foreground";
    default: return "bg-gray-500 text-white";
  }
};

export default function Patients({ isAuthenticated = false, userInfo }: PatientsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [joinQueueData, setJoinQueueData] = useState({
    patientName: userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : '',
    phone: userInfo?.phone || '',
    email: userInfo?.email || '',
    reason: ''
  });
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const joinQueueMutation = useMutation({
    mutationFn: async (data: { clinicId: string; patientName: string; phone: string; email: string; reason: string }) => {
      const response = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to join queue');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinics'] });
      setIsJoinDialogOpen(false);
      alert(`Successfully joined queue! Your position: ${data.position}. Estimated wait time: ${data.estimatedWaitTime} minutes.`);
    },
    onError: (error) => {
      alert('Failed to join queue. Please try again.');
    },
  });
  
  const handleJoinQueue = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsJoinDialogOpen(true);
  };
  
  const handleSubmitJoinQueue = () => {
    if (selectedClinic && joinQueueData.patientName && joinQueueData.phone && joinQueueData.reason) {
      joinQueueMutation.mutate({
        clinicId: selectedClinic.id,
        ...joinQueueData,
      });
    }
  };
  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["/api/clinics", debouncedSearchQuery, selectedArea],
    queryFn: async () => {
      let url = "/api/clinics";
      const params = new URLSearchParams();
      
      if (debouncedSearchQuery) {
        params.append("search", debouncedSearchQuery);
      }
      if (selectedArea) {
        params.append("area", selectedArea);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch clinics");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Find Clinics Near You</h1>
            <p className="text-xl text-gray-600 mb-8">Real-time availability and wait times at your fingertips</p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Enter your location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3"
                  data-testid="input-search-location"
                />
              </div>
            </div>
          </div>

          {/* Clinics Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No clinics found</h3>
              <p className="text-gray-600">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic: Clinic) => (
                <Card key={clinic.id} className="hover:shadow-lg transition-shadow border border-gray-200" data-testid={`clinic-card-${clinic.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900" data-testid={`clinic-name-${clinic.id}`}>
                          {clinic.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {clinic.address}
                        </p>
                      </div>
                      <Badge className={getStatusColor(clinic.status)} data-testid={`clinic-status-${clinic.id}`}>
                        {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="flex items-center text-lg font-bold text-primary">
                              <Clock className="h-4 w-4 mr-1" />
                              <span data-testid={`clinic-wait-time-${clinic.id}`}>{clinic.currentWaitTime} min</span>
                            </div>
                            <div className="text-xs text-gray-500">Wait Time</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center text-lg font-bold text-secondary">
                              <Users className="h-4 w-4 mr-1" />
                              <span data-testid={`clinic-queue-size-${clinic.id}`}>{clinic.queueSize}</span>
                            </div>
                            <div className="text-xs text-gray-500">In Queue</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {isAuthenticated && clinic.status === 'open' ? (
                        <div className="space-y-3">
                          <Button 
                            onClick={() => handleJoinQueue(clinic)}
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={clinic.status !== 'open'}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join Queue
                          </Button>
                          
                          {/* Contact Information */}
                          <div className="space-y-2 border-t pt-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>Call: {clinic.phone || 'Not available'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>Walk-in service available</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>                      
                          {/* Contact Information for non-authenticated users */}
                          <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>Call to book appointment</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>Visit in person for walk-in service</span>
                            </div>
                          </div>
                          
                          <div className="text-center text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                            <strong>Note:</strong> {isAuthenticated ? 'Complete your profile for faster check-in with receptionist' : 'Login to join queue digitally'}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Join Queue Dialog */}
        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join Queue at {selectedClinic?.name}</DialogTitle>
              <DialogDescription>
                Please provide your information to join the queue. You'll receive notifications about your position.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name</Label>
                <Input
                  id="patientName"
                  value={joinQueueData.patientName}
                  onChange={(e) => setJoinQueueData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={joinQueueData.phone}
                  onChange={(e) => setJoinQueueData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={joinQueueData.email}
                  onChange={(e) => setJoinQueueData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  value={joinQueueData.reason}
                  onChange={(e) => setJoinQueueData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Brief description of your visit reason"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitJoinQueue}
                  disabled={!joinQueueData.patientName || !joinQueueData.phone || !joinQueueData.reason || joinQueueMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {joinQueueMutation.isPending ? 'Joining...' : 'Join Queue'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
