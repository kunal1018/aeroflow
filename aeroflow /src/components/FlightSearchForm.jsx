import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AirportSearch from "./AirportSearch";

export default function FlightSearchForm() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("one-way");
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    class: "Economy",
  });
  const [errors, setErrors] = useState({});
  const [airportData, setAirportData] = useState({
    origin: null,
    destination: null,
  });

  const today = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.origin) {
      newErrors.origin = "Please select origin airport";
    }
    if (!formData.destination) {
      newErrors.destination = "Please select destination airport";
    }
    if (formData.origin === formData.destination && formData.origin) {
      newErrors.destination = "Destination must be different from origin";
    }
    
    // Validate domestic/international compatibility
    if (airportData.origin && airportData.destination) {
      const originCountry = airportData.origin.country;
      const destCountry = airportData.destination.country;
      const isDifferentCountries = originCountry !== destCountry;
      
      if (isDifferentCountries) {
        // International flight - both airports must support international
        if (airportData.origin.type === "domestic") {
          newErrors.origin = `${airportData.origin.city} airport only handles domestic flights`;
        }
        if (airportData.destination.type === "domestic") {
          newErrors.destination = `${airportData.destination.city} airport only handles domestic flights`;
        }
      }
    }
    
    if (!formData.departureDate) {
      newErrors.departureDate = "Please select departure date";
    }
    if (formData.departureDate && formData.departureDate < today) {
      newErrors.departureDate = "Departure date cannot be in the past";
    }
    if (tripType === "round-trip") {
      if (!formData.returnDate) {
        newErrors.returnDate = "Please select return date";
      }
      if (formData.returnDate && formData.departureDate && formData.returnDate < formData.departureDate) {
        newErrors.returnDate = "Return date must be after departure date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const searchParams = new URLSearchParams({
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate,
        class: formData.class,
        tripType,
        ...(tripType === "round-trip" && { returnDate: formData.returnDate }),
      });
      navigate(`${createPageUrl("SearchResults")}?${searchParams.toString()}`);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup value={tripType} onValueChange={setTripType} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="one-way" id="one-way" />
          <Label htmlFor="one-way" className="cursor-pointer font-medium text-[#EDEDED] leading-relaxed">One Way</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="round-trip" id="round-trip" />
          <Label htmlFor="round-trip" className="cursor-pointer font-medium text-[#EDEDED] leading-relaxed">Round Trip</Label>
        </div>
      </RadioGroup>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-[#EDEDED] font-medium leading-relaxed">From</Label>
          <AirportSearch
            value={formData.origin}
            onChange={(value) => handleChange("origin", value)}
            onAirportSelect={(airport) => setAirportData(prev => ({ ...prev, origin: airport }))}
            placeholder="Search origin airport or city"
            error={errors.origin}
          />
          {errors.origin && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.origin}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="text-[#EDEDED] font-medium leading-relaxed">To</Label>
          <AirportSearch
            value={formData.destination}
            onChange={(value) => handleChange("destination", value)}
            onAirportSelect={(airport) => setAirportData(prev => ({ ...prev, destination: airport }))}
            placeholder="Search destination airport or city"
            error={errors.destination}
          />
          {errors.destination && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.destination}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="departureDate" className="text-[#EDEDED] font-medium leading-relaxed">Departure Date</Label>
          <Input
            id="departureDate"
            type="date"
            min={today}
            value={formData.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
            className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.departureDate ? "border-red-500" : ""}`}
          />
          {errors.departureDate && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.departureDate}
            </p>
          )}
        </div>

        {tripType === "round-trip" && (
          <div className="space-y-2">
            <Label htmlFor="returnDate" className="text-[#EDEDED] font-medium leading-relaxed">Return Date</Label>
            <Input
              id="returnDate"
              type="date"
              min={formData.departureDate || today}
              value={formData.returnDate}
              onChange={(e) => handleChange("returnDate", e.target.value)}
              className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.returnDate ? "border-red-500" : ""}`}
            />
            {errors.returnDate && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.returnDate}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="class" className="text-[#EDEDED] font-medium leading-relaxed">Class</Label>
        <Select value={formData.class} onValueChange={(value) => handleChange("class", value)}>
          <SelectTrigger className="bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Economy">Economy</SelectItem>
            <SelectItem value="Premium Economy">Premium Economy</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="First">First Class</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the errors above before searching
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(220,38,38,0.35)] border border-red-800 rounded-xl py-6 text-lg font-semibold tracking-wide">
        Search Flights
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </form>
  );
}