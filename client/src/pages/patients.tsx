import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, MapPin, Clock, Users, Plus, Filter, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPatientSchema, insertQueueTokenSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import type { Clinic } from "@shared/schema";
import LocationSelector from "@/components/sections/location-selector";

const patientFormSchema = insertPatientSchema.extend({
  email: z.string().email().optional().or(z.literal("")),
});

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["/api/clinics", searchQuery, selectedArea],
    queryFn: async () => {
      let url = "/api/clinics";
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append("search", searchQuery);
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

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: async (patientData: z.infer<typeof patientFormSchema>) => {
      const response = await apiRequest("POST", "/api/patients", patientData);
      return response.json();
    },
  });

  const joinQueueMutation = useMutation({
    mutationFn: async ({ clinicId, patientId }: { clinicId: string; patientId: string }) => {
      const response = await apiRequest("POST", `/api/clinics/${clinicId}/queue`, {
        patientId,
        estimatedWaitTime: selectedClinic?.currentWaitTime || 0,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clinics"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Queue Joined Successfully!",
        description: `You've been added to the queue at ${selectedClinic?.name}. You'll receive notifications when it's your turn.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join the queue. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: z.infer<typeof patientFormSchema>) => {
    if (!selectedClinic) return;

    try {
      const patient = await createPatientMutation.mutateAsync(data);
      await joinQueueMutation.mutateAsync({
        clinicId: selectedClinic.id,
        patientId: patient.id,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create patient or join queue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-success text-success-foreground";
      case "busy": return "bg-yellow-500 text-white";
      case "closed": return "bg-destructive text-destructive-foreground";
      default: return "bg-gray-500 text-white";
    }
  };

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
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-accent hover:bg-orange-600 text-white"
                          onClick={() => setSelectedClinic(clinic)}
                          disabled={clinic.status === "closed"}
                          data-testid={`button-join-queue-${clinic.id}`}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Join Queue
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Join Queue at {selectedClinic?.name}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your full name" {...field} data-testid="input-patient-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your phone number" {...field} data-testid="input-patient-phone" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your email" {...field} data-testid="input-patient-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1"
                                data-testid="button-cancel-queue"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="flex-1 bg-primary hover:bg-primary/90"
                                disabled={form.formState.isSubmitting || joinQueueMutation.isPending}
                                data-testid="button-confirm-queue"
                              >
                                {form.formState.isSubmitting || joinQueueMutation.isPending ? "Joining..." : "Join Queue"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
