import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, AlertCircle, Plane } from "lucide-react";
import SeatMap from "../components/SeatMap";
import { format } from "date-fns";

export default function SeatSelection() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const flightId = searchParams.get("flightId");
  const selectedClass = searchParams.get("class");
  
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { data: flight, isLoading: flightLoading } = useQuery({
    queryKey: ["flight", flightId],
    queryFn: async () => {
      const flights = await base44.entities.Flight.filter({ id: flightId });
      return flights[0];
    },
    enabled: !!flightId,
  });

  const { data: seats = [], isLoading: seatsLoading } = useQuery({
    queryKey: ["seats", flightId, selectedClass],
    queryFn: async () => {
      const allSeats = await base44.entities.Seat.filter({
        flight_id: flightId,
        seat_class: selectedClass,
      });
      return allSeats;
    },
    enabled: !!flightId,
  });

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    
    const seatIds = selectedSeats.map((s) => s.id).join(",");
    const seatNumbers = selectedSeats.map((s) => s.seat_number).join(",");
    
    // Store seat IDs in sessionStorage for payment page
    sessionStorage.setItem("seatIds", seatIds);
    
    navigate(
      `${createPageUrl("BaggageSelection")}?flightId=${flightId}&class=${selectedClass}&seatNumbers=${seatNumbers}`
    );
  };

  const isLoading = flightLoading || seatsLoading;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Flight not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const price = selectedClass === "Business" ? flight.price_business : flight.price_economy;
  const totalPrice = price * selectedSeats.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Results
      </Button>

      <div className="space-y-6">
        {/* Flight Summary */}
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Plane className="w-5 h-5 text-[#E5E7EB]" />
              Select Your Seats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-[#94A3B8]">Flight</p>
                <p className="text-lg font-bold text-white">
                  {flight.airline} {flight.flight_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Route</p>
                <p className="text-lg font-bold text-white">
                  {flight.origin} → {flight.destination}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Date & Time</p>
                <p className="text-lg font-bold text-white">
                  {format(new Date(flight.departure_date), "MMM d, yyyy")} • {flight.departure_time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seat Map */}
        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onSeatSelect={setSelectedSeats}
          maxSeats={5}
        />

        {/* Price Summary and Continue */}
        <Card className="sticky bottom-4 shadow-xl bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-[#3A3A3A]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#94A3B8]">
                  {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E5E7EB] to-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] hover:from-[#2A2A2A] hover:to-[#3A3A3A] border border-[#4A4A4A] text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] w-full sm:w-auto transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-500"
              >
                Continue to Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}