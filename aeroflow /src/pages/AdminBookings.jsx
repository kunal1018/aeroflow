import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function AdminBookings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: () => base44.entities.Booking.list("-booking_date", 200),
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

  const getFlightForBooking = (booking) => {
    return flights.find((f) => f?.id === booking.flight_id);
  };

  const filteredBookings = bookings.filter((booking) => {
    const flight = getFlightForBooking(booking);
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.booking_reference.toLowerCase().includes(searchLower) ||
      booking.passenger_name.toLowerCase().includes(searchLower) ||
      booking.passenger_email.toLowerCase().includes(searchLower) ||
      flight?.flight_number.toLowerCase().includes(searchLower)
    );
  });

  const exportToCSV = () => {
    const csvData = filteredBookings.map((booking) => {
      const flight = getFlightForBooking(booking);
      return {
        Reference: booking.booking_reference,
        Passenger: booking.passenger_name,
        Email: booking.passenger_email,
        Flight: flight ? `${flight.airline} ${flight.flight_number}` : "N/A",
        Route: flight ? `${flight.origin}-${flight.destination}` : "N/A",
        Seats: booking.seats.join(", "),
        Amount: booking.total_price,
        Status: booking.status,
        Date: format(new Date(booking.booking_date), "yyyy-MM-dd HH:mm"),
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => headers.map((header) => JSON.stringify(row[header])).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors = {
    Confirmed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
  };

  if (bookingsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("AdminDashboard"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Bookings</h1>
            <p className="text-slate-600 mt-2">View and search all customer bookings</p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by reference, passenger name, email, or flight number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const flight = getFlightForBooking(booking);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono font-semibold">
                        {booking.booking_reference}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.passenger_name}</p>
                          <p className="text-sm text-slate-500">{booking.passenger_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {flight ? (
                          <div>
                            <p className="font-medium">{flight.airline}</p>
                            <p className="text-sm text-slate-500">{flight.flight_number}</p>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {flight ? `${flight.origin} → ${flight.destination}` : "N/A"}
                      </TableCell>
                      <TableCell>{booking.seats.join(", ")}</TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        ${booking.total_price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {format(new Date(booking.booking_date), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No bookings found matching your search.
        </div>
      )}
    </div>
  );
}