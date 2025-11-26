import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, Lock, AlertCircle } from "lucide-react";

export default function PaymentForm({ paymentData, onDataChange, errors }) {
  const handleChange = (field, value) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
    }

    // Format expiry date
    if (field === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    // Format CVV (only digits)
    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    onDataChange({ ...paymentData, [field]: formattedValue });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-[#EDEDED] font-medium leading-relaxed">Card Number *</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8B0BA]" />
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={paymentData.cardNumber || ""}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            className={`pl-10 bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.cardNumber ? "border-red-500" : ""}`}
            maxLength={19}
          />
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.cardNumber}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName" className="text-[#EDEDED] font-medium leading-relaxed">Cardholder Name *</Label>
        <Input
          id="cardName"
          placeholder="JOHN DOE"
          value={paymentData.cardName || ""}
          onChange={(e) => handleChange("cardName", e.target.value.toUpperCase())}
          className={`bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.cardName ? "border-red-500" : ""}`}
        />
        {errors.cardName && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.cardName}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expiry" className="text-[#EDEDED] font-medium leading-relaxed">Expiry Date *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8B0BA]" />
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={paymentData.expiry || ""}
              onChange={(e) => handleChange("expiry", e.target.value)}
              className={`pl-10 bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.expiry ? "border-red-500" : ""}`}
              maxLength={5}
            />
          </div>
          {errors.expiry && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.expiry}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="text-[#EDEDED] font-medium leading-relaxed">CVV *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8B0BA]" />
            <Input
              id="cvv"
              type="password"
              placeholder="123"
              value={paymentData.cvv || ""}
              onChange={(e) => handleChange("cvv", e.target.value)}
              className={`pl-10 bg-[#2C2C2E] border-[#3C3C3E] text-[#EDEDED] placeholder:text-[#7C7C7E] rounded-xl ${errors.cvv ? "border-red-500" : ""}`}
              maxLength={3}
            />
          </div>
          {errors.cvv && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-900/25 to-emerald-800/25 border border-emerald-700/40 rounded-xl p-5 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[#EDEDED]">
          <p className="font-medium mb-2 leading-relaxed">Your payment is secure</p>
          <p className="text-[#A8B0BA] leading-relaxed">All transactions are encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}