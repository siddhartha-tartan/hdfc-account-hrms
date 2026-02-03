"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, DollarSign, Loader2, Mail, MapPin, ShieldCheck, User, UserPlus } from "lucide-react";
import StepCard from "@/app/components/layout/StepCard";
import { Checkbox } from "@/components/ui/checkbox";

export default function StepCombinedDetails() {
  const { nextStep, formData, updateFormData, setNomineeEnabled, setBottomBarContent, journeySteps, currentStepIndex } = useJourney();

  const [email, setEmail] = useState(formData.email || "");
  const [fatherName, setFatherName] = useState(formData.fatherName || "");
  const [motherName, setMotherName] = useState(formData.motherName || "");
  const [maritalStatus, setMaritalStatus] = useState(formData.maritalStatus || "");
  const [currentAddress, setCurrentAddress] = useState(formData.currentAddress || "");
  const [communicationAddress, setCommunicationAddress] = useState(formData.communicationAddress || "");
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState<boolean>(!!formData.sameAsCurrentAddress);
  const [incomeRange, setIncomeRange] = useState(formData.incomeRange || "");
  const [wantsNominee, setWantsNominee] = useState<boolean>(!!formData.wantsNominee);
  const [nomineeName, setNomineeName] = useState(formData.nomineeName || "");
  const [nomineeRelation, setNomineeRelation] = useState(formData.nomineeRelation || "");
  const [nomineeDob, setNomineeDob] = useState(formData.nomineeDob || "");
  const [nomineeAddress, setNomineeAddress] = useState(formData.nomineeAddress || "");
  const [isPep, setIsPep] = useState<boolean>(!!formData.isPep);
  const [isIndianNational, setIsIndianNational] = useState<boolean>(formData.isIndianNational !== false);
  const [isTaxResidentIndiaOnly, setIsTaxResidentIndiaOnly] = useState<boolean>(formData.isTaxResidentIndiaOnly !== false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const nomineeNameRef = useRef<HTMLInputElement | null>(null);

  const prefilledNameForRelation = useCallback((rel: string) => {
    const fullName = String(formData?.name || "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const surname = parts.length >= 2 ? parts[parts.length - 1] : "";
    const last = surname ? ` ${surname}` : "";
    switch (rel) {
      case "spouse":
        return `Aarushi${last}`.trim();
      case "father":
        return `Rakesh${last}`.trim();
      case "mother":
        return `Neeta${last}`.trim();
      case "son":
        return `Ayaan${last}`.trim();
      case "daughter":
        return `Anaya${last}`.trim();
      default:
        return "";
    }
  }, [formData?.name]);

  const incomeRanges = useMemo(
    () => [
      { value: "0-5L", label: "Up to ₹5L" },
      { value: "5-10L", label: "₹5L – ₹10L" },
      { value: "10-15L", label: "₹10L – ₹15L" },
      { value: "15-25L", label: "₹15L – ₹25L" },
      { value: "25L+", label: "₹25L+" },
    ],
    []
  );

  useEffect(() => {
    if (sameAsCurrentAddress) {
      setCommunicationAddress(currentAddress);
    }
  }, [sameAsCurrentAddress, currentAddress]);

  const isFormValid =
    email &&
    fatherName &&
    motherName &&
    maritalStatus &&
    currentAddress &&
    incomeRange &&
    (sameAsCurrentAddress || communicationAddress) &&
    (!wantsNominee || (!!nomineeName && !!nomineeRelation));

  const handleContinue = useCallback(() => {
    setShowErrors(true);
    if (!isFormValid) {
      requestAnimationFrame(() => {
        const root = formRef.current ?? document;
        const el = (root as any).querySelector?.(".enterprise-input.error, textarea.enterprise-input.error");
        el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        el?.focus?.();
      });
      return;
    }
    setIsLoading(true);
    updateFormData({
      email,
      fatherName,
      motherName,
      maritalStatus,
      currentAddress,
      communicationAddress: sameAsCurrentAddress ? currentAddress : communicationAddress,
      sameAsCurrentAddress,
      incomeRange,
      wantsNominee,
      nomineeName: wantsNominee ? nomineeName : "",
      nomineeRelation: wantsNominee ? nomineeRelation : "",
      nomineeDob: wantsNominee ? nomineeDob : "",
      nomineeAddress: wantsNominee ? nomineeAddress : "",
      isPep,
      isIndianNational,
      isTaxResidentIndiaOnly,
    });
    setNomineeEnabled(wantsNominee);
    setTimeout(() => {
      setIsLoading(false);
      nextStep();
    }, 1000);
  }, [
    communicationAddress,
    currentAddress,
    email,
    fatherName,
    incomeRange,
    isFormValid,
    isIndianNational,
    isPep,
    isTaxResidentIndiaOnly,
    maritalStatus,
    motherName,
    nomineeAddress,
    nomineeDob,
    nomineeName,
    nomineeRelation,
    nextStep,
    sameAsCurrentAddress,
    setNomineeEnabled,
    updateFormData,
    wantsNominee,
  ]);

  useEffect(() => {
    if (!wantsNominee) return;
    requestAnimationFrame(() => {
      nomineeNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      nomineeNameRef.current?.focus?.();
    });
  }, [wantsNominee]);

  useEffect(() => {
    setBottomBarContent(
      <div className="w-full flex justify-end">
        <Button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || !isFormValid}
          className="btn-primary w-full md:w-[360px]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Continue</span>
              {wantsNominee && (
                <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-extrabold tracking-wide">
                  Nominee Added
                </span>
              )}
            </span>
          )}
        </Button>
      </div>
    );
  }, [handleContinue, isLoading, isFormValid, setBottomBarContent, wantsNominee]);

  return (
    <StepCard
      step={(() => {
        const total = journeySteps.length || 0;
        if (!total) return undefined;
        return `Step ${currentStepIndex + 1} of ${total}`;
      })()}
      maxWidth="2xl"
    >
      <div className="page-header">
        <h1 className="page-title">Personal Details</h1>
        <p className="page-subtitle">Confirm a few details so we can complete your account setup.</p>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleContinue();
        }}
        className="space-y-6"
      >
        {/* Contact & Family */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              readOnly
              className="enterprise-input bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="helper-text">This is prefilled from your invite.</p>
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Marital Status
            </label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger className={`enterprise-input flex items-center justify-between ${showErrors && !maritalStatus ? "error" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-[var(--radius-lg)] border-slate-200 shadow-xl p-2 bg-white">
                <SelectItem value="single" className="rounded-[var(--radius)] focus:bg-slate-50 text-sm font-semibold py-2 px-3">
                  Single
                </SelectItem>
                <SelectItem value="married" className="rounded-[var(--radius)] focus:bg-slate-50 text-sm font-semibold py-2 px-3">
                  Married
                </SelectItem>
                <SelectItem value="other" className="rounded-[var(--radius)] focus:bg-slate-50 text-sm font-semibold py-2 px-3">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {showErrors && !maritalStatus && (
              <p className="error-text">
                <AlertCircle className="w-4 h-4" />
                Please select your marital status.
              </p>
            )}
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Father’s Name
            </label>
            <Input
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className={`enterprise-input ${showErrors && !fatherName ? "error" : ""}`}
              placeholder="Full name"
            />
            {showErrors && !fatherName && (
              <p className="error-text">
                <AlertCircle className="w-4 h-4" />
                Please enter your father’s name.
              </p>
            )}
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Mother’s Name
            </label>
            <Input
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className={`enterprise-input ${showErrors && !motherName ? "error" : ""}`}
              placeholder="Full name"
            />
            {showErrors && !motherName && (
              <p className="error-text">
                <AlertCircle className="w-4 h-4" />
                Please enter your mother’s name.
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="rounded-[var(--radius-lg)] border border-gray-200 bg-white p-4 md:p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                Address
              </p>
              <p className="text-xs text-gray-600 mt-1">We’ll use this for communication and dispatches.</p>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 shrink-0 cursor-pointer select-none">
              <Checkbox
                checked={sameAsCurrentAddress}
                onCheckedChange={(v) => setSameAsCurrentAddress(v === true)}
                className="rounded-[var(--radius)] border-gray-300 data-[state=checked]:bg-[#004C8F] data-[state=checked]:border-[#004C8F]"
              />
              Same for communication
            </label>
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Current Address
            </label>
            <textarea
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
              className={`enterprise-input min-h-[88px] resize-none ${showErrors && !currentAddress ? "error" : ""}`}
              placeholder="House/Flat, Street, Locality, City, PIN"
            />
            {showErrors && !currentAddress && (
              <p className="error-text">
                <AlertCircle className="w-4 h-4" />
                Please enter your current address.
              </p>
            )}
          </div>

          {!sameAsCurrentAddress && (
            <div>
              <label className="form-label flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                Communication Address
              </label>
              <textarea
                value={communicationAddress}
                onChange={(e) => setCommunicationAddress(e.target.value)}
                className={`enterprise-input min-h-[88px] resize-none ${showErrors && !communicationAddress ? "error" : ""}`}
                placeholder="House/Flat, Street, Locality, City, PIN"
              />
              {showErrors && !communicationAddress && (
                <p className="error-text">
                  <AlertCircle className="w-4 h-4" />
                  Please enter your communication address.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Income + Nominee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              Annual Income Range
            </label>
            <Select value={incomeRange} onValueChange={setIncomeRange}>
              <SelectTrigger className={`enterprise-input flex items-center justify-between ${showErrors && !incomeRange ? "error" : ""}`}>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent className="rounded-[var(--radius-lg)] border-slate-200 shadow-xl p-2 bg-white">
                {incomeRanges.map((r) => (
                  <SelectItem
                    key={r.value}
                    value={r.value}
                    className="rounded-[var(--radius)] focus:bg-slate-50 text-sm font-semibold py-2 px-3"
                  >
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showErrors && !incomeRange && (
              <p className="error-text">
                <AlertCircle className="w-4 h-4" />
                Please select an income range.
              </p>
            )}
          </div>

          <div className="rounded-[var(--radius-lg)] border border-gray-200 bg-white p-4 md:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  Nominee <span className="text-gray-500 font-medium">(Optional)</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Add nominee details now. It takes under a minute.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 shrink-0 cursor-pointer select-none">
                <Checkbox
                  checked={wantsNominee}
                  onCheckedChange={(v) => {
                    const enabled = v === true;
                    setWantsNominee(enabled);
                    if (!enabled) {
                      setNomineeName("");
                      setNomineeRelation("");
                      setNomineeDob("");
                      setNomineeAddress("");
                    }
                  }}
                  className="rounded-[var(--radius)] border-gray-300 data-[state=checked]:bg-[#004C8F] data-[state=checked]:border-[#004C8F]"
                />
                <span className={wantsNominee ? "text-emerald-700" : "text-gray-700"}>
                  {wantsNominee ? "Added" : "Add"}
                </span>
              </label>
            </div>

            {wantsNominee && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="form-label flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-slate-400" />
                    Nominee’s Full Name
                  </label>
                  <Input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    ref={nomineeNameRef}
                    className={`enterprise-input ${showErrors && !nomineeName ? "error" : ""}`}
                    placeholder="Enter full name"
                  />
                  {showErrors && !nomineeName && (
                    <p className="error-text">
                      <AlertCircle className="w-4 h-4" />
                      Please enter nominee name.
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-slate-400" />
                    Relationship
                  </label>
                  <Select
                    value={nomineeRelation}
                    onValueChange={(val) => {
                      setNomineeRelation(val);
                      const suggested = prefilledNameForRelation(val);
                      if (suggested) setNomineeName(suggested);
                    }}
                  >
                    <SelectTrigger className={`enterprise-input flex items-center justify-between ${showErrors && !nomineeRelation ? "error" : ""}`}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[var(--radius-lg)] border-slate-200 shadow-xl p-2 bg-white">
                      {[
                        { value: "spouse", label: "Spouse" },
                        { value: "father", label: "Father" },
                        { value: "mother", label: "Mother" },
                        { value: "son", label: "Son" },
                        { value: "daughter", label: "Daughter" },
                      ].map((o) => (
                        <SelectItem
                          key={o.value}
                          value={o.value}
                          className="rounded-[var(--radius)] focus:bg-slate-50 text-sm font-semibold py-2 px-3"
                        >
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && !nomineeRelation && (
                    <p className="error-text">
                      <AlertCircle className="w-4 h-4" />
                      Please select a relationship.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Nominee Date of Birth</label>
                    <Input
                      type="date"
                      value={nomineeDob}
                      onChange={(e) => setNomineeDob(e.target.value)}
                      className="enterprise-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Nominee Address</label>
                    <Input
                      type="text"
                      value={nomineeAddress}
                      onChange={(e) => setNomineeAddress(e.target.value)}
                      className="enterprise-input"
                      placeholder="House/Flat, Street, City, PIN"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regulatory declarations (mandatory) */}
        <div className="rounded-[var(--radius-lg)] border border-gray-200 bg-white p-4 md:p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Regulatory Declarations
            </p>
            <p className="text-xs text-gray-600 mt-1">As per RBI/Compliance requirements, please confirm the below.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Are you a Politically Exposed Person (PEP)?",
                value: isPep,
                setValue: setIsPep,
                key: "isPep",
              },
              {
                label: "Are you an Indian national?",
                value: isIndianNational,
                setValue: setIsIndianNational,
                key: "isIndianNational",
              },
              {
                label: "Are you a Tax Resident of India only?",
                value: isTaxResidentIndiaOnly,
                setValue: setIsTaxResidentIndiaOnly,
                key: "isTaxResidentIndiaOnly",
              },
            ].map((q) => (
              <div key={q.key} className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-800">{q.label}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => q.setValue(false)}
                    className={[
                      "h-8 px-3 rounded-[999px] text-xs font-semibold border transition-colors",
                      q.value === false ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => q.setValue(true)}
                    className={[
                      "h-8 px-3 rounded-[999px] text-xs font-semibold border transition-colors",
                      q.value === true ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    Yes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </StepCard>
  );
}
