import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { format } from "date-fns";

export default function LiveFlightFeed() {
  const { data: flights = [], isLoading } = useQuery({
    queryKey: ["todayFlightsHome"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const allFlights = await base44.entities.Flight.list("-departure_time", 200);
      return allFlights.filter(f => f.departure_date === today).slice(0, 10);
    },
    refetchInterval: 15000,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["allBookingsHome"],
    queryFn: () => base44.entities.Booking.list("-booking_date", 500),
    refetchInterval: 15000,
  });

  const flightIdsWithBookings = new Set(
    bookings
      .filter(b => b.status === "Confirmed")
      .map(b => b.flight_id)
  );

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
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-[#1A1A1C] border-[#2C2C2E] overflow-hidden shadow-2xl">
      <CardContent className="p-0">
        {/* Header Row */}
        <div className="grid grid-cols-6 bg-gradient-to-r from-[#2C2C2E] to-[#1A1A1C] text-[#E5E7EB] font-bold text-xs uppercase tracking-wider border-b-2 border-yellow-600/50">
          <div className="px-4 py-3 border-r border-[#3C3C3E]">Flight No</div>
          <div className="px-4 py-3 border-r border-[#3C3C3E]">Destination</div>
          <div className="px-4 py-3 border-r border-[#3C3C3E]">Time</div>
          <div className="px-4 py-3 border-r border-[#3C3C3E]">Gate</div>
          <div className="px-4 py-3 border-r border-[#3C3C3E]">Status</div>
          <div className="px-4 py-3">Remarks</div>
        </div>

        {/* Flight Rows */}
        <div className="divide-y divide-[#2C2C2E] max-h-[500px] overflow-y-auto">
          {sortedFlights.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-[#7C7C7E] text-sm">No flights scheduled for today</p>
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
                  <div className="px-4 py-4 border-r border-[#2C2C2E] flex items-center gap-2">
                    {isPriority && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                    )}
                    <span className={`font-bold tracking-wider text-xs ${isPriority ? "text-amber-300" : "text-yellow-400"}`}>
                      {flight.flight_number}
                    </span>
                  </div>
                  <div className="px-4 py-4 border-r border-[#2C2C2E]">
                    <span className={`font-semibold text-xs ${isPriority ? "text-amber-200" : "text-[#EDEDED]"}`}>
                      {flight.destination}
                    </span>
                  </div>
                  <div className="px-4 py-4 border-r border-[#2C2C2E]">
                    <span className="text-[#E5E7EB] font-mono text-sm">
                      {flight.departure_time}
                    </span>
                  </div>
                  <div className="px-4 py-4 border-r border-[#2C2C2E]">
                    <span className="text-[#A8B0BA] font-bold text-sm">
                      {flight.gate || "TBA"}
                    </span>
                  </div>
                  <div className="px-4 py-4 border-r border-[#2C2C2E]">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
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
                  <div className="px-4 py-4">
                    <span className={`font-medium text-xs ${remarkColor}`}>
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
  );
}