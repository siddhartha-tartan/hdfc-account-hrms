/* src/app/context/stepDefinitions.ts */

import StepWelcome from "@/app/components/steps/StepWelcome";
import StepJourneySelection from "@/app/components/steps/StepJourneySelection";
import StepCombinedDetails from "@/app/components/steps/StepCombinedDetails";
import StepKycChoice from "@/app/components/steps/StepKycChoice";
import StepContactDetails from "@/app/components/steps/StepContactDetails";
import StepKycDetails from "@/app/components/steps/StepKycDetails";
import StepComplete from "@/app/components/steps/StepComplete";
import StepVideoKyc from "@/app/components/steps/StepVideoKyc";
import StepEkycHandler from "@/app/components/steps/StepEkycHandler";
import StepPhysicalKyc from "@/app/components/steps/StepPhysicalKyc";
import StepAccountConversion from "@/app/components/steps/StepAccountConversion";
import StepProfessionalDetailsExpress from "@/app/components/steps/StepProfessionalDetailsExpress";
import StepReviewApplication from "@/app/components/steps/StepReviewApplication";
import StepIncomeDetails from "@/app/components/steps/StepIncomeDetails";
import StepNomineeDetails from "@/app/components/steps/StepNomineeDetails";
import StepAutoConversion from "@/app/components/steps/StepAutoConversion";

import StepLoanOffer from "@/app/components/steps/StepLoanOffer";

export type UserType = "ntb" | "etb-nk" | "etb";
export type JourneyType = "ntb" | "etb-nk" | "etb" | "journey2";

export interface Step {
  id: string;
  title: string;
}

export const ALL_STEPS: Record<string, Step> = {
  journeySelection: { id: "journeySelection", title: "Select Journey" },
  welcome: { id: "welcome", title: "Verification" },
  kycChoice: { id: "kycChoice", title: "Select KYC" },
  ekycHandler: { id: "ekycHandler", title: "e-KYC Verification" },
  physicalKyc: { id: "physicalKyc", title: "Physical KYC" },
  profileDetails: { id: "profileDetails", title: "Your Profile" },
  autoConversion: { id: "autoConversion", title: "Account Conversion" },
  incomeDetails: { id: "incomeDetails", title: "Income & Account" },
  nomineeDetails: { id: "nomineeDetails", title: "Nominee Details" },
  reviewApplication: { id: "reviewApplication", title: "Final Verification" },
  kycDetails: { id: "kycDetails", title: "VKYC Consent" },
  videoKyc: { id: "videoKyc", title: "Video KYC" },
  accountConversion: { id: "accountConversion", title: "Verify Details" },
  professionalDetailsExpress: { id: "professionalDetailsExpress", title: "Your Profile" },
  complete: { id: "complete", title: "Submitted" },
  loanOffer: { id: "loanOffer", title: "Loan Offer" },
};

export const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  journeySelection: StepJourneySelection,
  welcome: StepWelcome,
  kycChoice: StepKycChoice,
  profileDetails: StepCombinedDetails,
  autoConversion: StepAutoConversion,
  incomeDetails: StepIncomeDetails,
  nomineeDetails: StepNomineeDetails,
  reviewApplication: StepReviewApplication,
  kycDetails: StepKycDetails,
  videoKyc: StepVideoKyc,
  complete: StepComplete,
  ekycHandler: StepEkycHandler,
  physicalKyc: StepPhysicalKyc,
  accountConversion: StepAccountConversion,
  professionalDetailsExpress: StepProfessionalDetailsExpress,
  loanOffer: StepLoanOffer,
};