import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend, trendUp = true, bgColor = "bg-blue-600" }) {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.3)]">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#A8B0BA] mb-3 leading-relaxed">{title}</p>
            <p className="text-3xl font-bold text-[#EDEDED] mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] leading-tight tracking-wide">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm leading-relaxed ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`${bgColor} p-4 rounded-2xl shadow-[0_3px_12px_rgba(0,0,0,0.25)]`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}