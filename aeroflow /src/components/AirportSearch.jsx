import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AirportSearch({ value, onChange, onAirportSelect, placeholder, error }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Get display value
  const displayValue = selectedAirport 
    ? `${selectedAirport.city} (${selectedAirport.code})`
    : query;

  // Search airports using AI
  const searchAirports = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setAirports([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find up to 8 airports that match the search query: "${searchQuery}". Include major airports. For each airport, specify if it's "international" (handles flights between countries) or "domestic" (only domestic flights within the country). Return airport data with IATA codes, full airport names, cities, countries, and type.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            airports: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  name: { type: "string" },
                  city: { type: "string" },
                  country: { type: "string" },
                  type: { type: "string", enum: ["domestic", "international"] }
                }
              }
            }
          }
        }
      });
      
      setAirports(result.airports || []);
    } catch (error) {
      console.error("Error searching airports:", error);
      setAirports([]);
    }
    setIsLoading(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    setHighlightedIndex(0);
    
    if (!newQuery) {
      onChange("");
      setSelectedAirport(null);
      setAirports([]);
      return;
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchAirports(newQuery);
    }, 500);
  };

  const handleSelect = (airport) => {
    onChange(airport.code);
    setSelectedAirport(airport);
    if (onAirportSelect) {
      onAirportSelect(airport);
    }
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < airports.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (airports[highlightedIndex]) {
          handleSelect(airports[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A8B0BA]" />
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-10 bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${error ? "border-red-500" : ""}`}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Searching airports...
            </div>
          ) : airports.length === 0 && query.length >= 2 ? (
            <div className="px-4 py-8 text-center text-slate-500">
              No airports found. Try a different search.
            </div>
          ) : (
            airports.map((airport, index) => (
            <button
              key={airport.code}
              type="button"
              onClick={() => handleSelect(airport)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-cyan-50 transition-colors flex items-start gap-3 border-b border-slate-100 last:border-b-0 ${
                index === highlightedIndex ? "bg-cyan-50" : ""
              }`}
            >
              <MapPin className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900">
                  {airport.city}
                  <span className="ml-2 text-cyan-600 font-bold">({airport.code})</span>
                  {airport.type === "domestic" && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                      Domestic Only
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 truncate">
                  {airport.name}
                </div>
                <div className="text-xs text-slate-500">{airport.country}</div>
              </div>
            </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}