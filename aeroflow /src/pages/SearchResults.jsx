import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, SlidersHorizontal, Loader2 } from "lucide-react";
import FlightCard from "../components/FlightCard";

export default function SearchResults() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const [sortBy, setSortBy] = useState("price");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const searchCriteria = {
    origin: searchParams.get("origin"),
    destination: searchParams.get("destination"),
    departureDate: searchParams.get("departureDate"),
    class: searchParams.get("class"),
    tripType: searchParams.get("tripType"),
    returnDate: searchParams.get("returnDate"),
  };

  const { data: flights = [], isLoading, refetch } = useQuery({
    queryKey: ["flights", searchCriteria.origin, searchCriteria.destination, searchCriteria.departureDate],
    queryFn: async () => {
      const results = await base44.entities.Flight.filter({
        origin: searchCriteria.origin,
        destination: searchCriteria.destination,
        departure_date: searchCriteria.departureDate,
      });
      return results;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  // Generate flights with AI if none found
  useEffect(() => {
    if (!isLoading && flights.length === 0 && !isGenerating) {
      generateFlights();
    }
  }, [isLoading, flights]);

  const generateFlights = async () => {
    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 flight options from ${searchCriteria.origin} to ${searchCriteria.destination} on ${searchCriteria.departureDate}. Mix of 1-2 direct and 3-4 connecting flights. Use real airlines (Delta, American, United, Southwest). For direct flights: is_connecting=false, total_stops=0. For connecting: is_connecting=true, include connecting_flights array with each leg (airline, flight_number, origin, destination, departure_time, arrival_time, duration, layover_duration). Price economy: domestic $150-600, international $600-1500. Premium Economy=1.5x, Business=3x, First=5x Economy.`,
        response_json_schema: {
          type: "object",
          properties: {
            flights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  airline: { type: "string" },
                  flight_number: { type: "string" },
                  departure_time: { type: "string" },
                  arrival_time: { type: "string" },
                  duration: { type: "string" },
                  price_economy: { type: "number" },
                  price_premium_economy: { type: "number" },
                  price_business: { type: "number" },
                  price_first: { type: "number" },
                  is_connecting: { type: "boolean" },
                  total_stops: { type: "number" },
                  connecting_flights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        airline: { type: "string" },
                        flight_number: { type: "string" },
                        origin: { type: "string" },
                        destination: { type: "string" },
                        departure_time: { type: "string" },
                        arrival_time: { type: "string" },
                        duration: { type: "string" },
                        layover_duration: { type: "string" }
                      }
                    }
                  }
                },
              },
            },
          },
        },
      });

      // Create flights in database
      const gates = ["A-11", "A-12", "B-10", "C-33", "F-15", "B-12", "C-12", "F-10", "F-12", "G-32"];
      
      const flightsToCreate = result.flights.map((flight, index) => ({
        ...flight,
        origin: searchCriteria.origin,
        destination: searchCriteria.destination,
        departure_date: searchCriteria.departureDate,
        status: "On Time",
        gate: gates[index % gates.length],
        is_connecting: flight.is_connecting || false,
        total_stops: flight.total_stops || 0,
        connecting_flights: flight.connecting_flights || [],
        total_seats_economy: 150,
        total_seats_premium_economy: 24,
        total_seats_business: 30,
        total_seats_first: 8,
        available_seats_economy: 150,
        available_seats_premium_economy: 24,
        available_seats_business: 30,
        available_seats_first: 8,
      }));

      const createdFlights = await base44.entities.Flight.bulkCreate(flightsToCreate);
      
      // Create seats in parallel for all flights
      await Promise.all(createdFlights.map(flight => generateSeatsForFlight(flight.id)));

      refetch();
    } catch (error) {
      console.error("Error generating flights:", error);
    }
    setIsGenerating(false);
  };

  const generateSeatsForFlight = async (flightId) => {
    const seats = [];

    // First class (rows 1-2, seats A-D)
    for (let row = 1; row <= 2; row++) {
      for (const seat of ["A", "B", "C", "D"]) {
        seats.push({
          flight_id: flightId,
          seat_number: `${row}${seat}`,
          seat_class: "First",
          seat_type: seat === "A" || seat === "D" ? "Window" : "Aisle",
          is_booked: false,
        });
      }
    }

    // Business class (rows 5-11, seats A-D)
    for (let row = 5; row <= 11; row++) {
      for (const seat of ["A", "B", "C", "D"]) {
        seats.push({
          flight_id: flightId,
          seat_number: `${row}${seat}`,
          seat_class: "Business",
          seat_type: seat === "A" || seat === "D" ? "Window" : "Aisle",
          is_booked: false,
        });
      }
    }

    // Premium Economy (rows 15-20, seats A-F)
    for (let row = 15; row <= 20; row++) {
      for (const seat of ["A", "B", "C", "D", "E", "F"]) {
        seats.push({
          flight_id: flightId,
          seat_number: `${row}${seat}`,
          seat_class: "Premium Economy",
          seat_type: seat === "A" || seat === "F" ? "Window" : seat === "C" || seat === "D" ? "Aisle" : "Middle",
          is_booked: false,
        });
      }
    }

    // Economy class (rows 25-49, seats A-F)
    for (let row = 25; row <= 49; row++) {
      for (const seat of ["A", "B", "C", "D", "E", "F"]) {
        const isExitRow = row === 30 || row === 45;
        seats.push({
          flight_id: flightId,
          seat_number: `${row}${seat}`,
          seat_class: "Economy",
          seat_type: isExitRow 
            ? "Exit Row" 
            : (seat === "A" || seat === "F" ? "Window" : seat === "C" || seat === "D" ? "Aisle" : "Middle"),
          is_booked: false,
        });
      }
    }

    await base44.entities.Seat.bulkCreate(seats);
  };

  const sortFlights = React.useCallback((flightsToSort) => {
    const sorted = [...flightsToSort];
    switch (sortBy) {
        case "price":
          return sorted.sort((a, b) => {
            const getPriceForClass = (flight) => {
              switch (searchCriteria.class) {
                case "First": return flight.price_first;
                case "Business": return flight.price_business;
                case "Premium Economy": return flight.price_premium_economy;
                default: return flight.price_economy;
              }
            };
            return getPriceForClass(a) - getPriceForClass(b);
          });
      case "departure":
        return sorted.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
      case "duration":
        return sorted.sort((a, b) => {
          const durationA = parseDuration(a.duration);
          const durationB = parseDuration(b.duration);
          return durationA - durationB;
        });
      case "stops":
        return sorted.sort((a, b) => (a.total_stops || 0) - (b.total_stops || 0));
      default:
        return sorted;
      }
      }, [sortBy, searchCriteria.class]);

      const parseDuration = React.useCallback((duration) => {
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
    }, []);

    const filterFlights = React.useCallback((flightsToFilter) => {
    if (filterStatus === "all") return flightsToFilter;
    return flightsToFilter.filter((flight) => flight.status === filterStatus);
    }, [filterStatus]);

    const processedFlights = React.useMemo(
    () => sortFlights(filterFlights(flights)),
    [flights, sortFlights, filterFlights]
    );

  const handleSelectFlight = React.useCallback((flight) => {
    navigate(`${createPageUrl("SeatSelection")}?flightId=${flight.id}&class=${searchCriteria.class}`);
  }, [navigate, searchCriteria.class]);

  if (isGenerating) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">Finding the best flights for you...</h3>
          <p className="text-slate-600">This will only take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-white">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <h1 className="text-3xl font-bold text-[#EDEDED] drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] mb-2 tracking-wide leading-relaxed">
          {searchCriteria.origin} → {searchCriteria.destination}
        </h1>
        <p className="text-[#A8B0BA] leading-relaxed">
          {searchCriteria.departureDate} • {searchCriteria.class} Class
        </p>
      </div>

      {/* Filters and Sort */}
      <Card className="mb-6 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-[#A8B0BA] leading-relaxed">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">{processedFlights.length} flights found</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="departure">Departure Time</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="stops">Number of Stops</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Flights</SelectItem>
                  <SelectItem value="On Time">On Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Boarding">Boarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight List */}
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
      ) : processedFlights.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No flights found matching your criteria. Try adjusting your search.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {processedFlights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              selectedClass={searchCriteria.class}
              onSelect={handleSelectFlight}
            />
          ))}
        </div>
      )}
    </div>
  );
}