"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { MapPin, FileText } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import StepCard from "@/app/components/layout/StepCard";

export default function StepKycChoice() {
  const {
    nextStep,
    formData,
    updateFormData,
    switchToPhysicalKycFlow,
    switchToDigitalKycFlow,
    journeySteps,
  } = useJourney();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(formData.kycMethod || null);

  useEffect(() => {
    trackEvent('page_viewed', { page: 'kyc_choice' });
  }, []);

  const handleChoice = (method: "ekyc" | "physicalKyc") => {
    setSelectedMethod(method);

    updateFormData({ kycMethod: method });

    trackEvent('kyc_method_selected', { method });

    if (method === "physicalKyc") {
      // End journey immediately on this step (no next page).
      switchToPhysicalKycFlow();
    } else {
      // If the user previously chose physical KYC, the journey may have been truncated.
      // Restore the full digital flow before moving ahead.
      if (!journeySteps.some(s => s.id === "ekycHandler")) {
        switchToDigitalKycFlow();
      } else {
        nextStep();
      }
    }
  };

  return (
    <StepCard maxWidth="2xl">
      <div className="page-header">
        <h1 className="page-title">KYC Verification</h1>
        <p className="page-subtitle">Choose your preferred method to verify your identity.</p>
      </div>

      <div className="space-y-4">
        {(() => {
          const isSelected = selectedMethod === "ekyc";
          return (
            <div
              onClick={() => handleChoice("ekyc")}
              className={[
                "w-full flex items-center gap-4 p-4 md:p-5 rounded-[var(--radius-lg)] border transition-colors cursor-pointer group relative overflow-hidden",
                isSelected ? "border-[#004C8F] bg-blue-50/40" : "border-blue-100 bg-blue-50/20 hover:border-[#004C8F] hover:bg-blue-50/50",
              ].join(" ")}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <FileText className="w-6 h-6 text-[#004C8F]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-bold text-slate-900">Digital KYC via Aadhaar</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    Recommended
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    Fast
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Typically under 2 minutes. Requires Aadhaar registered mobile.</p>
              </div>
              <div className={["w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", isSelected ? "border-[#004C8F]" : "border-slate-200 group-hover:border-[#004C8F]"].join(" ")}>
                <div className={["w-3 h-3 rounded-full bg-[#004C8F] transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"].join(" ")} />
              </div>
            </div>
          );
        })()}

        {(() => {
          const isSelected = selectedMethod === "physicalKyc";
          return (
            <div
              onClick={() => handleChoice("physicalKyc")}
              className={[
                "w-full flex items-center gap-4 p-4 md:p-5 rounded-[var(--radius-lg)] border transition-colors cursor-pointer group relative overflow-hidden",
                isSelected ? "border-orange-500 bg-orange-50/40" : "border-slate-100 hover:border-blue-500 hover:bg-blue-50/50",
              ].join(" ")}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-900">Physical KYC</p>
                <p className="text-sm text-slate-500 mt-1">Complete verification at a branch or via scheduled visit.</p>
              </div>
            <div className={["w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", isSelected ? "border-orange-600" : "border-slate-200 group-hover:border-[#004C8F]"].join(" ")}>
                <div className={["w-3 h-3 rounded-full bg-orange-600 transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"].join(" ")} />
              </div>
            </div>
          );
        })()}
      </div>

      {selectedMethod === "physicalKyc" && (
        <div className="text-center">
          <button
            onClick={() => handleChoice("ekyc")}
            className="text-sm font-semibold text-[#004C8F] hover:underline"
          >
            Switch to Digital KYC (Fast • Recommended)
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 max-w-sm mx-auto">
        Verification is mandatory as per RBI guidelines. Your data is encrypted and secure.
      </p>
    </StepCard>
  );
}
