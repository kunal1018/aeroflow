import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, MapPin, User, CreditCard, Download, Edit } from "lucide-react";
import { format } from "date-fns";

const BookingCard = React.memo(({ booking, flight, onViewDetails, onCancel, onDownloadTicket, onModify }) => {
  const statusColors = {
    Confirmed: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
    Completed: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const paymentStatusColors = {
    Paid: "bg-green-100 text-green-800",
    Refunded: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] hover:border-[#4C4C4E] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/3 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000">
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-[#EDEDED] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide leading-relaxed">
                    {flight.airline} {flight.flight_number}
                  </h3>
                  <Badge className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50 backdrop-blur-sm shadow-inner">
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm text-[#A8B0BA] font-mono leading-relaxed">
                  Ref: {booking.booking_reference}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#5C5C5E] mt-0.5" />
                <div>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">Route</p>
                  <p className="font-semibold text-[#EDEDED] leading-relaxed">{flight.origin} → {flight.destination}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#5C5C5E] mt-0.5" />
                <div>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">Date & Time</p>
                  <p className="font-semibold text-[#EDEDED] leading-relaxed">
                    {format(new Date(flight.departure_date), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">{flight.departure_time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#5C5C5E] mt-0.5" />
                <div>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">Passenger</p>
                  <p className="font-semibold text-[#EDEDED] leading-relaxed">{booking.passenger_name}</p>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">Seats: {booking.seats.join(", ")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[#5C5C5E] mt-0.5" />
                <div>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">Payment</p>
                  <Badge className="bg-gradient-to-r from-emerald-900/25 to-emerald-800/25 text-emerald-400 border-emerald-700/40 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]">
                    {booking.payment_status}
                  </Badge>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EDEDED] to-[#F5F5F7] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] mt-2 leading-tight">
                    ${booking.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-3 lg:justify-center">
            <Button
              variant="outline"
              onClick={() => onViewDetails(booking)}
              className="flex-1 lg:flex-none bg-gradient-to-r from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] border-[#3C3C3E] text-[#EDEDED] rounded-xl px-5 py-3"
            >
              View Details
            </Button>
            <Button
              variant="outline"
              onClick={() => onDownloadTicket(booking, flight)}
              className="flex-1 lg:flex-none bg-gradient-to-r from-blue-900/30 to-blue-800/30 hover:from-blue-800/40 hover:to-blue-700/40 border-blue-700/50 text-blue-300 rounded-xl px-5 py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              E-Ticket
            </Button>
            {booking.status === "Confirmed" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onModify(booking, flight)}
                  className="flex-1 lg:flex-none bg-gradient-to-r from-amber-900/30 to-amber-800/30 hover:from-amber-800/40 hover:to-amber-700/40 border-amber-700/50 text-amber-300 rounded-xl px-5 py-3"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modify
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onCancel(booking, flight)}
                  className="flex-1 lg:flex-none"
                >
                  Cancel Booking
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BookingCard.displayName = "BookingCard";

export default BookingCard;