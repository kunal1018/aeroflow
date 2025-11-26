import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Shield, Clock, Award, Radio } from "lucide-react";
import FlightSearchForm from "../components/FlightSearchForm";
import LiveFlightFeed from "../components/LiveFlightFeed";

export default function Home() {
  const features = [
    {
      icon: Plane,
      title: "Wide Network",
      description: "Access to flights across major global destinations",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your data and payments are protected with us",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "We're here to help anytime you need assistance",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive fares and exclusive deals",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1C] via-[#2C2C2E] via-50% to-[#1A1A1C]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1A1A1C] via-[#2C2C2E] to-[#1A1A1C] text-[#EDEDED] overflow-hidden min-h-[700px] flex items-center border-b border-[#3C3C3E]/50 rounded-b-3xl shadow-[inset_0_-80px_80px_-40px_rgba(0,0,0,0.25)]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1C]/95 via-[#2C2C2E]/90 to-[#1A1A1C]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(217,119,6,0.05),transparent_60%)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Text */}
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-[#EDEDED] drop-shadow-[0_4px_15px_rgba(0,0,0,0.3)] tracking-wide" style={{lineHeight: '1.2'}}>
                Fly Beyond
                <span className="block text-[#D97706]">Expectations</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#A8B0BA] mb-10 leading-relaxed" style={{lineHeight: '1.6'}}>
                Discover seamless travel experiences with unbeatable fares and premium service
              </p>
              <div className="flex flex-wrap gap-5">
                <div className="relative bg-gradient-to-br from-amber-900/25 via-amber-800/15 to-amber-900/25 rounded-2xl px-8 py-4 border border-amber-700/30 shadow-[0_4px_20px_rgba(245,158,11,0.15)] backdrop-blur-sm">
                  <p className="text-3xl font-bold text-[#D97706] leading-tight">500K+</p>
                  <p className="text-sm text-amber-200/80 leading-relaxed mt-1">Happy Travelers</p>
                </div>
                <div className="relative bg-gradient-to-br from-amber-900/25 via-amber-800/15 to-amber-900/25 rounded-2xl px-8 py-4 border border-amber-700/30 shadow-[0_4px_20px_rgba(245,158,11,0.15)] backdrop-blur-sm">
                  <p className="text-3xl font-bold text-[#D97706] leading-tight">150+</p>
                  <p className="text-sm text-amber-200/80 leading-relaxed mt-1">Destinations</p>
                </div>
              </div>
            </div>

            {/* Right: Search Card */}
            <Card className="relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-amber-700/30 z-10 rounded-2xl backdrop-blur-md bg-gradient-to-br from-[#2C2C2E]/95 via-[#3C3C3E]/95 to-[#2C2C2E]/95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-amber-400/5 before:to-transparent before:pointer-events-none">
              <CardHeader className="bg-gradient-to-r from-amber-900/20 via-[#3C3C3E]/80 to-amber-900/20 border-b border-amber-700/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)] rounded-t-2xl">
                <CardTitle className="flex items-center gap-3 text-2xl text-[#EDEDED] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] leading-relaxed tracking-wide">
                  <div className="relative p-3 bg-gradient-to-br from-amber-800/30 via-amber-700/20 to-amber-800/30 rounded-xl border border-amber-700/30 shadow-[0_4px_12px_rgba(245,158,11,0.15)]">
                    <Plane className="w-6 h-6 text-[#D97706]" />
                  </div>
                  Find Your Flight
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 md:p-10 bg-gradient-to-br from-[#1A1A1C] via-[#2C2C2E] to-[#1A1A1C]">
                <FlightSearchForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Live Flight Feed Section */}
      <div className="py-16 bg-gradient-to-b from-[#1A1A1C] to-[#2C2C2E] relative border-b border-[#3C3C3E]/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#EDEDED] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] mb-4 tracking-wide leading-tight flex items-center justify-center gap-3">
              <Radio className="w-8 h-8 text-amber-500 animate-pulse" />
              Live Departures
            </h2>
            <p className="text-lg text-[#A8B0BA] leading-relaxed">
              Real-time flight information • Updated every 15 seconds
            </p>
          </div>
          <LiveFlightFeed />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 md:py-28 bg-gradient-to-b from-[#2C2C2E] via-[#1A1A1C] to-[#2C2C2E] relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{backgroundImage: "url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1920&q=80')"}}></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#EDEDED] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] mb-6 tracking-wide leading-tight">
              Why AeroFlow?
            </h2>
            <p className="text-xl text-[#A8B0BA] max-w-2xl mx-auto leading-relaxed">
              Premium service meets unbeatable value
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {features.map((feature, index) => {
              return (
              <div
                key={index}
                className="relative p-10 rounded-3xl bg-gradient-to-br from-amber-900/20 via-amber-800/15 to-amber-900/20 hover:from-[#3C3C3E] hover:to-[#4C4C4E] transition-all duration-300 group border border-amber-700/30 shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] backdrop-blur-sm"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative w-18 h-18 p-4 bg-gradient-to-br from-amber-800/40 to-amber-700/30 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.35)] border border-amber-700/30">
                    <feature.icon className="w-8 h-8 text-[#D97706]" />
                  </div>
                </div>
                <div className="mt-10 text-center relative z-10">
                  <h3 className="text-xl font-bold text-[#EDEDED] mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] tracking-wide leading-relaxed">
                    {feature.title}
                  </h3>
                  <p className="text-[#A8B0BA] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                </div>
                );
                })}
                </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-[#1A1A1C] via-[#2C2C2E] to-[#1A1A1C] text-[#EDEDED] py-24 border-t border-[#3C3C3E]/50 rounded-t-3xl overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1C]/90 via-[#2C2C2E]/85 to-[#1A1A1C]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.06),transparent_70%)]"></div>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-[#EDEDED] drop-shadow-[0_4px_15px_rgba(0,0,0,0.3)] tracking-wide leading-tight">
              Start Your Adventure Today
            </h2>
            <p className="text-xl text-[#A8B0BA] mb-10 max-w-3xl mx-auto leading-relaxed">
              Join our global community of explorers and experience travel like never before
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="relative bg-gradient-to-br from-amber-900/20 via-amber-800/15 to-amber-900/20 rounded-3xl p-10 border border-amber-700/30 hover:border-amber-600/50 transition-all shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="text-5xl font-black mb-4 text-[#D97706] leading-tight">500K+</div>
              <div className="text-lg font-semibold text-amber-200/80 leading-relaxed">Happy Passengers</div>
            </div>
            <div className="relative bg-gradient-to-br from-amber-900/20 via-amber-800/15 to-amber-900/20 rounded-3xl p-10 border border-amber-700/30 hover:border-amber-600/50 transition-all shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="text-5xl font-black mb-4 text-[#D97706] leading-tight">1000+</div>
              <div className="text-lg font-semibold text-amber-200/80 leading-relaxed">Daily Flights</div>
            </div>
            <div className="relative bg-gradient-to-br from-amber-900/20 via-amber-800/15 to-amber-900/20 rounded-3xl p-10 border border-amber-700/30 hover:border-amber-600/50 transition-all shadow-[0_6px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="text-5xl font-black mb-4 text-[#D97706] leading-tight">150+</div>
              <div className="text-lg font-semibold text-amber-200/80 leading-relaxed">Destinations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}