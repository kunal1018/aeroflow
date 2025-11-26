import React, { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "./ToastContainer";

export default function FlightMonitor({ watchedFlights, onStatusChange }) {
  const { addToast } = useToast();
  const previousStatusesRef = useRef({});

  const { data: flights = [] } = useQuery({
    queryKey: ["monitoredFlights", watchedFlights],
    queryFn: async () => {
      if (!watchedFlights || watchedFlights.length === 0) return [];
      const flightData = await Promise.all(
        watchedFlights.map(async (flightId) => {
          const results = await base44.entities.Flight.filter({ id: flightId });
          return results[0];
        })
      );
      return flightData.filter(Boolean);
    },
    enabled: watchedFlights && watchedFlights.length > 0,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  useEffect(() => {
    flights.forEach((flight) => {
      if (!flight) return;
      
      const previousStatus = previousStatusesRef.current[flight.id];
      
      if (previousStatus && previousStatus !== flight.status) {
        // Status changed - notify user
        const statusEmoji = {
          "On Time": "✅",
          "Delayed": "⚠️",
          "Boarding": "🚪",
          "Cancelled": "❌",
          "Departed": "✈️",
          "Arrived": "🛬",
        };

        addToast(
          `${statusEmoji[flight.status]} Flight ${flight.flight_number} status changed: ${previousStatus} → ${flight.status}`,
          flight.status === "Delayed" || flight.status === "Cancelled" ? "warning" : "info",
          8000
        );

        if (onStatusChange) {
          onStatusChange(flight, previousStatus, flight.status);
        }
      }
      
      previousStatusesRef.current[flight.id] = flight.status;
    });
  }, [flights, addToast, onStatusChange]);

  return null; // This is a utility component with no UI
}