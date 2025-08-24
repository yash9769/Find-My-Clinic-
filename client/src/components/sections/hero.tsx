import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { ClinicStats } from "@/lib/types";

export default function Hero() {
  const { data: stats } = useQuery<ClinicStats>({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  return (
    <section className="gradient-hero py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Waiting,<br />
              <span className="text-primary">Start Healing</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find nearby clinics, view real-time wait times, and join queues digitally. 
              Make healthcare visits predictable and stress-free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/patients">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4"
                  data-testid="button-find-clinic-hero"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find a Clinic Now
                </Button>
              </Link>
              <Link href="/clinics">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4"
                  data-testid="button-list-clinic-hero"
                >
                  <Hospital className="h-5 w-5 mr-2" />
                  List Your Clinic
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Modern clinic waiting room with comfortable seating" 
              className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
            />
            
            {/* Overlay stats */}
            <div className="absolute -bottom-6 left-6 right-6">
              <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="stat-clinics">
                    {stats?.clinicsConnected || 0}+
                  </div>
                  <div className="text-sm text-gray-600">Clinics Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success" data-testid="stat-time-saved">
                    {stats?.avgTimeSaved || "0 min"}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary" data-testid="stat-patients">
                    {stats?.patientsServed || 0}+
                  </div>
                  <div className="text-sm text-gray-600">Patients Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
