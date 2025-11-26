import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, AlertCircle, User } from "lucide-react";
import PassengerForm from "../components/PassengerForm";
import { format } from "date-fns";

export default function PassengerInfo() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const flightId = searchParams.get("flightId");
  const selectedClass = searchParams.get("class");
  const seatNumbers = searchParams.get("seatNumbers")?.split(",") || [];
  
  const [passengerData, setPassengerData] = useState({
    name: "",
    email: "",
    phone: "",
    passport: "",
  });
  const [errors, setErrors] = useState({});

  const { data: flight, isLoading } = useQuery({
    queryKey: ["flight", flightId],
    queryFn: async () => {
      const flights = await base44.entities.Flight.filter({ id: flightId });
      return flights[0];
    },
    enabled: !!flightId,
  });

  const validateForm = () => {
    const newErrors = {};

    if (!passengerData.name || passengerData.name.trim().length < 2) {
      newErrors.name = "Please enter a valid full name";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!passengerData.email || !emailRegex.test(passengerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[\d\s+()-]{10,}$/;
    if (!passengerData.phone || !phoneRegex.test(passengerData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!passengerData.passport || passengerData.passport.trim().length < 6) {
      newErrors.passport = "Please enter a valid passport number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      const bookingData = {
        flightId,
        class: selectedClass,
        seatNumbers: seatNumbers.join(","),
        ...passengerData,
      };
      
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      
      navigate(
        `${createPageUrl("Payment")}?flightId=${flightId}&class=${selectedClass}&seats=${seatNumbers.join(",")}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Flight not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const price = selectedClass === "Business" ? flight.price_business : flight.price_economy;
  const servicesPrice = parseFloat(sessionStorage.getItem("servicesPrice") || "0");
  const totalPrice = (price * seatNumbers.length) + servicesPrice;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Button>

      <div className="space-y-6">
        {/* Flight Summary */}
        <Card className="border border-[#3C3C3E] bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Flight</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{flight.airline} {flight.flight_number}</p>
              </div>
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Route</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{flight.origin} → {flight.destination}</p>
              </div>
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Seats</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{seatNumbers.join(", ")}</p>
              </div>
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Total</p>
                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EDEDED] to-[#F5F5F7] text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] leading-tight">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Form */}
        <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#EDEDED] tracking-wide leading-relaxed">
              <User className="w-5 h-5 text-[#EDEDED]" />
              Passenger Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <PassengerForm
              passengerData={passengerData}
              onDataChange={setPassengerData}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(220,38,38,0.35)] rounded-xl px-6 py-3 font-semibold"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}