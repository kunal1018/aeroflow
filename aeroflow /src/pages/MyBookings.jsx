import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, BookOpen } from "lucide-react";
import BookingCard from "../components/BookingCard";
import { isPast, parseISO, format } from "date-fns";

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [flightToCancel, setFlightToCancel] = useState(null);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [bookingToModify, setBookingToModify] = useState(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["userBookings", user?.id],
    queryFn: async () => {
      const allBookings = await base44.entities.Booking.filter({
        user_id: user.id,
      }, "-booking_date");
      return allBookings;
    },
    enabled: !!user,
  });

  const { data: flights = [] } = useQuery({
    queryKey: ["bookingFlights"],
    queryFn: async () => {
      const flightIds = [...new Set(bookings.map((b) => b.flight_id))];
      const allFlights = await Promise.all(
        flightIds.map((id) =>
          base44.entities.Flight.filter({ id }).then((f) => f[0])
        )
      );
      return allFlights;
    },
    enabled: bookings.length > 0,
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ booking, flight }) => {
      // Update booking status
      await base44.entities.Booking.update(booking.id, {
        status: "Cancelled",
        payment_status: "Refunded",
      });

      // Release seats
      const seats = await base44.entities.Seat.filter({
        flight_id: booking.flight_id,
        booking_id: booking.id,
      });

      for (const seat of seats) {
        await base44.entities.Seat.update(seat.id, {
          is_booked: false,
          booking_id: null,
        });
      }

      // Update flight available seats
      if (seats.length > 0) {
        const seatClass = seats[0]?.seat_class;
        let fieldToUpdate = "available_seats_economy";
        if (seatClass === "Business") {
          fieldToUpdate = "available_seats_business";
        } else if (seatClass === "Premium Economy") {
          fieldToUpdate = "available_seats_premium_economy";
        } else if (seatClass === "First") {
          fieldToUpdate = "available_seats_first";
        }
        const currentAvailable = flight[fieldToUpdate];
        await base44.entities.Flight.update(flight.id, {
          [fieldToUpdate]: currentAvailable + booking.seats.length,
        });
      }

      // Update payment status
      const payments = await base44.entities.PaymentMock.filter({
        booking_id: booking.id,
      });
      if (payments[0]) {
        await base44.entities.PaymentMock.update(payments[0].id, {
          status: "Refunded",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingFlights"] });
      queryClient.invalidateQueries({ queryKey: ["allFlights"] });
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      setFlightToCancel(null);
    },
    onError: (error) => {
      console.error("Cancellation error:", error);
      alert("Failed to cancel booking. Please try again.");
    },
  });

  const handleCancelClick = (booking, flight) => {
    setBookingToCancel(booking);
    setFlightToCancel(flight);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (bookingToCancel && flightToCancel) {
      cancelMutation.mutate({ booking: bookingToCancel, flight: flightToCancel });
    }
  };

  const handleDownloadTicket = (booking, flight) => {
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
          .ticket { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 3px solid #c8102e; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #c8102e; margin-bottom: 10px; }
          .title { font-size: 24px; color: #333; margin: 10px 0; }
          .section { margin: 25px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #c8102e; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { padding: 10px; background: #f9f9f9; border-radius: 5px; }
          .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-size: 16px; color: #333; font-weight: 600; }
          .barcode { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ccc; }
          .barcode-text { font-family: monospace; font-size: 24px; letter-spacing: 3px; color: #333; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="logo">✈ AeroFlow</div>
            <div class="title">Electronic Flight Ticket</div>
          </div>

          <div class="section">
            <div class="section-title">Booking Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Booking Reference</div>
                <div class="value">${booking.booking_reference}</div>
              </div>
              <div class="info-item">
                <div class="label">Status</div>
                <div class="value">${booking.status}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Flight Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Airline</div>
                <div class="value">${flight.airline}</div>
              </div>
              <div class="info-item">
                <div class="label">Flight Number</div>
                <div class="value">${flight.flight_number}</div>
              </div>
              <div class="info-item">
                <div class="label">From</div>
                <div class="value">${flight.origin}</div>
              </div>
              <div class="info-item">
                <div class="label">To</div>
                <div class="value">${flight.destination}</div>
              </div>
              <div class="info-item">
                <div class="label">Date</div>
                <div class="value">${format(new Date(flight.departure_date), "MMMM d, yyyy")}</div>
              </div>
              <div class="info-item">
                <div class="label">Departure Time</div>
                <div class="value">${flight.departure_time}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Passenger Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Name</div>
                <div class="value">${booking.passenger_name}</div>
              </div>
              <div class="info-item">
                <div class="label">Email</div>
                <div class="value">${booking.passenger_email}</div>
              </div>
              <div class="info-item">
                <div class="label">Phone</div>
                <div class="value">${booking.passenger_phone}</div>
              </div>
              <div class="info-item">
                <div class="label">Passport</div>
                <div class="value">${booking.passenger_passport}</div>
              </div>
              <div class="info-item">
                <div class="label">Seat(s)</div>
                <div class="value">${booking.seats.join(", ")}</div>
              </div>
              <div class="info-item">
                <div class="label">Total Amount</div>
                <div class="value">$${booking.total_price.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="barcode">
            <div class="barcode-text">${booking.booking_reference}</div>
            <p style="margin-top: 10px; color: #999; font-size: 12px;">Please present this ticket at check-in</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing AeroFlow</p>
            <p>For assistance, contact support@aeroflow.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AeroFlow-Ticket-${booking.booking_reference}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleModifyClick = (booking, flight) => {
    setBookingToModify({ booking, flight });
    setModifyDialogOpen(true);
  };

  const getBookingFlight = (booking) => {
    return flights.find((f) => f?.id === booking.flight_id);
  };

  const upcomingBookings = bookings.filter((booking) => {
    const flight = getBookingFlight(booking);
    if (!flight) return false;
    const departureDate = parseISO(flight.departure_date);
    return !isPast(departureDate) && booking.status === "Confirmed";
  });

  const pastBookings = bookings.filter((booking) => {
    const flight = getBookingFlight(booking);
    if (!flight) return false;
    const departureDate = parseISO(flight.departure_date);
    return isPast(departureDate) || booking.status !== "Confirmed";
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#E5E7EB]" />
          My Bookings
        </h1>
        <p className="text-[#94A3B8] mt-2">Manage and view all your flight reservations</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Trips ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-600 mb-2">
                  No upcoming trips
                </p>
                <p className="text-slate-500">
                  Start planning your next adventure!
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => {
              const flight = getBookingFlight(booking);
              if (!flight) return null;
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  flight={flight}
                  onViewDetails={setSelectedBooking}
                  onCancel={handleCancelClick}
                  onDownloadTicket={handleDownloadTicket}
                  onModify={handleModifyClick}
                />
              );
            })
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-600 mb-2">
                  No past trips
                </p>
                <p className="text-slate-500">
                  Your travel history will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => {
              const flight = getBookingFlight(booking);
              if (!flight) return null;
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  flight={flight}
                  onViewDetails={setSelectedBooking}
                  onCancel={handleCancelClick}
                  onDownloadTicket={handleDownloadTicket}
                  onModify={handleModifyClick}
                />
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (() => {
            const flight = getBookingFlight(selectedBooking);
            if (!flight) return null;
            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Booking Reference</p>
                    <p className="font-semibold text-lg">{selectedBooking.booking_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="font-semibold">{selectedBooking.status}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Flight Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Airline</p>
                      <p className="font-semibold">{flight.airline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Flight Number</p>
                      <p className="font-semibold">{flight.flight_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Route</p>
                      <p className="font-semibold">{flight.origin} → {flight.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-semibold">{flight.departure_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Departure</p>
                      <p className="font-semibold">{flight.departure_time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Arrival</p>
                      <p className="font-semibold">{flight.arrival_time}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Passenger Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-semibold">{selectedBooking.passenger_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-semibold">{selectedBooking.passenger_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-semibold">{selectedBooking.passenger_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Passport</p>
                      <p className="font-semibold">{selectedBooking.passenger_passport}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Seat(s)</p>
                      <p className="font-semibold">{selectedBooking.seats.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Price</p>
                      <p className="font-semibold text-lg">${selectedBooking.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button onClick={() => setSelectedBooking(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Booking Dialog */}
      <Dialog open={modifyDialogOpen} onOpenChange={setModifyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modify Booking</DialogTitle>
            <DialogDescription>
              What would you like to change?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                alert("Seat change feature coming soon! Please contact support to modify your seat selection.");
                setModifyDialogOpen(false);
              }}
            >
              Change Seat Selection
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                alert("Service modification feature coming soon! Please contact support to add or modify services.");
                setModifyDialogOpen(false);
              }}
            >
              Add/Modify Services
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                alert("Passenger detail updates coming soon! Please contact support to update passenger information.");
                setModifyDialogOpen(false);
              }}
            >
              Update Passenger Details
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModifyDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              A full refund will be processed to your original payment method.
            </DialogDescription>
          </DialogHeader>
          {bookingToCancel && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                <strong>Booking:</strong> {bookingToCancel.booking_reference}
                <br />
                <strong>Refund Amount:</strong> ${bookingToCancel.total_price.toFixed(2)}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelMutation.isPending}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}