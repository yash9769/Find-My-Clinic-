import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Clock, Users, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import type { Clinic } from "@shared/schema";
import { useDebounce } from "@/hooks/use-debounce";

// --- Configuration for Google Form ---
// 1. Replace this with your actual Google Form URL.
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd1sQ0WztxMLEaYy4mRPK8aZw3Yqx_N4M-hw3YGJ1i_FkmDrg/viewform";
// 2. Replace this with the entry ID for your "Clinic Name" field in the Google Form.
const CLINIC_NAME_ENTRY_ID = "entry.YOUR_CLINIC_NAME_FIELD_ID";
// For instructions on how to get these values, see: https://support.google.com/docs/answer/160000
// -----------------------------------------

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-success text-success-foreground";
    case "busy": return "bg-yellow-500 text-white";
    case "closed": return "bg-destructive text-destructive-foreground";
    default: return "bg-gray-500 text-white";
  }
};

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

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

  const handleOpenQrDialog = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsQrDialogOpen(true);
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
                    
                    <Button
                      className="w-full bg-accent hover:bg-orange-600 text-white"
                      onClick={() => handleOpenQrDialog(clinic)}
                      disabled={clinic.status === "closed"}
                      data-testid={`button-join-queue-${clinic.id}`}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Join Queue
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scan to Join Queue</DialogTitle>
              </DialogHeader>
              {selectedClinic && (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Scan this QR code with your phone to join the queue for {selectedClinic.name}.
                  </p>
                  <div className="bg-white p-4 rounded-lg inline-block shadow-md border">
                    <QRCodeSVG
                      value={`${GOOGLE_FORM_URL}?usp=pp_url&${CLINIC_NAME_ENTRY_ID}=${encodeURIComponent(
                        selectedClinic.name,
                      )}`}
                      size={192}
                    />
                  </div>
                  <div className="mt-4 text-left bg-gray-50 p-3 rounded-lg border">
                    <p className="text-sm"><span className="font-semibold">Clinic:</span> {selectedClinic.name}</p>
                    <p className="text-sm"><span className="font-semibold">Location:</span> {selectedClinic.address}</p>
                  </div>
                </div>
              )}
              <Button onClick={() => setIsQrDialogOpen(false)} className="w-full">Close</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
