import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Loader2, TrendingUp, Cloud, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIDelayPrediction({ flight }) {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePrediction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the flight from ${flight.origin} to ${flight.destination} scheduled for ${flight.departure_date} at ${flight.departure_time}. 
        
        Provide a detailed prediction about potential delays or issues based on:
        1. Current weather conditions at both airports
        2. Historical delay patterns for this route
        3. Air traffic congestion
        4. Time of day and seasonal factors
        
        Format the response as JSON with:
        - delay_likelihood: "Low", "Medium", or "High"
        - predicted_delay_minutes: estimated delay in minutes (0 if none expected)
        - confidence_score: 0-100 percentage
        - factors: array of contributing factors
        - recommendation: brief advice for passengers`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            delay_likelihood: {
              type: "string",
              enum: ["Low", "Medium", "High"]
            },
            predicted_delay_minutes: {
              type: "number"
            },
            confidence_score: {
              type: "number"
            },
            factors: {
              type: "array",
              items: { type: "string" }
            },
            recommendation: {
              type: "string"
            }
          }
        }
      });

      setPrediction(result);
    } catch (err) {
      setError("Unable to generate prediction. Please try again later.");
      console.error("AI Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const likelihoodColors = {
    Low: "bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 text-emerald-400 border-emerald-700/50",
    Medium: "bg-gradient-to-r from-amber-900/30 to-amber-800/30 text-amber-400 border-amber-700/50",
    High: "bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-400 border-red-700/50",
  };

  return (
    <Card className="bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] border-[#3C3C3E] rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.3)]">
      <CardHeader className="bg-gradient-to-r from-amber-900/20 via-[#3C3C3E]/80 to-amber-900/20 border-b border-amber-700/30 rounded-t-2xl">
        <CardTitle className="flex items-center gap-3 text-xl text-[#EDEDED] tracking-wide leading-relaxed">
          <div className="p-3 bg-gradient-to-br from-amber-800/30 via-amber-700/20 to-amber-800/30 rounded-xl border border-amber-700/30 shadow-[0_4px_12px_rgba(217,119,6,0.15)]">
            <Brain className="w-5 h-5 text-[#D97706]" />
          </div>
          AI-Powered Delay Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {!prediction && !isLoading && (
          <div className="text-center py-8">
            <Cloud className="w-16 h-16 text-[#D97706] mx-auto mb-4" />
            <p className="text-[#A8B0BA] mb-6 text-lg leading-relaxed">
              Get AI-powered insights about potential delays based on real-time weather, air traffic, and historical data
            </p>
            <Button
              onClick={generatePrediction}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-[0_4px_15px_rgba(217,119,6,0.4)] border border-amber-500/50 rounded-xl px-6 py-3 font-semibold"
            >
              <Brain className="w-5 h-5 mr-2" />
              Generate Prediction
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10">
            <Loader2 className="w-16 h-16 text-[#D97706] animate-spin mx-auto mb-4" />
            <p className="text-[#EDEDED] text-lg font-medium leading-relaxed">Analyzing flight conditions...</p>
            <p className="text-sm text-[#A8B0BA] mt-2 leading-relaxed">
              Checking weather, air traffic, and historical patterns
            </p>
          </div>
        )}

        {error && (
          <Alert className="bg-gradient-to-r from-red-900/25 to-red-800/25 border-red-700/40 rounded-xl">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-[#EDEDED] leading-relaxed">{error}</AlertDescription>
          </Alert>
        )}

        {prediction && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A8B0BA] mb-2 leading-relaxed">Delay Likelihood</p>
                <Badge className={`${likelihoodColors[prediction.delay_likelihood]} text-lg px-5 py-2 rounded-xl font-bold shadow-inner`}>
                  {prediction.delay_likelihood}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#A8B0BA] mb-2 leading-relaxed">Confidence</p>
                <p className="text-3xl font-bold text-[#D97706] leading-tight">
                  {prediction.confidence_score}%
                </p>
              </div>
            </div>

            {prediction.predicted_delay_minutes > 0 && (
              <Alert className="bg-gradient-to-r from-amber-900/25 to-amber-800/25 border-amber-700/40 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-[#EDEDED] leading-relaxed">
                  <strong>Predicted Delay:</strong> Approximately {prediction.predicted_delay_minutes} minutes
                </AlertDescription>
              </Alert>
            )}

            <div>
              <p className="text-sm font-semibold text-[#EDEDED] mb-3 flex items-center gap-2 leading-relaxed">
                <TrendingUp className="w-4 h-4 text-[#D97706]" />
                Contributing Factors:
              </p>
              <ul className="space-y-2">
                {prediction.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-[#A8B0BA] flex items-start gap-2 leading-relaxed">
                    <span className="text-[#D97706] mt-1 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Alert className="bg-gradient-to-r from-blue-900/25 to-blue-800/25 border-blue-700/40 rounded-xl">
              <AlertDescription className="text-[#EDEDED] leading-relaxed">
                <strong>Recommendation:</strong> {prediction.recommendation}
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              onClick={generatePrediction}
              className="w-full bg-transparent hover:bg-[#2C2C2E] border border-[#3C3C3E] text-[#EDEDED] rounded-xl py-6"
            >
              Refresh Prediction
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}