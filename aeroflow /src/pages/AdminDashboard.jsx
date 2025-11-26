import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plane,
  BookOpen,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  Settings,
  BarChart3,
  Clock,
  Target,
  Percent,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { format, parseISO, differenceInDays, startOfDay, subDays } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: flights = [], isLoading: flightsLoading } = useQuery({
    queryKey: ["allFlights"],
    queryFn: () => base44.entities.Flight.list("-created_date", 100),
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["allBookings"],
    queryFn: () => base44.entities.Booking.list("-booking_date", 200),
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: () => base44.entities.PaymentMock.list("-transaction_date", 200),
  });

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => base44.entities.User.list(),
  });



  const isLoading = flightsLoading || bookingsLoading || paymentsLoading || usersLoading;

  // Calculate stats
  const totalRevenue = payments
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeBookings = bookings.filter((b) => b.status === "Confirmed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;

  // Unique customers
  const uniqueCustomers = new Set(bookings.map((b) => b.user_id)).size;

  // Average booking value
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;

  // Repeat customers
  const customerBookingCount = bookings.reduce((acc, b) => {
    acc[b.user_id] = (acc[b.user_id] || 0) + 1;
    return acc;
  }, {});
  const repeatCustomers = Object.values(customerBookingCount).filter(count => count > 1).length;
  const repeatRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  // Revenue trends (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return format(date, "MMM d");
  });

  const revenueByDay = bookings.reduce((acc, booking) => {
    const date = format(parseISO(booking.booking_date), "MMM d");
    if (!acc[date]) acc[date] = { revenue: 0, bookings: 0 };
    acc[date].revenue += booking.total_price;
    acc[date].bookings += 1;
    return acc;
  }, {});

  const revenueTrendData = last30Days.map(date => ({
    date,
    revenue: Math.round(revenueByDay[date]?.revenue || 0),
    bookings: revenueByDay[date]?.bookings || 0
  }));

  // Booking lead time (days between booking and departure)
  const leadTimes = bookings
    .filter(b => b.status !== "Cancelled")
    .map(b => {
      const flight = flights.find(f => f.id === b.flight_id);
      if (!flight) return null;
      return differenceInDays(parseISO(flight.departure_date), parseISO(b.booking_date));
    })
    .filter(lt => lt !== null && lt >= 0);
  
  const avgLeadTime = leadTimes.length > 0 
    ? leadTimes.reduce((sum, lt) => sum + lt, 0) / leadTimes.length 
    : 0;

  // Revenue by class
  const revenueByClass = bookings.reduce((acc, booking) => {
    const flight = flights.find(f => f.id === booking.flight_id);
    if (!flight || booking.status === "Cancelled") return acc;
    
    // Determine class from price
    let bookingClass = "Economy";
    if (booking.total_price >= flight.price_first * booking.seats.length * 0.9) {
      bookingClass = "First";
    } else if (booking.total_price >= flight.price_business * booking.seats.length * 0.9) {
      bookingClass = "Business";
    } else if (booking.total_price >= flight.price_premium_economy * booking.seats.length * 0.9) {
      bookingClass = "Premium Economy";
    }
    
    if (!acc[bookingClass]) acc[bookingClass] = 0;
    acc[bookingClass] += booking.total_price;
    return acc;
  }, {});

  const classRevenueData = Object.entries(revenueByClass)
    .map(([className, revenue]) => ({ class: className, revenue: Math.round(revenue) }));

  // Flight status distribution
  const statusCounts = flights.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {});

  const flightStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // Seat utilization by class
  const seatUtilization = flights.reduce((acc, f) => {
    acc.economy.total += f.total_seats_economy;
    acc.economy.booked += (f.total_seats_economy - f.available_seats_economy);
    acc.business.total += f.total_seats_business;
    acc.business.booked += (f.total_seats_business - f.available_seats_business);
    acc.premiumEconomy.total += f.total_seats_premium_economy;
    acc.premiumEconomy.booked += (f.total_seats_premium_economy - f.available_seats_premium_economy);
    acc.first.total += f.total_seats_first;
    acc.first.booked += (f.total_seats_first - f.available_seats_first);
    return acc;
  }, {
    economy: { total: 0, booked: 0 },
    business: { total: 0, booked: 0 },
    premiumEconomy: { total: 0, booked: 0 },
    first: { total: 0, booked: 0 }
  });

  const utilizationData = [
    { 
      class: "Economy", 
      utilization: seatUtilization.economy.total > 0 
        ? (seatUtilization.economy.booked / seatUtilization.economy.total * 100).toFixed(1) 
        : 0 
    },
    { 
      class: "Premium Economy", 
      utilization: seatUtilization.premiumEconomy.total > 0 
        ? (seatUtilization.premiumEconomy.booked / seatUtilization.premiumEconomy.total * 100).toFixed(1) 
        : 0 
    },
    { 
      class: "Business", 
      utilization: seatUtilization.business.total > 0 
        ? (seatUtilization.business.booked / seatUtilization.business.total * 100).toFixed(1) 
        : 0 
    },
    { 
      class: "First", 
      utilization: seatUtilization.first.total > 0 
        ? (seatUtilization.first.booked / seatUtilization.first.total * 100).toFixed(1) 
        : 0 
    }
  ];

  // Top routes by booking count
  const routeBookingCount = bookings.reduce((acc, booking) => {
    const flight = flights.find(f => f.id === booking.flight_id);
    if (flight && booking.status !== "Cancelled") {
      const route = `${flight.origin}-${flight.destination}`;
      if (!acc[route]) acc[route] = { count: 0, revenue: 0 };
      acc[route].count += 1;
      acc[route].revenue += booking.total_price;
    }
    return acc;
  }, {});

  const topRoutes = Object.entries(routeBookingCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([route, data]) => ({ 
      route, 
      bookings: data.count, 
      revenue: Math.round(data.revenue) 
    }));

  // Booking status distribution
  const statusData = [
    { name: "Confirmed", value: activeBookings, color: "#10b981" },
    { name: "Cancelled", value: cancelledBookings, color: "#ef4444" },
    { name: "Completed", value: completedBookings, color: "#3b82f6" },
  ];

  // Overall load factor
  const totalSeats = flights.reduce((sum, f) => 
    sum + f.total_seats_economy + f.total_seats_business + 
    f.total_seats_premium_economy + f.total_seats_first, 0
  );
  const bookedSeats = flights.reduce((sum, f) => 
    sum + (f.total_seats_economy - f.available_seats_economy) +
    (f.total_seats_business - f.available_seats_business) +
    (f.total_seats_premium_economy - f.available_seats_premium_economy) +
    (f.total_seats_first - f.available_seats_first), 0
  );
  const loadFactor = totalSeats > 0 ? (bookedSeats / totalSeats * 100).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#E5E7EB]" />
            Dashboard
          </h1>
          <p className="text-[#94A3B8] mt-2">System overview and analytics</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("LiveFlightBoard"))}
            className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
          >
            <Plane className="w-4 h-4 mr-2" />
            Live Flight Board
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("AdminFlights"))}
          >
            <Plane className="w-4 h-4 mr-2" />
            Manage Flights
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("AdminBookings"))}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Bookings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={`Avg: $${avgBookingValue.toFixed(0)}/booking`}
          bgColor="bg-green-600"
        />
        <StatsCard
          title="Total Bookings"
          value={bookings.length}
          icon={BookOpen}
          trend={`${activeBookings} active, ${cancelledBookings} cancelled`}
          bgColor="bg-blue-600"
        />
        <StatsCard
          title="Unique Customers"
          value={uniqueCustomers}
          icon={Users}
          trend={`${repeatRate.toFixed(1)}% repeat rate`}
          bgColor="bg-purple-600"
        />
        <StatsCard
          title="Load Factor"
          value={`${loadFactor}%`}
          icon={Target}
          trend={`${bookedSeats}/${totalSeats} seats`}
          bgColor="bg-orange-600"
        />
      </div>

      {/* Tabs for Different Analytics Views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Revenue & Bookings Trend (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueTrendData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="bookings" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Routes */}
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Plane className="w-5 h-5 text-[#E5E7EB]" />
                  Top Routes by Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRoutes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="route" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Avg Lead Time</p>
                  <p className="text-2xl font-bold text-blue-700">{avgLeadTime.toFixed(0)} days</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Repeat Customers</p>
                  <p className="text-2xl font-bold text-green-700">{repeatCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Cancellation Rate</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {bookings.length > 0 ? ((cancelledBookings / bookings.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <Percent className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Flights</p>
                  <p className="text-2xl font-bold text-orange-700">{flights.length}</p>
                </div>
                <Plane className="w-8 h-8 text-orange-600 opacity-50" />
              </div>
            </Card>
          </div>

          {/* Status Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flight Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={flightStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue by Class */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Revenue by Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Routes by Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Top Routes by Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRoutes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="route" type="category" width={100} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#9333ea" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg Booking Value</p>
                  <p className="text-2xl font-bold text-slate-900">${avgBookingValue.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Revenue per Customer</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${uniqueCustomers > 0 ? (totalRevenue / uniqueCustomers).toFixed(2) : 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Seat Utilization by Class */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  Seat Utilization by Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="utilization" fill="#f97316" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Flight Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  Flight Operations Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={flightStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {flightStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={["#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#f59e0b", "#06b6d4"][index % 6]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Operations Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-slate-600 mb-2">Overall Load Factor</p>
              <p className="text-3xl font-bold text-blue-700">{loadFactor}%</p>
              <p className="text-xs text-slate-500 mt-1">{bookedSeats} / {totalSeats} seats</p>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-slate-600 mb-2">Economy Utilization</p>
              <p className="text-3xl font-bold text-green-700">
                {utilizationData.find(d => d.class === "Economy")?.utilization || 0}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {seatUtilization.economy.booked} / {seatUtilization.economy.total} seats
              </p>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <p className="text-sm text-slate-600 mb-2">Business Utilization</p>
              <p className="text-3xl font-bold text-purple-700">
                {utilizationData.find(d => d.class === "Business")?.utilization || 0}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {seatUtilization.business.booked} / {seatUtilization.business.total} seats
              </p>
            </Card>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <p className="text-sm text-slate-600 mb-2">Active Flights</p>
              <p className="text-3xl font-bold text-orange-700">
                {flights.filter(f => f.status === "On Time" || f.status === "Boarding").length}
              </p>
              <p className="text-xs text-slate-500 mt-1">of {flights.length} total</p>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-blue-700">{uniqueCustomers}</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Repeat Customers</p>
              <p className="text-3xl font-bold text-green-700">{repeatCustomers}</p>
              <p className="text-xs text-slate-500 mt-1">{repeatRate.toFixed(1)}% of total</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Avg Customer Value</p>
              <p className="text-3xl font-bold text-purple-700">
                ${uniqueCustomers > 0 ? (totalRevenue / uniqueCustomers).toFixed(0) : 0}
              </p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Avg Lead Time</p>
              <p className="text-3xl font-bold text-orange-700">{avgLeadTime.toFixed(0)} days</p>
            </Card>
          </div>

          {/* Customer Insights */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">New Customers</span>
                  <span className="text-2xl font-bold text-blue-600">{uniqueCustomers - repeatCustomers}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Returning Customers</span>
                  <span className="text-2xl font-bold text-green-600">{repeatCustomers}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Customer Retention Rate</span>
                  <span className="text-2xl font-bold text-purple-600">{repeatRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Avg Bookings per Customer</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {uniqueCustomers > 0 ? (bookings.length / uniqueCustomers).toFixed(1) : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Behavior</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Average Booking Lead Time</p>
                  <p className="text-2xl font-bold text-blue-700">{avgLeadTime.toFixed(0)} days</p>
                  <p className="text-xs text-slate-500 mt-1">Time between booking and departure</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Lifetime Value (LTV)</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${uniqueCustomers > 0 ? (totalRevenue / uniqueCustomers).toFixed(2) : 0}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Average revenue per customer</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {bookings.length > 0 ? (100 - (cancelledBookings / bookings.length * 100)).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Based on booking completion rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}