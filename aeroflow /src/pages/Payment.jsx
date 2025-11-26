import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CreditCard, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import PaymentForm from "../components/PaymentForm";

export default function Payment() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const flightId = searchParams.get("flightId");
  const selectedClass = searchParams.get("class");
  const seatNumbers = searchParams.get("seats")?.split(",") || [];

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const bookingData = JSON.parse(sessionStorage.getItem("bookingData") || "{}");

  const { data: flight, isLoading } = useQuery({
    queryKey: ["flight", flightId],
    queryFn: async () => {
      const flights = await base44.entities.Flight.filter({ id: flightId });
      return flights[0];
    },
    enabled: !!flightId,
  });

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const validatePayment = () => {
    const newErrors = {};

    const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
    if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!paymentData.cardName || paymentData.cardName.trim().length < 3) {
      newErrors.cardName = "Please enter the cardholder name";
    }

    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
      newErrors.expiry = "Please enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = paymentData.expiry.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiry = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = "Card has expired";
      }
    }

    if (!paymentData.cvv || paymentData.cvv.length !== 3 || !/^\d{3}$/.test(paymentData.cvv)) {
      newErrors.cvv = "Please enter a valid 3-digit CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Random payment failure (10% chance for demo)
      if (Math.random() < 0.1) {
        throw new Error("Payment declined. Please check your card details and try again.");
      }

      const price = selectedClass === "Business" ? flight.price_business : flight.price_economy;
      const basePrice = price * seatNumbers.length;
      
      // Get services from sessionStorage
      const services = JSON.parse(sessionStorage.getItem("services") || "{}");
      const servicesPrice = parseFloat(sessionStorage.getItem("servicesPrice") || "0");
      const baggageData = JSON.parse(sessionStorage.getItem("baggageData") || '{"additionalBags":0,"totalCost":0}');
      const baggagePrice = baggageData.totalCost || 0;
      const totalPrice = basePrice + servicesPrice + baggagePrice;

      // Create booking reference
      const bookingReference = `AFRS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create booking
      const booking = await base44.entities.Booking.create({
        user_id: user.id,
        flight_id: flightId,
        seats: seatNumbers,
        passenger_name: bookingData.name,
        passenger_email: bookingData.email,
        passenger_phone: bookingData.phone,
        passenger_passport: bookingData.passport,
        total_price: totalPrice,
        booking_reference: bookingReference,
        status: "Confirmed",
        booking_date: new Date().toISOString(),
        payment_status: "Paid",
        services: services,
        services_price: servicesPrice,
        baggage: baggageData,
        baggage_price: baggagePrice,
      });

      // Create payment record
      await base44.entities.PaymentMock.create({
        booking_id: booking.id,
        amount: totalPrice,
        card_last_four: paymentData.cardNumber.replace(/\s/g, "").slice(-4),
        payment_method: "Credit Card",
        status: "Success",
        transaction_date: new Date().toISOString(),
      });

      // Update seat status
      const seatIds = sessionStorage.getItem("seatIds")?.split(",") || [];
      for (const seatId of seatIds) {
        await base44.entities.Seat.update(seatId, {
          is_booked: true,
          booking_id: booking.id,
        });
      }

      // Update flight available seats
      const fieldToUpdate = selectedClass === "Business" ? "available_seats_business" : "available_seats_economy";
      const currentAvailable = flight[fieldToUpdate];
      await base44.entities.Flight.update(flightId, {
        [fieldToUpdate]: currentAvailable - seatNumbers.length,
      });

      // Clear session data
      sessionStorage.removeItem("bookingData");
      sessionStorage.removeItem("services");
      sessionStorage.removeItem("servicesPrice");
      sessionStorage.removeItem("baggageData");
      sessionStorage.removeItem("seatIds");

      // Navigate to confirmation
      navigate(`${createPageUrl("BookingConfirmation")}?bookingId=${booking.id}`);
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!flight || !bookingData.name) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid booking session. Please start over.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const price = selectedClass === "Business" ? flight.price_business : flight.price_economy;
  const basePrice = price * seatNumbers.length;
  const servicesPrice = parseFloat(sessionStorage.getItem("servicesPrice") || "0");
  const baggageData = JSON.parse(sessionStorage.getItem("baggageData") || '{"additionalBags":0,"totalCost":0}');
  const baggagePrice = baggageData.totalCost || 0;
  const totalPrice = basePrice + servicesPrice + baggagePrice;
  const services = JSON.parse(sessionStorage.getItem("services") || "{}");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
        disabled={isProcessing}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EDEDED] tracking-wide leading-relaxed">
                <CreditCard className="w-5 h-5 text-[#EDEDED]" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <PaymentForm
                paymentData={paymentData}
                onDataChange={setPaymentData}
                errors={errors}
              />
            </CardContent>
          </Card>

          {paymentError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          <Button
            size="lg"
            onClick={processPayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(22,163,74,0.35)] rounded-xl py-6 font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Payment ${totalPrice.toFixed(2)}
              </>
            )}
          </Button>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="text-lg text-[#EDEDED] tracking-wide leading-relaxed">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-8">
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Flight</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{flight.airline} {flight.flight_number}</p>
              </div>
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Route</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{flight.origin} → {flight.destination}</p>
              </div>
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Passenger</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{bookingData.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Seats</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{seatNumbers.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Class</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{selectedClass}</p>
              </div>
              <div className="border-t border-[#3C3C3E] pt-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#A8B0BA] leading-relaxed">Base Fare</span>
                  <span className="font-semibold text-[#EDEDED] leading-relaxed">${basePrice.toFixed(2)}</span>
                </div>
                {servicesPrice > 0 && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#A8B0BA] leading-relaxed">Services</span>
                    <span className="font-semibold text-emerald-400 leading-relaxed">+${servicesPrice.toFixed(2)}</span>
                  </div>
                )}
                {baggagePrice > 0 && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#A8B0BA] leading-relaxed">Baggage</span>
                    <span className="font-semibold text-emerald-400 leading-relaxed">+${baggagePrice.toFixed(2)}</span>
                  </div>
                )}
                {services.meals && services.meals.length > 0 && (
                  <div className="text-xs text-[#A8B0BA] mb-2 ml-4 leading-relaxed">
                    • {services.meals.map(m => m.name).join(", ")}
                  </div>
                )}
                {services.extraLegroom && (
                  <div className="text-xs text-[#A8B0BA] mb-2 ml-4 leading-relaxed">
                    • Extra Legroom
                  </div>
                )}
                {services.priorityBoarding && (
                  <div className="text-xs text-[#A8B0BA] mb-2 ml-4 leading-relaxed">
                    • Priority Boarding
                  </div>
                )}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#A8B0BA] leading-relaxed">Taxes & Fees</span>
                  <span className="font-semibold text-[#EDEDED] leading-relaxed">$0.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-[#3C3C3E]">
                  <span className="text-[#EDEDED] leading-relaxed">Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDEDED] to-[#F5F5F7] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] leading-tight">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}