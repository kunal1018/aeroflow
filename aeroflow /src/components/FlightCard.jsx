import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const FlightCard = React.memo(({ flight, onSelect, selectedClass }) => {
  const getPriceForClass = () => {
    switch (selectedClass) {
      case "First": return flight.price_first;
      case "Business": return flight.price_business;
      case "Premium Economy": return flight.price_premium_economy;
      default: return flight.price_economy;
    }
  };

  const getAvailableSeatsForClass = () => {
    switch (selectedClass) {
      case "First": return flight.available_seats_first;
      case "Business": return flight.available_seats_business;
      case "Premium Economy": return flight.available_seats_premium_economy;
      default: return flight.available_seats_economy;
    }
  };

  const price = getPriceForClass();
  const availableSeats = getAvailableSeatsForClass();

  const statusColors = {
    "On Time": "bg-green-100 text-green-800 border-green-200",
    "Delayed": "bg-red-100 text-red-800 border-red-200",
    "Boarding": "bg-blue-100 text-blue-800 border-blue-200",
    "Cancelled": "bg-gray-100 text-gray-800 border-gray-200",
    "Departed": "bg-purple-100 text-purple-800 border-purple-200",
    "Arrived": "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  // Render connecting flights
  if (flight.is_connecting && flight.connecting_flights?.length > 0) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] hover:border-[#4C4C4E] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/3 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000">
        <CardContent className="p-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Flight Info */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-[#EDEDED] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide leading-relaxed">{flight.airline}</h3>
                  <Badge variant="outline" className="bg-gradient-to-r from-amber-900/25 to-amber-800/25 text-amber-400 border-amber-700/40 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]">
                    {flight.total_stops} {flight.total_stops === 1 ? "Stop" : "Stops"}
                  </Badge>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50 backdrop-blur-sm shadow-inner">
                  {flight.status}
                </Badge>
              </div>

              {/* Overall Route Summary */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#3A3A3A]">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{flight.departure_time}</div>
                  <div className="text-lg text-[#94A3B8]">{flight.origin}</div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <div className="flex items-center gap-1 text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <div className="w-12 h-px bg-slate-300"></div>
                    <Plane className="w-4 h-4" />
                    <div className="w-12 h-px bg-slate-300"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {flight.duration}
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{flight.arrival_time}</div>
                  <div className="text-lg text-[#94A3B8]">{flight.destination}</div>
                </div>
              </div>

              {/* Flight Legs */}
              <div className="space-y-3">
                {flight.connecting_flights.map((leg, index) => (
                  <div key={index} className="bg-[#0A0A0A]/50 backdrop-blur-sm rounded-lg p-3 border border-[#2A2A2A] shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#94A3B8]">LEG {index + 1}</span>
                        <span className="text-sm font-medium text-white">{leg.airline} {leg.flight_number}</span>
                      </div>
                      <span className="text-xs text-[#94A3B8]">{leg.duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-white">{leg.departure_time}</div>
                        <div className="text-sm text-[#94A3B8]">{leg.origin}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#4A4A4A]" />
                      <div className="flex-1 text-right">
                        <div className="text-lg font-bold text-white">{leg.arrival_time}</div>
                        <div className="text-sm text-[#94A3B8]">{leg.destination}</div>
                      </div>
                    </div>
                    {leg.layover_duration && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Clock className="w-3 h-3" />
                          Layover: {leg.layover_duration} in {leg.destination}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Date */}
              <div className="text-sm text-[#94A3B8]">
                {format(new Date(flight.departure_date), "EEEE, MMMM d, yyyy")}
              </div>
            </div>

            {/* Price and Action */}
            <div className="lg:border-l border-[#3A3A3A] lg:pl-6 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
              <div className="text-right">
                <div className="text-sm text-[#94A3B8] mb-1">{selectedClass} Class</div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E5E7EB] to-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">${price}</div>
                <div className="text-xs text-[#94A3B8] mt-1">
                  {availableSeats} seats available
                </div>
              </div>
              <Button 
                onClick={() => onSelect(flight)}
                disabled={availableSeats === 0}
                className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] hover:from-[#2A2A2A] hover:to-[#3A3A3A] border border-[#4A4A4A] text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] whitespace-nowrap transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-500"
                size="lg"
              >
                Select Flight
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render direct flights
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] hover:border-[#4C4C4E] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/3 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000">
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Flight Info */}
          <div className="flex-1 space-y-4">
            {/* Airline and Flight Number */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#EDEDED] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide leading-relaxed">{flight.airline}</h3>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">{flight.flight_number}</p>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50 backdrop-blur-sm shadow-inner">
                  Direct
                </Badge>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50 backdrop-blur-sm shadow-inner">
                {flight.status}
              </Badge>
            </div>

            {/* Route and Time */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{flight.departure_time}</div>
                <div className="text-lg text-[#94A3B8]">{flight.origin}</div>
              </div>

              <div className="flex flex-col items-center px-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  <div className="w-16 h-px bg-slate-300"></div>
                  <Plane className="w-5 h-5" />
                  <div className="w-16 h-px bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                  <Clock className="w-3 h-3" />
                  {flight.duration}
                </div>
              </div>

              <div className="flex-1 text-right">
                <div className="text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)]">{flight.arrival_time}</div>
                <div className="text-lg text-[#94A3B8]">{flight.destination}</div>
              </div>
              </div>

              {/* Date */}
              <div className="text-sm text-[#94A3B8]">
              {format(new Date(flight.departure_date), "EEEE, MMMM d, yyyy")}
              </div>
          </div>

          {/* Price and Action */}
          <div className="lg:border-l lg:pl-6 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
            <div className="text-right">
              <div className="text-sm text-[#A8B0BA] mb-2 leading-relaxed">{selectedClass} Class</div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EDEDED] to-[#F5F5F7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] leading-tight">${price}</div>
              <div className="text-xs text-[#A8B0BA] mt-2 leading-relaxed">
                {availableSeats} seats available
              </div>
            </div>
            <Button 
              onClick={() => onSelect(flight)}
              disabled={availableSeats === 0}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(220,38,38,0.35)] rounded-xl px-6 py-3 font-semibold whitespace-nowrap"
              size="lg"
            >
              Select Flight
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

FlightCard.displayName = "FlightCard";

export default FlightCard;