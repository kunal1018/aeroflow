import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Briefcase, ShoppingBag, AlertCircle, Plus, Minus } from "lucide-react";

export default function BaggageSelection() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const flightId = searchParams.get("flightId");
  const selectedClass = searchParams.get("class");
  
  const [additionalBags, setAdditionalBags] = useState(0);

  const { data: flight, isLoading: flightLoading } = useQuery({
    queryKey: ["flight", flightId],
    queryFn: async () => {
      const results = await base44.entities.Flight.filter({ id: flightId });
      return results[0];
    },
    enabled: !!flightId,
  });

  const { data: baggageRules = [], isLoading: rulesLoading } = useQuery({
    queryKey: ["baggageRules", flight?.airline, selectedClass],
    queryFn: async () => {
      const results = await base44.entities.BaggageRule.filter({
        airline: flight.airline,
        seat_class: selectedClass,
      });
      return results;
    },
    enabled: !!flight && !!selectedClass,
  });

  const handleContinue = () => {
    const baggageData = {
      additionalBags,
      totalCost: additionalBags * (baggageRule?.additional_checked_cost || 50),
    };
    sessionStorage.setItem("baggageData", JSON.stringify(baggageData));
    navigate(`${createPageUrl("InFlightServices")}?${searchParams.toString()}`);
  };

  const handleSkip = () => {
    sessionStorage.removeItem("baggageData");
    navigate(`${createPageUrl("InFlightServices")}?${searchParams.toString()}`);
  };

  if (flightLoading || rulesLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Flight not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const seatNumbers = JSON.parse(sessionStorage.getItem("selectedSeats") || "[]");
  const baggageRule = baggageRules[0] || {
    carry_on_included: 1,
    carry_on_weight: "7kg",
    carry_on_dimensions: "55x40x20cm",
    checked_included: selectedClass === "Economy" ? 0 : selectedClass === "Premium Economy" ? 1 : 2,
    checked_weight: "23kg",
    checked_dimensions: "158cm total",
    additional_checked_cost: 50,
    overweight_cost: 100,
  };

  const totalBaggageCost = additionalBags * baggageRule.additional_checked_cost;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#EDEDED] drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] mb-2 tracking-wide leading-relaxed">
          Baggage Selection
        </h1>
        <p className="text-[#A8B0BA] leading-relaxed">
          Review your baggage allowance and add extra bags if needed
        </p>
      </div>

      {/* Flight Summary */}
      <Card className="mb-6 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader>
          <CardTitle className="text-[#EDEDED] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Your Flight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-[#A8B0BA]">
          <p className="text-lg">
            <span className="font-semibold text-[#EDEDED]">{flight.airline} {flight.flight_number}</span>
          </p>
          <p>{flight.origin} → {flight.destination}</p>
          <p>{flight.departure_date} at {flight.departure_time}</p>
          <p>Class: <span className="text-[#EDEDED] font-semibold">{selectedClass}</span></p>
          <p>Seats: <span className="text-[#EDEDED] font-semibold">{seatNumbers.length} passenger(s)</span></p>
        </CardContent>
      </Card>

      {/* Included Baggage */}
      <Card className="mb-6 bg-gradient-to-br from-emerald-900/20 via-emerald-800/15 to-emerald-900/20 border-emerald-700/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader>
          <CardTitle className="text-[#EDEDED] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            Included in Your Ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1C]/50 rounded-xl p-4 border border-emerald-700/20">
              <h3 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Carry-On Baggage
              </h3>
              <div className="space-y-2 text-sm text-[#A8B0BA]">
                <p>✓ <span className="text-[#EDEDED]">{baggageRule.carry_on_included}</span> bag(s) included</p>
                <p>• Max weight: <span className="text-[#EDEDED]">{baggageRule.carry_on_weight}</span></p>
                <p>• Max dimensions: <span className="text-[#EDEDED]">{baggageRule.carry_on_dimensions}</span></p>
              </div>
            </div>

            <div className="bg-[#1A1A1C]/50 rounded-xl p-4 border border-emerald-700/20">
              <h3 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Checked Baggage
              </h3>
              <div className="space-y-2 text-sm text-[#A8B0BA]">
                <p>✓ <span className="text-[#EDEDED]">{baggageRule.checked_included}</span> bag(s) included</p>
                <p>• Max weight: <span className="text-[#EDEDED]">{baggageRule.checked_weight}</span></p>
                <p>• Max dimensions: <span className="text-[#EDEDED]">{baggageRule.checked_dimensions}</span></p>
              </div>
            </div>
          </div>

          {baggageRule.checked_included === 0 && (
            <Alert className="bg-amber-900/20 border-amber-700/30">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-amber-300">
                Economy class does not include checked baggage. You can add bags below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Additional Baggage */}
      <Card className="mb-6 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader>
          <CardTitle className="text-[#EDEDED] flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Additional Checked Baggage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-[#EDEDED] mb-1">Extra Checked Bags</p>
              <p className="text-sm text-[#A8B0BA]">
                ${baggageRule.additional_checked_cost} per bag • {baggageRule.checked_weight} max
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAdditionalBags(Math.max(0, additionalBags - 1))}
                disabled={additionalBags === 0}
                className="bg-[#1A1A1C] border-[#3C3C3E]"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-bold text-[#EDEDED] w-12 text-center">
                {additionalBags}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAdditionalBags(Math.min(5, additionalBags + 1))}
                disabled={additionalBags === 5}
                className="bg-[#1A1A1C] border-[#3C3C3E]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {additionalBags > 0 && (
            <Badge className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-300 border-blue-700/50">
              Total: ${totalBaggageCost}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Important Info */}
      <Alert className="mb-6 bg-blue-900/20 border-blue-700/30">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          <strong>Important:</strong> Overweight bags (over {baggageRule.checked_weight}) incur a ${baggageRule.overweight_cost} fee at check-in.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1 bg-gradient-to-r from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] border-[#3C3C3E] text-[#EDEDED] rounded-xl px-6 py-6 text-lg"
        >
          Skip - No Extra Bags
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-6 text-lg shadow-[0_4px_20px_rgba(37,99,235,0.3)]"
        >
          Continue to Services
          {totalBaggageCost > 0 && ` • +$${totalBaggageCost}`}
        </Button>
      </div>
    </div>
  );
}