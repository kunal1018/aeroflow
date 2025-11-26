import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Airplane3DSeatMap from "./Airplane3DSeatMap";

const SeatMap = React.memo(({ seats, selectedSeats, onSeatSelect, maxSeats = 1 }) => {
  return (
    <Card className="p-8 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.3)]">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-wide leading-relaxed">Interactive 3D Seat Map</h3>
        <p className="text-sm text-[#A8B0BA] leading-relaxed">Select your preferred seat by clicking on it in the 3D view</p>
      </div>

      <Airplane3DSeatMap
        seats={seats}
        selectedSeats={selectedSeats}
        onSeatSelect={onSeatSelect}
        maxSeats={maxSeats}
      />

      <div className="flex items-center justify-center gap-8 mt-6 text-xs bg-[#1A1A1C]/50 rounded-xl p-4 border border-[#3C3C3E]/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#A8B0BA] border border-[#3C3C3E] shadow-sm"></div>
          <span className="text-[#EDEDED] font-medium leading-relaxed">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#10B981] border border-emerald-700/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          <span className="text-[#EDEDED] font-medium leading-relaxed">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#4C4C4E] border border-[#5C5C5E] shadow-sm"></div>
          <span className="text-[#EDEDED] font-medium leading-relaxed">Occupied</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-8 pt-8 border-t border-[#3C3C3E] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h4 className="font-semibold text-[#EDEDED] mb-4 tracking-wide leading-relaxed flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            Your Selected Seats:
          </h4>
          <div className="flex flex-wrap gap-3">
            {selectedSeats.map((seat, index) => (
              <Badge 
                key={seat.id} 
                className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 text-emerald-300 border-emerald-700/50 px-4 py-2 text-sm font-semibold shadow-[0_2px_10px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all animate-in fade-in zoom-in-95 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                💺 {seat.seat_number} • {seat.seat_type}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
});

SeatMap.displayName = "SeatMap";

export default SeatMap;