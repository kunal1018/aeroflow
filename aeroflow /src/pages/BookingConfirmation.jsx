import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Download, Home, BookOpen, AlertCircle, Plane, MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const bookingId = searchParams.get("bookingId");

  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const bookings = await base44.entities.Booking.filter({ id: bookingId });
      return bookings[0];
    },
    enabled: !!bookingId,
  });

  const { data: flight, isLoading: flightLoading } = useQuery({
    queryKey: ["flight", booking?.flight_id],
    queryFn: async () => {
      const flights = await base44.entities.Flight.filter({ id: booking.flight_id });
      return flights[0];
    },
    enabled: !!booking?.flight_id,
  });

  const handleDownloadTicket = async () => {
    if (!booking || !flight) return;

    // Generate PDF content as HTML
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #1e3a8a;
            margin-bottom: 10px;
          }
          .ticket-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-label {
            font-weight: bold;
            color: #475569;
          }
          .info-value {
            color: #0f172a;
          }
          .booking-ref {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #eff6ff;
            border-radius: 8px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">✈️ AeroFlow</div>
          <p style="color: #64748b;">Electronic Ticket</p>
        </div>
        
        <div class="booking-ref">
          Booking Reference: ${booking.booking_reference}
        </div>
        
        <div class="ticket-info">
          <h2 style="margin-top: 0;">Flight Details</h2>
          <div class="info-row">
            <span class="info-label">Airline:</span>
            <span class="info-value">${flight.airline}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Flight Number:</span>
            <span class="info-value">${flight.flight_number}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Route:</span>
            <span class="info-value">${flight.origin} → ${flight.destination}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${format(new Date(flight.departure_date), "MMMM d, yyyy")}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Departure:</span>
            <span class="info-value">${flight.departure_time}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Arrival:</span>
            <span class="info-value">${flight.arrival_time}</span>
          </div>
        </div>
        
        <div class="ticket-info">
          <h2 style="margin-top: 0;">Passenger Information</h2>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${booking.passenger_name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${booking.passenger_email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${booking.passenger_phone}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Passport:</span>
            <span class="info-value">${booking.passenger_passport}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Seat(s):</span>
            <span class="info-value">${booking.seats.join(", ")}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Total Fare:</span>
            <span class="info-value" style="font-size: 18px; color: #2563eb;">$${booking.total_price.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an electronic ticket. Please present this at check-in.</p>
          <p>Thank you for choosing AeroFlow!</p>
          <p>© 2025 AeroFlow. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Create and download
    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AeroFlow_Ticket_${booking.booking_reference}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isLoading = bookingLoading || flightLoading;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!booking || !flight) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Booking not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1C] via-[#2C2C2E] via-50% to-[#1A1A1C] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#EDEDED] mb-3 tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">Booking Confirmed!</h1>
          <p className="text-lg text-[#A8B0BA] leading-relaxed">
            Your flight has been successfully booked
          </p>
        </div>

        {/* Booking Reference */}
        <Card className="mb-6 border border-emerald-700/40 bg-gradient-to-r from-emerald-900/25 to-emerald-800/25 rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.3)]">
          <CardContent className="p-10 text-center">
            <p className="text-sm text-[#A8B0BA] mb-3 leading-relaxed">Booking Reference</p>
            <p className="text-4xl font-bold text-emerald-400 tracking-wider mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              {booking.booking_reference}
            </p>
            <p className="text-sm text-[#A8B0BA] leading-relaxed">
              Please save this reference for your records
            </p>
          </CardContent>
        </Card>

        {/* Flight Details */}
        <Card className="mb-6 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#EDEDED] tracking-wide leading-relaxed">
              <Plane className="w-5 h-5 text-[#EDEDED]" />
              Flight Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-[#5C5C5E] mt-1" />
                  <div>
                    <p className="text-sm text-[#A8B0BA] leading-relaxed">Flight</p>
                    <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">{flight.airline} {flight.flight_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#5C5C5E] mt-1" />
                  <div>
                    <p className="text-sm text-[#A8B0BA] leading-relaxed">Route</p>
                    <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">{flight.origin} → {flight.destination}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#5C5C5E] mt-1" />
                  <div>
                    <p className="text-sm text-[#A8B0BA] leading-relaxed">Date</p>
                    <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">
                      {format(new Date(flight.departure_date), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#5C5C5E] mt-1" />
                  <div>
                    <p className="text-sm text-[#A8B0BA] leading-relaxed">Departure Time</p>
                    <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">{flight.departure_time}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger & Payment */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="text-lg text-[#EDEDED] tracking-wide leading-relaxed">Passenger Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Name</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{booking.passenger_name}</p>
              </div>
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Email</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{booking.passenger_email}</p>
              </div>
              <div>
                <p className="text-sm text-[#A8B0BA] leading-relaxed">Seats</p>
                <p className="font-semibold text-[#EDEDED] leading-relaxed">{booking.seats.join(", ")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="text-lg text-[#EDEDED] tracking-wide leading-relaxed">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <div className="flex justify-between">
                <span className="text-[#A8B0BA] leading-relaxed">Status</span>
                <span className="font-semibold text-emerald-400 leading-relaxed">{booking.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8B0BA] leading-relaxed">Total Paid</span>
                <span className="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#EDEDED] to-[#F5F5F7] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] leading-tight">
                  ${booking.total_price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A8B0BA] leading-relaxed">Booking Date</span>
                <span className="text-[#A8B0BA] leading-relaxed">
                  {format(new Date(booking.booking_date), "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            onClick={handleDownloadTicket}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(220,38,38,0.35)] rounded-xl font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Download E-Ticket
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(createPageUrl("MyBookings"))}
            className="flex-1 bg-gradient-to-r from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] border-[#3C3C3E] text-[#EDEDED] rounded-xl"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            View My Bookings
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(createPageUrl("Home"))}
            className="flex-1 bg-gradient-to-r from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] border-[#3C3C3E] text-[#EDEDED] rounded-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Important Info */}
        <Alert className="mt-6 bg-gradient-to-r from-blue-900/25 to-blue-800/25 border-blue-700/40 rounded-xl">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-[#EDEDED] leading-relaxed">
            <strong>Important:</strong> Please arrive at the airport at least 2 hours before your departure time.
            Bring a valid photo ID and your booking reference.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}