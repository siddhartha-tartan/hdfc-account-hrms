"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useJourney } from "@/app/context/JourneyContext";
import { Button } from "@/app/components/ui/button";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useBranding } from "@/app/context/BrandingContext";
import { trackEvent } from "@/lib/analytics";
import StepCard from "@/app/components/layout/StepCard";
import { Checkbox } from "@/components/ui/checkbox";

export default function StepReviewApplication() {
    const { nextStep, formData, journeySteps, currentStepIndex, setBottomBarContent } = useJourney();
    const { config } = useBranding();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        trackEvent('page_viewed', { page: 'review_application' });
    }, []);

    const handleSubmit = () => {
        if (!termsAccepted) return;

        setIsSubmitting(true);
        trackEvent('application_submitted');

        setTimeout(() => {
            setIsSubmitting(false);
            nextStep();
        }, 1500);
    };

    useEffect(() => {
        setBottomBarContent(
            <div className="w-full flex justify-end">
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !termsAccepted}
                    className="btn-primary w-full md:w-[360px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting Application...
                        </>
                    ) : (
                        <>
                            Submit Application
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        );
    }, [isSubmitting, termsAccepted, setBottomBarContent]);

    const stepLabel = useMemo(() => {
        const total = journeySteps.length || 0;
        if (!total) return undefined;
        return `Step ${currentStepIndex + 1} of ${total}`;
    }, [journeySteps.length, currentStepIndex]);

    const formatIncomeRange = (val: string | undefined) => {
        if (!val) return "—";
        const map: Record<string, string> = {
            "0-5L": "Up to ₹5L",
            "5-10L": "₹5L – ₹10L",
            "10-15L": "₹10L – ₹15L",
            "15-25L": "₹15L – ₹25L",
            "25L+": "₹25L+",
        };
        return map[val] || val;
    };

    const sections = useMemo(() => {
        const personal = [
            { label: "Full Name", value: formData.name || "—" },
            { label: "Mobile Number", value: formData.mobileNumber ? `+91 ${formData.mobileNumber}` : "—" },
            { label: "Email", value: formData.email || "—" },
            { label: "Date of Birth", value: formData.dob || "—" },
            { label: "PAN", value: formData.pan || "—" },
            { label: "Marital Status", value: formData.maritalStatus ? String(formData.maritalStatus).charAt(0).toUpperCase() + String(formData.maritalStatus).slice(1) : "—" },
            { label: "Father's Name", value: formData.fatherName || "—" },
            { label: "Mother's Name", value: formData.motherName || "—" },
        ];

        const addresses = [
            { label: "Current Address", value: formData.currentAddress || "—" },
            {
                label: "Communication Address",
                value: (formData.sameAsCurrentAddress ? formData.currentAddress : formData.communicationAddress) || "—",
            },
        ];

        const profile = [
            { label: "Annual Income Range", value: formatIncomeRange(formData.incomeRange) },
            { label: "KYC Method", value: formData.kycMethod === "physicalKyc" ? "Physical KYC" : "Digital KYC" },
        ];

        const nomineeEnabled = !!formData.wantsNominee;
        const nominee = nomineeEnabled
            ? [
                { label: "Nominee Name", value: formData.nomineeName || "—" },
                { label: "Relationship", value: formData.nomineeRelation ? String(formData.nomineeRelation).charAt(0).toUpperCase() + String(formData.nomineeRelation).slice(1) : "—" },
                { label: "Nominee DOB", value: formData.nomineeDob || "—" },
                { label: "Nominee Address", value: formData.nomineeAddress || "—" },
            ]
            : [];

        return [
            { title: "Personal & Identity", items: personal },
            { title: "Addresses", items: addresses },
            { title: "Profile", items: profile },
            ...(nomineeEnabled ? [{ title: "Nominee", items: nominee }] : []),
        ];
    }, [formData]);

    return (
        <StepCard step={stepLabel} maxWidth="2xl">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Review Your Application</h1>
                <p className="page-subtitle">
                    Please verify all details before submitting
                </p>
            </div>

            {/* Summary */}
            <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.title} className="bg-white rounded-[var(--radius-lg)] border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{section.title}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            {section.items.map((item) => (
                                <div key={item.label} className="px-5 py-4 border-t border-gray-100 md:border-t-0 md:border-r last:md:border-r-0">
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1 whitespace-pre-wrap break-words">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                        checked={termsAccepted}
                        onCheckedChange={(v) => setTermsAccepted(v === true)}
                        className="mt-0.5 rounded-[var(--radius)] border-gray-300 data-[state=checked]:bg-[#004C8F] data-[state=checked]:border-[#004C8F]"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                        I confirm that all information provided is accurate and I accept the{" "}
                        <a href="#" className="text-hdfc-blue hover:underline font-medium">
                            Terms & Conditions
                        </a>{" "}
                        of {config.name}.
                    </span>
                </label>

                {!termsAccepted && (
                    <p className="helper-text flex items-center gap-1 justify-center">
                        <AlertCircle className="w-3 h-3" />
                        Please accept the terms to submit
                    </p>
                )}
            </div>
        </StepCard>
    );
}
