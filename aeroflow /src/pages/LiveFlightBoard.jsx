import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, RefreshCw, Star } from "lucide-react";
import { format } from "date-fns";

export default function LiveFlightBoard() {
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: flights = [], isLoading: flightsLoading, refetch: refetchFlights } = useQuery({
    queryKey: ["todayFlights"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const allFlights = await base44.entities.Flight.list("-departure_time", 200);
      return allFlights.filter(f => f.departure_date === today);
    },
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["allBookings"],
    queryFn: () => base44.entities.Booking.list("-booking_date", 500),
    refetchInterval: autoRefresh ? 10000 : false,
  });

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate(createPageUrl("Home"));
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoading = flightsLoading || bookingsLoading;

  // Get flight IDs that have bookings (priority flights)
  const flightIdsWithBookings = new Set(
    bookings
      .filter(b => b.status === "Confirmed")
      .map(b => b.flight_id)
  );

  // Sort flights: priority first, then by departure time
  const sortedFlights = [...flights].sort((a, b) => {
    const aPriority = flightIdsWithBookings.has(a.id);
    const bPriority = flightIdsWithBookings.has(b.id);
    
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    return a.departure_time.localeCompare(b.departure_time);
  });

  const getRemarkText = (flight) => {
    switch (flight.status) {
      case "Boarding":
        return "Boarding";
      case "Delayed":
        return "Delayed";
      case "Departed":
        return "Departed";
      case "Arrived":
        return "Arrived";
      case "Cancelled":
        return "Cancelled";
      case "On Time":
        const now = new Date();
        const [hours, minutes] = flight.departure_time.split(":");
        const departureTime = new Date();
        departureTime.setHours(parseInt(hours), parseInt(minutes), 0);
        const minutesUntilDeparture = (departureTime - now) / 1000 / 60;
        
        if (minutesUntilDeparture <= 30) {
          return "Gate closing";
        } else if (minutesUntilDeparture <= 60) {
          return "Check-in at kiosks";
        } else if (minutesUntilDeparture <= 90) {
          return "Check-in open";
        } else {
          return "Gate lounge open";
        }
      default:
        return "Scheduled";
    }
  };

  const getRemarkColor = (remark, status) => {
    if (status === "Cancelled") return "text-gray-400";
    if (status === "Delayed") return "text-red-400";
    if (remark === "Boarding") return "text-green-400";
    if (remark === "Gate closing") return "text-red-400";
    if (remark === "Departed") return "text-blue-400";
    if (remark === "Arrived") return "text-emerald-400";
    return "text-yellow-200";
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("AdminDashboard"))}
              className="bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] hover:bg-[#3C3C3E]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-yellow-400 tracking-wider">
              INTERNATIONAL DEPARTURES - LIVE FEED
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-green-600 hover:bg-green-700" : "bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] hover:bg-[#3C3C3E]"}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
            </Button>
            <Button
              onClick={() => refetchFlights()}
              className="bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] hover:bg-[#3C3C3E]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>

        {/* Flight Board */}
        <Card className="bg-[#1A1A1C] border-[#2C2C2E] overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            {/* Header Row */}
            <div className="grid grid-cols-6 bg-gradient-to-r from-[#2C2C2E] to-[#1A1A1C] text-[#E5E7EB] font-bold text-sm uppercase tracking-wider border-b-2 border-yellow-600/50">
              <div className="px-6 py-4 border-r border-[#3C3C3E]">Flight No</div>
              <div className="px-6 py-4 border-r border-[#3C3C3E]">Destination</div>
              <div className="px-6 py-4 border-r border-[#3C3C3E]">Time</div>
              <div className="px-6 py-4 border-r border-[#3C3C3E]">Gate</div>
              <div className="px-6 py-4 border-r border-[#3C3C3E]">Status</div>
              <div className="px-6 py-4">Remarks</div>
            </div>

            {/* Flight Rows */}
            <div className="divide-y divide-[#2C2C2E]">
              {sortedFlights.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-[#7C7C7E] text-lg">No flights scheduled for today</p>
                </div>
              ) : (
                sortedFlights.map((flight) => {
                  const isPriority = flightIdsWithBookings.has(flight.id);
                  const remark = getRemarkText(flight);
                  const remarkColor = getRemarkColor(remark, flight.status);

                  return (
                    <div
                      key={flight.id}
                      className={`grid grid-cols-6 transition-all hover:bg-[#2C2C2E]/50 ${
                        isPriority
                          ? "bg-gradient-to-r from-amber-950/30 via-amber-900/20 to-transparent border-l-4 border-amber-500"
                          : "bg-[#1A1A1C]"
                      }`}
                    >
                      <div className="px-6 py-5 border-r border-[#2C2C2E] flex items-center gap-2">
                        {isPriority && (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                        )}
                        <span className={`font-bold tracking-wider ${isPriority ? "text-amber-300" : "text-yellow-400"}`}>
                          {flight.flight_number}
                        </span>
                      </div>
                      <div className="px-6 py-5 border-r border-[#2C2C2E]">
                        <span className={`font-semibold ${isPriority ? "text-amber-200" : "text-[#EDEDED]"}`}>
                          {flight.destination}
                        </span>
                      </div>
                      <div className="px-6 py-5 border-r border-[#2C2C2E]">
                        <span className="text-[#E5E7EB] font-mono text-lg">
                          {flight.departure_time}
                        </span>
                      </div>
                      <div className="px-6 py-5 border-r border-[#2C2C2E]">
                        <span className="text-[#A8B0BA] font-bold text-lg">
                          {flight.gate || "TBA"}
                        </span>
                      </div>
                      <div className="px-6 py-5 border-r border-[#2C2C2E]">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            flight.status === "On Time"
                              ? "bg-green-900/40 text-green-400 border border-green-700/50"
                              : flight.status === "Boarding"
                              ? "bg-blue-900/40 text-blue-400 border border-blue-700/50"
                              : flight.status === "Delayed"
                              ? "bg-red-900/40 text-red-400 border border-red-700/50"
                              : flight.status === "Departed"
                              ? "bg-purple-900/40 text-purple-400 border border-purple-700/50"
                              : "bg-gray-900/40 text-gray-400 border border-gray-700/50"
                          }`}
                        >
                          {flight.status}
                        </span>
                      </div>
                      <div className="px-6 py-5">
                        <span className={`font-medium ${remarkColor}`}>
                          {remark}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-[#A8B0BA]">Priority Flight (Has Bookings)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-[#A8B0BA]">On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-[#A8B0BA]">Boarding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-[#A8B0BA]">Delayed</span>
          </div>
        </div>
      </div>
    </div>
  );
}