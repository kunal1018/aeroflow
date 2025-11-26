import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const PassengerForm = React.memo(({ passengerData, onDataChange, errors }) => {
  const handleChange = React.useCallback((field, value) => {
    onDataChange({ ...passengerData, [field]: value });
  }, [passengerData, onDataChange]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#EDEDED] font-medium leading-relaxed">Full Name *</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={passengerData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#EDEDED] font-medium leading-relaxed">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={passengerData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#EDEDED] font-medium leading-relaxed">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            value={passengerData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passport" className="text-[#EDEDED] font-medium leading-relaxed">Passport Number *</Label>
          <Input
            id="passport"
            placeholder="A12345678"
            value={passengerData.passport || ""}
            onChange={(e) => handleChange("passport", e.target.value)}
            className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.passport ? "border-red-500" : ""}`}
          />
          {errors.passport && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.passport}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/25 to-blue-800/25 border border-blue-700/40 rounded-xl p-5">
        <p className="text-sm text-[#EDEDED] leading-relaxed">
          <strong>Important:</strong> Please ensure all passenger information matches your travel documents exactly.
        </p>
      </div>
    </div>
  );
});

PassengerForm.displayName = "PassengerForm";

export default PassengerForm;