import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ClinicCard from "@/components/ui/clinic-card";
import type { Clinic } from "@shared/schema";
import { useDebounce } from "@/hooks/use-debounce";

export default function FindMyClinic() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce input by 500ms

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["/api/clinics", debouncedSearchQuery],
    queryFn: async () => {
      const url = debouncedSearchQuery 
        ? `/api/clinics?search=${encodeURIComponent(debouncedSearchQuery)}`
        : "/api/clinics";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch clinics");
      return response.json();
    },
  });

  const handleSearch = () => {
    // Search is already handled by the query dependency on searchQuery
  };

  return (
    <section id="patients" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Find Clinics Near You</h3>
            <p className="text-xl text-gray-600 mb-8">Real-time availability and wait times at your fingertips</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter your location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    data-testid="input-location-search"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-white"
                  data-testid="button-search-clinics"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Mock Map Interface */}
            <div className="relative h-96 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                alt="City map view with healthcare facility markers" 
                className="w-full h-full object-cover"
              />
              
              {/* Clinic Cards Overlay */}
              <div className="absolute top-4 right-4 w-80 space-y-3 max-h-80 overflow-y-auto">
                {isLoading ? (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  clinics.slice(0, 3).map((clinic: Clinic) => (
                    <ClinicCard key={clinic.id} clinic={clinic} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
