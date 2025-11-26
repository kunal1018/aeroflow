import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plane, Clock, MapPin, Calendar, AlertCircle, Activity, Ticket, Bell, BellOff, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "../components/ToastContainer";
import FlightMonitor from "../components/FlightMonitor";
import AIDelayPrediction from "../components/AIDelayPrediction";

export default function FlightStatus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [watchedFlights, setWatchedFlights] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { addToast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ["flightStatus", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return { flights: [], bookings: [] };
      
      const upperSearch = searchTerm.toUpperCase();
      const isBookingReference = upperSearch.includes("AFRS-");
      
      let bookingsFound = [];
      let flightsFound = [];
      
      if (isBookingReference) {
        bookingsFound = await base44.entities.Booking.filter({
          booking_reference: upperSearch
        });
        
        if (bookingsFound.length > 0) {
          const flightIds = [...new Set(bookingsFound.map(b => b.flight_id))];
          for (const flightId of flightIds) {
            const flights = await base44.entities.Flight.filter({ id: flightId });
            if (flights[0]) flightsFound.push(flights[0]);
          }
        }
      } else {
        const allFlights = await base44.entities.Flight.list("-departure_date", 100);
        flightsFound = allFlights.filter(
          (f) =>
            f.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.destination.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      return { flights: flightsFound, bookings: bookingsFound };
    },
    enabled: !!searchTerm,
    refetchInterval: autoRefresh ? 15000 : false, // Auto-refresh every 15 seconds when enabled
  });

  // Load watched flights from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("watchedFlights");
    if (saved) {
      setWatchedFlights(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
  };

  const toggleWatch = async (flight) => {
    const isWatched = watchedFlights.includes(flight.id);
    
    if (isWatched) {
      const updated = watchedFlights.filter(id => id !== flight.id);
      setWatchedFlights(updated);
      localStorage.setItem("watchedFlights", JSON.stringify(updated));
      addToast(`Stopped watching ${flight.flight_number}`, "info");
    } else {
      const updated = [...watchedFlights, flight.id];
      setWatchedFlights(updated);
      localStorage.setItem("watchedFlights", JSON.stringify(updated));
      addToast(`Now watching ${flight.flight_number} for status changes`, "success");
      
      // Save to database if user is logged in
      if (user) {
        await base44.entities.FlightWatch.create({
          user_id: user.id,
          flight_id: flight.id,
          last_known_status: flight.status,
          notification_email: user.email,
          active: true,
        });
      }
    }
  };

  const handleStatusChange = (flight, oldStatus, newStatus) => {
    // Additional handling can be added here
    console.log(`Flight ${flight.flight_number} changed from ${oldStatus} to ${newStatus}`);
  };

  const statusColors = {
    "On Time": "bg-green-100 text-green-800 border-green-200",
    "Delayed": "bg-red-100 text-red-800 border-red-200",
    "Boarding": "bg-blue-100 text-blue-800 border-blue-200",
    "Cancelled": "bg-gray-100 text-gray-800 border-gray-200",
    "Departed": "bg-purple-100 text-purple-800 border-purple-200",
    "Arrived": "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  const statusIcons = {
    "On Time": "✓",
    "Delayed": "⚠",
    "Boarding": "→",
    "Cancelled": "✕",
    "Departed": "↑",
    "Arrived": "✓",
  };

  const flights = searchResults?.flights || [];
  const bookings = searchResults?.bookings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Flight Monitor Component */}
      <FlightMonitor
        watchedFlights={watchedFlights}
        onStatusChange={handleStatusChange}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#EDEDED] drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center gap-3 tracking-wide leading-relaxed">
              <Activity className="w-8 h-8 text-[#EDEDED]" />
              Flight Status Tracker
            </h1>
            <p className="text-[#A8B0BA] mt-3 leading-relaxed">
              Real-time flight monitoring with AI-powered delay predictions
            </p>
          </div>
          
          {searchTerm && (
            <div className="flex items-center gap-3">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => {
                  setAutoRefresh(!autoRefresh);
                  addToast(
                    autoRefresh ? "Auto-refresh disabled" : "Auto-refresh enabled - updates every 15 seconds",
                    "info"
                  );
                }}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${autoRefresh ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-transparent hover:bg-[#2C2C2E] border border-[#3C3C3E] text-[#EDEDED]"}`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? "Auto-Refreshing" : "Enable Auto-Refresh"}
              </Button>
              <Button variant="outline" onClick={() => refetch()} className="bg-transparent hover:bg-[#2C2C2E] border border-[#3C3C3E] text-[#EDEDED] rounded-xl px-4 py-2 text-sm font-medium">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Now
              </Button>
            </div>
          )}
        </div>

        {watchedFlights.length > 0 && (
          <Alert className="bg-gradient-to-r from-blue-900/25 to-blue-800/25 border-blue-700/40 rounded-xl mb-6">
            <Bell className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-[#EDEDED] leading-relaxed">
              <strong>Watching {watchedFlights.length} flight{watchedFlights.length !== 1 ? 's' : ''}</strong> - You'll receive notifications when status changes occur
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Search */}
      <Card className="mb-8 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardContent className="p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8B0BA]" />
                <Input
                  placeholder="Search by booking reference (e.g., AFRS-20251109-ABC123) or flight number (e.g., AA123) or route (e.g., JFK)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1A1A1C] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(220,38,38,0.35)] rounded-xl px-6 py-3">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="flex gap-4 text-sm text-[#A8B0BA] leading-relaxed">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#A8B0BA]" />
                <span>Booking Reference: AFRS-YYYYMMDD-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#A8B0BA]" />
                <span>Flight Number: AA123, BA456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A8B0BA]" />
                <span>Airport: JFK, LAX, LHR</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !searchTerm ? (
        <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardContent className="p-16 text-center">
            <Plane className="w-16 h-16 text-[#A8B0BA] mx-auto mb-6" />
            <p className="text-lg font-semibold text-[#EDEDED] mb-3 leading-relaxed">
              Enter a booking reference, flight number, or route to search
            </p>
            <p className="text-[#A8B0BA] leading-relaxed">
              We'll show you real-time status information with AI-powered predictions
            </p>
          </CardContent>
        </Card>
      ) : flights.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No flights found matching "{searchTerm}". Please check your search and try again.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {flights.map((flight) => {
            const associatedBooking = bookings.find(b => b.flight_id === flight.id);
            const isWatched = watchedFlights.includes(flight.id);
            
            return (
              <div key={flight.id} className="space-y-5">
                <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] hover:border-[#4C4C4E] transition-all shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] rounded-2xl">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-[#EDEDED] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-2 tracking-wide leading-relaxed">
                              {flight.airline}
                            </h3>
                            <p className="text-[#A8B0BA] leading-relaxed">{flight.flight_number}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50 backdrop-blur-sm shadow-inner">
                              <span className="mr-2">{statusIcons[flight.status]}</span>
                              {flight.status}
                            </Badge>
                            <Button
                              variant={isWatched ? "default" : "outline"}
                              size="icon"
                              onClick={() => toggleWatch(flight)}
                              title={isWatched ? "Stop watching" : "Watch for updates"}
                            >
                              {isWatched ? (
                                <Bell className="w-4 h-4" />
                              ) : (
                                <BellOff className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {associatedBooking && (
                          <Alert className="mb-4 bg-gradient-to-r from-blue-900/25 to-blue-800/25 border-blue-700/40 rounded-xl">
                            <Ticket className="h-4 w-4 text-blue-400" />
                            <AlertDescription className="text-[#EDEDED] leading-relaxed">
                              <div className="space-y-1">
                                <p><strong>Booking Reference:</strong> <span className="text-[#A8B0BA]">{associatedBooking.booking_reference}</span></p>
                                <p><strong>Passenger:</strong> <span className="text-[#A8B0BA]">{associatedBooking.passenger_name}</span></p>
                                <p><strong>Seats:</strong> <span className="text-[#A8B0BA]">{associatedBooking.seats.join(", ")}</span></p>
                                <p><strong>Status:</strong> <Badge className="ml-1 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50">{associatedBooking.status}</Badge></p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#5C5C5E] mt-1" />
                            <div>
                              <p className="text-sm text-[#A8B0BA] leading-relaxed">Route</p>
                              <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">
                                {flight.origin} → {flight.destination}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-[#5C5C5E] mt-1" />
                            <div>
                              <p className="text-sm text-[#A8B0BA] leading-relaxed">Date</p>
                              <p className="font-semibold text-[#EDEDED] leading-relaxed">
                                {format(new Date(flight.departure_date), "EEEE, MMMM d, yyyy")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#5C5C5E] mt-1" />
                            <div>
                              <p className="text-sm text-[#A8B0BA] leading-relaxed">Departure</p>
                              <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">{flight.departure_time}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#5C5C5E] mt-1" />
                            <div>
                              <p className="text-sm text-[#A8B0BA] leading-relaxed">Arrival</p>
                              <p className="font-semibold text-lg text-[#EDEDED] leading-relaxed">{flight.arrival_time}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Plane className="w-5 h-5 text-[#5C5C5E] mt-1" />
                            <div>
                              <p className="text-sm text-[#A8B0BA] leading-relaxed">Duration</p>
                              <p className="font-semibold text-[#EDEDED] leading-relaxed">{flight.duration}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Activity className="w-5 h-5 text-[#5C5C5E] mt-1" />
                            <div>
                              <p className="text-sm text-[#A8B0BA] leading-relaxed">Available Seats</p>
                              <p className="font-semibold text-[#EDEDED] leading-relaxed">
                                Economy: {flight.available_seats_economy} | Business: {flight.available_seats_business}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {flight.status === "Delayed" && (
                      <Alert className="mt-4 bg-gradient-to-r from-amber-900/25 to-amber-800/25 border-amber-700/40 rounded-xl">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <AlertDescription className="text-[#EDEDED] leading-relaxed">
                          This flight is experiencing delays. Please check with the airline for updated departure times.
                        </AlertDescription>
                      </Alert>
                    )}
                    {flight.status === "Cancelled" && (
                      <Alert className="mt-4 bg-gradient-to-r from-red-900/25 to-red-800/25 border-red-700/40 rounded-xl">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-[#EDEDED] leading-relaxed">
                          This flight has been cancelled. Please contact the airline for rebooking options.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* AI Delay Prediction */}
                <AIDelayPrediction flight={flight} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}