import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, AlertCircle, UtensilsCrossed, Armchair, Clock } from "lucide-react";
import { format } from "date-fns";

export default function InFlightServices() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const flightId = searchParams.get("flightId");
  const selectedClass = searchParams.get("class");
  const seatNumbers = searchParams.get("seatNumbers")?.split(",") || [];

  const [selectedMeals, setSelectedMeals] = useState([]);
  const [extraLegroom, setExtraLegroom] = useState(false);
  const [priorityBoarding, setPriorityBoarding] = useState(false);

  const { data: flight, isLoading } = useQuery({
    queryKey: ["flight", flightId],
    queryFn: async () => {
      const flights = await base44.entities.Flight.filter({ id: flightId });
      return flights[0];
    },
    enabled: !!flightId,
  });

  const mealOptions = [
    { id: "standard", name: "Standard Meal", description: "Classic airline meal with choice of chicken, beef, or vegetarian", price: 0 },
    { id: "premium", name: "Premium Meal", description: "Gourmet meal with premium ingredients and wine pairing", price: 25 },
    { id: "chicken", name: "Chicken Special", description: "Delicious grilled chicken breast with sides", price: 12 },
    { id: "halal", name: "Halal Meal", description: "Certified halal meal prepared according to Islamic guidelines", price: 18 },
    { id: "vegetarian", name: "Vegetarian Special", description: "Organic vegetarian meal with fresh ingredients", price: 15 },
    { id: "vegan", name: "Vegan Special", description: "Plant-based meal with seasonal vegetables", price: 15 },
    { id: "glutenfree", name: "Gluten-Free Meal", description: "Specially prepared gluten-free meal", price: 18 },
    { id: "kosher", name: "Kosher Meal", description: "Certified kosher meal", price: 20 },
  ];

  const extras = [
    { id: "legroom", name: "Extra Legroom", description: "Additional 4 inches of legroom for enhanced comfort", price: 35, icon: Armchair },
    { id: "priority", name: "Priority Boarding", description: "Board before general passengers and secure overhead space", price: 20, icon: Clock },
  ];

  const handleMealToggle = (mealId) => {
    if (selectedMeals.includes(mealId)) {
      setSelectedMeals(selectedMeals.filter(id => id !== mealId));
    } else {
      // Only allow one meal per person
      if (selectedMeals.length < seatNumbers.length) {
        setSelectedMeals([...selectedMeals, mealId]);
      }
    }
  };

  const handleContinue = () => {
    const services = {
      meals: selectedMeals.map(mealId => mealOptions.find(m => m.id === mealId)),
      extraLegroom,
      priorityBoarding,
    };

    const servicesPrice = 
      services.meals.reduce((sum, meal) => sum + meal.price, 0) +
      (extraLegroom ? extras[0].price : 0) +
      (priorityBoarding ? extras[1].price : 0);

    // Store in sessionStorage for later pages
    sessionStorage.setItem("services", JSON.stringify(services));
    sessionStorage.setItem("servicesPrice", servicesPrice.toString());

    navigate(
      `${createPageUrl("PassengerInfo")}?flightId=${flightId}&class=${selectedClass}&seatNumbers=${seatNumbers.join(",")}`
    );
  };

  const handleSkip = () => {
    // Clear any previous services
    sessionStorage.removeItem("services");
    sessionStorage.removeItem("servicesPrice");
    
    navigate(
      `${createPageUrl("PassengerInfo")}?flightId=${flightId}&class=${selectedClass}&seatNumbers=${seatNumbers.join(",")}`
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Flight not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const price = selectedClass === "Business" ? flight.price_business : flight.price_economy;
  const basePrice = price * seatNumbers.length;
  
  const servicesPrice = 
    selectedMeals.reduce((sum, mealId) => {
      const meal = mealOptions.find(m => m.id === mealId);
      return sum + meal.price;
    }, 0) +
    (extraLegroom ? extras[0].price : 0) +
    (priorityBoarding ? extras[1].price : 0);

  const totalPrice = basePrice + servicesPrice;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="outline"
        onClick={() => navigate(`${createPageUrl("BaggageSelection")}?${searchParams.toString()}`)}
        className="mb-6 bg-transparent hover:bg-[#2C2C2E] border border-[#3C3C3E] text-[#EDEDED] rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Baggage Selection
      </Button>

      <div className="space-y-6">
        {/* Flight Summary */}
        <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle className="text-[#EDEDED] tracking-wide leading-relaxed">
              Enhance Your Flight Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Flight</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{flight.airline} {flight.flight_number}</p>
              </div>
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Route</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{flight.origin} → {flight.destination}</p>
              </div>
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Date</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{format(new Date(flight.departure_date), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-[#A8B0BA] leading-relaxed">Seats</p>
                <p className="font-bold text-[#EDEDED] leading-relaxed">{seatNumbers.join(", ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Selection */}
        <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#EDEDED] tracking-wide leading-relaxed">
              <UtensilsCrossed className="w-5 h-5" />
              Pre-Book Your Meal
            </CardTitle>
            <p className="text-sm text-[#A8B0BA] leading-relaxed mt-2">
              Select up to {seatNumbers.length} meal{seatNumbers.length !== 1 ? 's' : ''} for your flight ({selectedMeals.length}/{seatNumbers.length} selected)
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {mealOptions.map((meal) => (
                <div
                  key={meal.id}
                  onClick={() => handleMealToggle(meal.id)}
                  className={`cursor-pointer p-5 rounded-xl border transition-all ${
                    selectedMeals.includes(meal.id)
                      ? "border-emerald-700/50 bg-gradient-to-br from-emerald-900/25 to-emerald-800/25"
                      : "border-[#3C3C3E] hover:border-[#4C4C4E] bg-gradient-to-br from-[#1A1A1C] to-[#2C2C2E]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedMeals.includes(meal.id)}
                        onCheckedChange={() => handleMealToggle(meal.id)}
                      />
                      <div>
                        <h3 className="font-semibold text-[#EDEDED] leading-relaxed">{meal.name}</h3>
                        {meal.price > 0 && (
                          <Badge className="mt-1 bg-gradient-to-r from-amber-900/30 to-amber-800/30 text-amber-400 border-amber-700/50">
                            +${meal.price}
                          </Badge>
                        )}
                        {meal.price === 0 && (
                          <Badge className="mt-1 bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50">
                            Included
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">{meal.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Extra Services */}
        <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle className="text-[#EDEDED] tracking-wide leading-relaxed">Premium Services</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {extras.map((extra) => {
                const isSelected = extra.id === "legroom" ? extraLegroom : priorityBoarding;
                const setSelected = extra.id === "legroom" ? setExtraLegroom : setPriorityBoarding;

                return (
                  <div
                    key={extra.id}
                    onClick={() => setSelected(!isSelected)}
                    className={`cursor-pointer p-5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-emerald-700/50 bg-gradient-to-br from-emerald-900/25 to-emerald-800/25"
                        : "border-[#3C3C3E] hover:border-[#4C4C4E] bg-gradient-to-br from-[#1A1A1C] to-[#2C2C2E]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#3C3C3E] to-[#2C2C2E] rounded-xl border border-[#4C4C4E]">
                          <extra.icon className="w-5 h-5 text-[#EDEDED]" />
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => setSelected(!isSelected)}
                          />
                          <div>
                            <h3 className="font-semibold text-[#EDEDED] leading-relaxed">{extra.name}</h3>
                            <p className="text-sm text-[#A8B0BA] leading-relaxed">{extra.description}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 text-amber-400 border-amber-700/50 text-base px-3 py-1">
                        +${extra.price}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Price Summary and Continue */}
        <Card className="sticky bottom-4 shadow-xl bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="space-y-1 mb-2">
                  <div className="flex items-center gap-3 text-sm text-[#A8B0BA]">
                    <span>Base fare:</span>
                    <span className="font-semibold text-[#EDEDED]">${basePrice.toFixed(2)}</span>
                  </div>
                  {servicesPrice > 0 && (
                    <div className="flex items-center gap-3 text-sm text-[#A8B0BA]">
                      <span>Services:</span>
                      <span className="font-semibold text-emerald-400">+${servicesPrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EDEDED] to-[#F5F5F7] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSkip}
                  className="bg-transparent hover:bg-[#2C2C2E] border border-[#3C3C3E] text-[#EDEDED] rounded-xl"
                >
                  Skip Services
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-[#EDEDED] shadow-[0_3px_15px_rgba(220,38,38,0.35)] rounded-xl"
                >
                  Continue to Passenger Info
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}