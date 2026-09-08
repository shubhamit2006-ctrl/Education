import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Globe2,
  Send,
  HelpCircle,
  Info,
  ShieldCheck,
  Calendar,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  Phone,
  Mail,
  User,
  Briefcase,
  AlertTriangle,
  FileText,
  BadgePercent,
  Check
} from 'lucide-react';
import {
  ItalyEligibilityFormData,
  PreliminaryEligibilityStatus,
  ItalyStudyLevel
} from '../types';
import {
  calculateItalyPreliminaryEligibility,
  EligibilityResult
} from '../utils/italyEligibilityEngine';
import { submitItalyEligibilityLeadToFirestore } from '../lib/firebase';
import { BrandLogo } from './BrandLogo';

interface ItalyEligibilityAssessmentProps {
  onBackToHome: () => void;
  onOpenBookingWithDetails?: (details: string) => void;
}

const INITIAL_FORM_DATA: ItalyEligibilityFormData = {
  fullName: '',
  email: '',
  phone: '',
  studyLevel: "Master's",
  intendedField: 'Computer Science / IT',
  intendedFieldOther: '',
  intake: 'September 2026 Intake',

  completedClass12: 'Yes',
  class12Percentage: '',
  applyingDiplomaRoute: 'No',
  diplomaPercentage: '',

  bachelorsDegreeName: '',
  bachelorsSpecialisation: '',
  scoreType: 'Percentage',
  bachelorsPercentage: '',
  bachelorsCgpa: '',
  cgpaScale: '10',
  completedBachelors: 'Yes',
  latestSemesterPercentage: '',
  predictedFinalPercentage: '',
  specificItDegree: 'B.Sc Computer Science',

  hasEducationGap: 'No',
  gapYears: '',
  gapReason: 'Work experience',
  gapReasonOther: '',

  hasWorkExperience: 'No',
  workExperienceYears: '',
  jobRole: '',
  industry: 'IT / Technology',
  industryOther: '',

  ieltsStatus: 'Planning to take IELTS',
  ieltsScore: '',
  moiAvailable: 'Not sure',

  isArchitectureDesign: 'No',
  hasPortfolio: 'Can prepare one',

  availableDocuments: ['Passport', 'Class 10 marksheet', 'Class 12 marksheet'],
  documentsToArrange: '',

  scholarshipInterest: 'Yes',
  familyIncomeRange: '₹5–10 lakh',
  canProvideFinancialDocs: 'Yes',

  applicationIntent: 'Within 1 month',
  consentAgreed: true
};

const DOCUMENT_OPTIONS = [
  'Passport',
  'Class 10 marksheet',
  'Class 12 marksheet',
  'Diploma certificate/marksheet (if applicable)',
  "Bachelor's marksheets (all semesters)",
  "Bachelor's degree certificate / Provisional",
  'IELTS result scorecard',
  'Medium of Instruction (MOI) certificate',
  'Curriculum Vitae (CV / Resume)',
  'Statement of Purpose (SOP)',
  'Letters of Recommendation (LORs)',
  'Official Academic Transcript',
  'Detailed course syllabus / Curriculum',
  'Creative Portfolio (Architecture / Design)'
];

export const ItalyEligibilityAssessment: React.FC<ItalyEligibilityAssessmentProps> = ({
  onBackToHome,
  onOpenBookingWithDetails
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;
  const [formData, setFormData] = useState<ItalyEligibilityFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string>('');
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);

  // Read URL query parameters for UTM tracking
  const [trackingParams, setTrackingParams] = useState<Record<string, string>>({});

  useEffect(() => {
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tracking: Record<string, string> = {};
      if (urlParams.get('utm_source')) tracking.utmSource = urlParams.get('utm_source')!;
      if (urlParams.get('utm_medium')) tracking.utmMedium = urlParams.get('utm_medium')!;
      if (urlParams.get('utm_campaign')) tracking.utmCampaign = urlParams.get('utm_campaign')!;
      if (urlParams.get('utm_term')) tracking.utmTerm = urlParams.get('utm_term')!;
      if (urlParams.get('utm_content')) tracking.utmContent = urlParams.get('utm_content')!;
      if (urlParams.get('ref')) tracking.leadSource = urlParams.get('ref')!;
      setTrackingParams(tracking);
    } catch (e) {
      // Ignore URL parsing errors
    }
  }, []);

  const handleChange = (field: keyof ItalyEligibilityFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for that field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleToggleDocument = (docName: string) => {
    setFormData((prev) => {
      const exists = prev.availableDocuments.includes(docName);
      const nextDocs = exists
        ? prev.availableDocuments.filter((d) => d !== docName)
        : [...prev.availableDocuments, docName];
      return { ...prev, availableDocuments: nextDocs };
    });
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full legal name';
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter your contact / WhatsApp number';
      } else if (formData.phone.trim().length < 8) {
        newErrors.phone = 'Please enter a valid phone number with country code';
      }
      if (formData.intendedField === 'Other' && !formData.intendedFieldOther?.trim()) {
        newErrors.intendedFieldOther = 'Please specify your intended course / field';
      }
    }

    if (step === 2) {
      if (formData.studyLevel === "Bachelor's") {
        if (formData.applyingDiplomaRoute === 'Yes') {
          const dip = Number(formData.diplomaPercentage);
          if (isNaN(dip) || dip <= 0 || dip > 100) {
            newErrors.diplomaPercentage = 'Please enter a valid percentage between 0 and 100';
          }
        } else {
          const c12 = Number(formData.class12Percentage);
          if (isNaN(c12) || c12 <= 0 || c12 > 100) {
            newErrors.class12Percentage = 'Please enter a valid percentage between 0 and 100';
          }
        }
      } else {
        // Master's
        if (!formData.bachelorsDegreeName?.trim()) {
          newErrors.bachelorsDegreeName = "Please enter your Bachelor's degree name";
        }
        if (formData.completedBachelors === 'No, currently pursuing') {
          const latest = Number(formData.latestSemesterPercentage);
          const predicted = Number(formData.predictedFinalPercentage);
          if (isNaN(latest) || latest <= 0 || latest > 100) {
            newErrors.latestSemesterPercentage = 'Please enter a percentage between 0 and 100';
          }
          if (isNaN(predicted) || predicted <= 0 || predicted > 100) {
            newErrors.predictedFinalPercentage = 'Please enter your expected final percentage';
          }
        } else {
          if (formData.scoreType === 'CGPA') {
            const cgpa = Number(formData.bachelorsCgpa);
            if (isNaN(cgpa) || cgpa <= 0) {
              newErrors.bachelorsCgpa = 'Please enter your CGPA';
            }
          } else {
            const perc = Number(formData.bachelorsPercentage);
            if (isNaN(perc) || perc <= 0 || perc > 100) {
              newErrors.bachelorsPercentage = 'Please enter a valid percentage between 0 and 100';
            }
          }
        }
      }
    }

    if (step === 3) {
      if (formData.hasEducationGap === 'Yes') {
        const gap = Number(formData.gapYears);
        if (isNaN(gap) || gap < 0 || gap > 40) {
          newErrors.gapYears = 'Please enter valid gap years (e.g. 1, 2, 3)';
        }
        if (formData.gapReason === 'Other' && !formData.gapReasonOther?.trim()) {
          newErrors.gapReasonOther = 'Please briefly specify the reason for gap';
        }
      }
      if (formData.hasWorkExperience === 'Yes') {
        const exp = Number(formData.workExperienceYears);
        if (isNaN(exp) || exp < 0 || exp > 40) {
          newErrors.workExperienceYears = 'Please enter valid work experience years';
        }
      }
    }

    if (step === 4) {
      if (formData.ieltsStatus === 'Yes') {
        const score = Number(formData.ieltsScore);
        if (isNaN(score) || score < 0 || score > 9) {
          newErrors.ieltsScore = 'Please enter valid IELTS band (0.0 to 9.0)';
        }
      }
    }

    if (step === 6) {
      if (!formData.consentAgreed) {
        newErrors.consentAgreed = 'Please confirm consent to proceed with preliminary eligibility assessment';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // 1. Calculate eligibility via dedicated engine
      const evalResult = calculateItalyPreliminaryEligibility(formData);
      setEligibilityResult(evalResult);

      // 2. Prepare payload
      const leadPayload = {
        ...formData,
        questionnaireVersion: 'Italy-Eligibility-v1',
        preliminaryEligibilityStatus: evalResult.status,
        eligibilityReasons: evalResult.reasons,
        eligibilityFlags: evalResult.flags,
        rulesTriggered: evalResult.rulesTriggered,
        counsellorStatus: 'New' as const,
        counsellorNotes: '',
        assignedCounsellor: 'Unassigned',
        lastContactedAt: '',
        ...trackingParams,
        leadSource: trackingParams.leadSource || 'Italy Assessment Page'
      };

      // 3. Save to Firestore collection `italyEligibilityLeads`
      const newDocId = await submitItalyEligibilityLeadToFirestore(leadPayload);
      setSubmittedLeadId(newDocId || 'ITA-' + Date.now().toString().slice(-6));
      setSubmissionSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      setSubmissionError("We couldn't submit your assessment right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    'Personal & Study Interest',
    'Academic Qualification',
    'Study Gap & Experience',
    'English & Course Requirements',
    'Documents & Scholarship',
    'Review & Submit'
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A202C] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header & Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#EA580C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to PrimiPassi Home</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🇮🇹</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Italy Study Portal</span>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50/40 p-6 sm:p-8 rounded-3xl border border-orange-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-orange-200 text-xs font-bold text-[#EA580C] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official PrimiPassi Assessment • Version 1.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Study in Italy — Eligibility Assessment
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
              Check your preliminary eligibility for studying in Italy. Answer a few structured questions about your
              academic background, course preference, and study plans to receive instant preliminary classification.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 text-[#EA580C]">
                <Clock className="w-4 h-4" /> Takes approximately 5–7 minutes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free & Confidential
              </span>
              <span>•</span>
              <span>No login required</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Notice:</strong> This is a preliminary eligibility assessment. Final admission eligibility
            depends on the selected university, course, intake, documents and university-specific requirements.
          </p>
        </div>

        {/* RESULTS VIEW IF SUBMITTED */}
        {submissionSuccess && eligibilityResult ? (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl shadow-md bg-slate-50 border border-slate-200">
                {eligibilityResult.status === 'ELIGIBLE' && '🟢'}
                {eligibilityResult.status === 'PROFILE_REVIEW' && '🟡'}
                {eligibilityResult.status === 'NOT_ELIGIBLE' && '🔴'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Assessment Submitted Successfully
              </h2>
              <p className="text-sm text-slate-600">
                Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. We have received your Italy
                eligibility assessment.
              </p>
              <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-mono font-bold text-slate-600">
                Assessment Reference: {submittedLeadId}
              </div>
            </div>

            {/* Assessment Classification Badge */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border ${
                eligibilityResult.status === 'ELIGIBLE'
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : eligibilityResult.status === 'PROFILE_REVIEW'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-red-50/80 border-red-300 text-red-950'
              } space-y-4`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-black/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    Preliminary Profile Status
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    {eligibilityResult.status === 'ELIGIBLE' && '🟢 PRELIMINARILY ELIGIBLE'}
                    {eligibilityResult.status === 'PROFILE_REVIEW' && '🟡 PROFILE REVIEW REQUIRED'}
                    {eligibilityResult.status === 'NOT_ELIGIBLE' && '🔴 DOES NOT MEET PRELIMINARY CRITERIA'}
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-white/80 rounded-full shadow-xs">
                  {formData.studyLevel} in Italy
                </span>
              </div>

              {/* Status Message */}
              <p className="text-sm font-medium leading-relaxed">
                {eligibilityResult.summaryMessage}
              </p>

              {/* Bullet Reasons */}
              {eligibilityResult.reasons.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Key Evaluation Highlights:
                  </span>
                  <ul className="text-xs space-y-1 opacity-90 pl-1">
                    {eligibilityResult.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Flags / Review Areas */}
              {eligibilityResult.flags.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-black/10">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Counsellor Evaluation Points:
                  </span>
                  <ul className="text-xs space-y-1 opacity-90 pl-1">
                    {eligibilityResult.flags.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Next Steps Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EA580C]" /> Next Steps With PrimiPassi
              </h4>
              <ol className="text-xs sm:text-sm text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Our senior Italian academic counsellors will review your subject-wise syllabus, percentage, and gap
                  justifications.
                </li>
                <li>
                  We will short-list matching public and private Italian universities with 0€ tuition / DSU scholarship
                  feasibility.
                </li>
                <li>
                  A dedicated counsellor will contact you on <strong>{formData.phone}</strong> or{' '}
                  <strong>{formData.email}</strong> to schedule a 1-on-1 profiling session.
                </li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all text-center"
              >
                Back to PrimiPassi Home
              </button>
              {onOpenBookingWithDetails && (
                <button
                  onClick={() => {
                    onOpenBookingWithDetails(
                      `Italy Assessment follow-up: ${formData.fullName} (${formData.studyLevel} in ${formData.intendedField}, ref: ${submittedLeadId})`
                    );
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Book Immediate 1-on-1 Call</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* MULTI-STEP WIZARD */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
            {/* Step Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="text-[#EA580C]">
                  Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
                </span>
                <span className="text-slate-400">
                  {Math.round((currentStep / totalSteps) * 100)}% Completed
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EA580C] transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              {/* Step indicator breadcrumbs (Desktop) */}
              <div className="hidden sm:grid grid-cols-6 gap-2 pt-2 text-[10px] font-bold text-center">
                {stepTitles.map((title, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded-lg border transition-all truncate ${
                      currentStep === idx + 1
                        ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                        : currentStep > idx + 1
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    {idx + 1}. {title.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Notification Banner if submission fails */}
            {submissionError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            {/* FORM STEPS CONTENT */}
            <div className="space-y-6">
              {/* -------------------------------------------------------------
                  STEP 1: PERSONAL & STUDY INTEREST
                  ------------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Personal & Study Interest</h3>
                    <p className="text-xs text-slate-500">
                      Tell us about yourself and what degree you aim to pursue in Italy.
                    </p>
                  </div>

                  {/* Q1. Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#EA580C]" /> Q1. Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#EA580C]'
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 font-semibold">{errors.fullName}</p>}
                  </div>

                  {/* Q2. Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#EA580C]" /> Q2. Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. aditi.sharma@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#EA580C]'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-600 font-semibold">{errors.email}</p>}
                  </div>

                  {/* Q3. Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#EA580C]" /> Q3. Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-[#EA580C]'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 font-semibold">{errors.phone}</p>}
                  </div>

                  {/* Q4. Study Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#EA580C]" /> Q4. What do you want to study in Italy? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["Bachelor's", "Master's"] as ItalyStudyLevel[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleChange('studyLevel', level)}
                          className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                            formData.studyLevel === level
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C] shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm text-slate-900">{level} Degree</p>
                            <p className="text-[11px] text-slate-500">
                              {level === "Bachelor's" ? '3-Year Laurea Triennale' : '2-Year Laurea Magistrale'}
                            </p>
                          </div>
                          {formData.studyLevel === level && <Check className="w-4 h-4 text-[#EA580C]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q5. Field of Interest */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" /> Q5. What field / course are you interested in? *
                    </label>
                    <select
                      value={formData.intendedField}
                      onChange={(e) => handleChange('intendedField', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="Computer Science / IT">Computer Science / IT / Data Science</option>
                      <option value="Engineering">Engineering (Mechanical, Automotive, Civil, Electronics)</option>
                      <option value="Business / Management">Business / Management / International Business</option>
                      <option value="Economics / Finance">Economics / Finance / Banking</option>
                      <option value="Architecture">Architecture / Urban Planning</option>
                      <option value="Design / Fashion Design">Design / Fashion Design / Product Design</option>
                      <option value="Arts / Humanities">Arts / Humanities / Philosophy</option>
                      <option value="Life Sciences">Life Sciences / Biotechnology / Pharmacy</option>
                      <option value="Medicine / Healthcare">Medicine / Healthcare (IMAT)</option>
                      <option value="Other">Other (Please specify)</option>
                    </select>

                    {formData.intendedField === 'Other' && (
                      <div className="pt-2">
                        <input
                          type="text"
                          placeholder="Please specify your intended course / field..."
                          value={formData.intendedFieldOther || ''}
                          onChange={(e) => handleChange('intendedFieldOther', e.target.value)}
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none ${
                            errors.intendedFieldOther ? 'border-red-400' : 'border-slate-200 focus:border-[#EA580C]'
                          }`}
                        />
                        {errors.intendedFieldOther && (
                          <p className="text-[11px] text-red-600 font-semibold">{errors.intendedFieldOther}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Q6. Intake */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#EA580C]" /> Q6. Which intake are you targeting? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'September 2026 Intake (Main Fall)',
                        'January/February 2027 (Spring Intake)',
                        'September 2027 Intake',
                        'Other / Not Decided'
                      ].map((intake) => (
                        <button
                          key={intake}
                          type="button"
                          onClick={() => handleChange('intake', intake)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            formData.intake === intake
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {intake}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 2: ACADEMIC QUALIFICATION (DYNAMIC FLOW)
                  ------------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Academic Qualification ({formData.studyLevel} Route)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Your academic profile helps us determine which Italian university and course options may be suitable.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-[#EA580C] text-xs font-bold rounded-full">
                      {formData.studyLevel}
                    </span>
                  </div>

                  {/* BACHELOR'S FLOW */}
                  {formData.studyLevel === "Bachelor's" ? (
                    <div className="space-y-6">
                      {/* Q7B: Completed Class 12 */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-800">
                          Q7B. Have you completed Class 12?
                        </label>
                        <div className="flex gap-3">
                          {['Yes', 'No, currently pursuing'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('completedClass12', opt)}
                              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                formData.completedClass12 === opt
                                  ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q8B: Class 12 Percentage */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">
                          Q8B. What is your Class 12 percentage? *
                        </label>
                        <div className="relative max-w-xs">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="e.g. 78"
                            value={formData.class12Percentage}
                            onChange={(e) => handleChange('class12Percentage', e.target.value)}
                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${
                              errors.class12Percentage
                                ? 'border-red-400 bg-red-50/20'
                                : 'border-slate-200 focus:border-[#EA580C]'
                            }`}
                          />
                          <span className="absolute right-4 top-3 text-slate-400 font-bold text-sm">%</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          PrimiPassi Preliminary Criterion: Stated benchmark for Class 12 applicants is 70% or above.
                        </p>
                        {errors.class12Percentage && (
                          <p className="text-[11px] text-red-600 font-semibold">{errors.class12Percentage}</p>
                        )}
                      </div>

                      {/* Q9B: 10th + Diploma route */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-800">
                          Q9B. Are you applying through the 10th + Diploma route?
                        </label>
                        <div className="flex gap-3">
                          {['No', 'Yes'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('applyingDiplomaRoute', opt)}
                              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                formData.applyingDiplomaRoute === opt
                                  ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.applyingDiplomaRoute === 'Yes' && (
                        <div className="space-y-1.5 pl-4 border-l-2 border-[#EA580C]">
                          <label className="text-xs font-bold text-slate-800">
                            Q10B. What is your Diploma percentage? *
                          </label>
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="e.g. 74"
                              value={formData.diplomaPercentage}
                              onChange={(e) => handleChange('diplomaPercentage', e.target.value)}
                              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${
                                errors.diplomaPercentage
                                  ? 'border-red-400 bg-red-50/20'
                                  : 'border-slate-200 focus:border-[#EA580C]'
                              }`}
                            />
                            <span className="absolute right-4 top-3 text-slate-400 font-bold text-sm">%</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Stated threshold: 70% in Diploma for preliminary qualification.
                          </p>
                          {errors.diplomaPercentage && (
                            <p className="text-[11px] text-red-600 font-semibold">{errors.diplomaPercentage}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* MASTER'S FLOW */
                    <div className="space-y-6">
                      {/* Q7M: Bachelor's degree completed / pursuing */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">
                          Q7M. What Bachelor's degree have you completed / are currently pursuing? *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech Computer Science, B.Com, B.Sc, BBA, BCA"
                          value={formData.bachelorsDegreeName || ''}
                          onChange={(e) => handleChange('bachelorsDegreeName', e.target.value)}
                          className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${
                            errors.bachelorsDegreeName
                              ? 'border-red-400 bg-red-50/20'
                              : 'border-slate-200 focus:border-[#EA580C]'
                          }`}
                        />
                        {errors.bachelorsDegreeName && (
                          <p className="text-[11px] text-red-600 font-semibold">{errors.bachelorsDegreeName}</p>
                        )}
                      </div>

                      {/* Q8M: Specialisation */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">
                          Q8M. Bachelor's Specialisation / Major
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Information Technology, Mechanical, Marketing, Accounting"
                          value={formData.bachelorsSpecialisation || ''}
                          onChange={(e) => handleChange('bachelorsSpecialisation', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>

                      {/* Q10M: Completed or Pursuing */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-800">
                          Q10M. Have you completed your Bachelor's degree?
                        </label>
                        <div className="flex gap-3">
                          {['Yes', 'No, currently pursuing'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('completedBachelors', opt)}
                              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                formData.completedBachelors === opt
                                  ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* COMPLETED BACHELOR'S SCORE */}
                      {formData.completedBachelors === 'Yes' ? (
                        <div className="space-y-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800">
                              Q9M. Bachelor's Score System:
                            </label>
                            <div className="flex gap-2">
                              {['Percentage', 'CGPA'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleChange('scoreType', st)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                                    formData.scoreType === st
                                      ? 'bg-[#EA580C] text-white border-[#EA580C]'
                                      : 'bg-white text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          {formData.scoreType === 'Percentage' ? (
                            <div className="relative max-w-xs">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g. 72"
                                value={formData.bachelorsPercentage}
                                onChange={(e) => handleChange('bachelorsPercentage', e.target.value)}
                                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none ${
                                  errors.bachelorsPercentage
                                    ? 'border-red-400 bg-red-50/20'
                                    : 'border-slate-200 focus:border-[#EA580C]'
                                }`}
                              />
                              <span className="absolute right-4 top-3 text-slate-400 font-bold text-sm">%</span>
                            </div>
                          ) : (
                            <div className="flex gap-3 max-w-sm">
                              <div className="flex-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.01"
                                  placeholder="e.g. 7.6"
                                  value={formData.bachelorsCgpa}
                                  onChange={(e) => handleChange('bachelorsCgpa', e.target.value)}
                                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none ${
                                    errors.bachelorsCgpa
                                      ? 'border-red-400'
                                      : 'border-slate-200 focus:border-[#EA580C]'
                                  }`}
                                />
                              </div>
                              <div className="w-28">
                                <select
                                  value={formData.cgpaScale}
                                  onChange={(e) => handleChange('cgpaScale', e.target.value)}
                                  className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                                >
                                  <option value="10">Out of 10</option>
                                  <option value="4">Out of 4.0</option>
                                  <option value="7">Out of 7.0</option>
                                </select>
                              </div>
                            </div>
                          )}
                          <p className="text-[11px] text-slate-500">
                            PrimiPassi Preliminary Criterion: Stated guideline for Master's is 65% or above.
                          </p>
                          {errors.bachelorsPercentage && (
                            <p className="text-[11px] text-red-600 font-semibold">{errors.bachelorsPercentage}</p>
                          )}
                          {errors.bachelorsCgpa && (
                            <p className="text-[11px] text-red-600 font-semibold">{errors.bachelorsCgpa}</p>
                          )}
                        </div>
                      ) : (
                        /* CURRENTLY PURSUING SCORES */
                        <div className="space-y-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-200">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-800">
                              Q11M. Percentage up to latest completed semester/year? *
                            </label>
                            <div className="relative max-w-xs">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g. 68"
                                value={formData.latestSemesterPercentage}
                                onChange={(e) => handleChange('latestSemesterPercentage', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none ${
                                  errors.latestSemesterPercentage
                                    ? 'border-red-400'
                                    : 'border-slate-200 focus:border-[#EA580C]'
                                }`}
                              />
                              <span className="absolute right-4 top-2.5 text-slate-400 font-bold text-sm">%</span>
                            </div>
                            {errors.latestSemesterPercentage && (
                              <p className="text-[11px] text-red-600 font-semibold">{errors.latestSemesterPercentage}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-800">
                              Q12M. What final percentage do you expect? *
                            </label>
                            <div className="relative max-w-xs">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g. 70"
                                value={formData.predictedFinalPercentage}
                                onChange={(e) => handleChange('predictedFinalPercentage', e.target.value)}
                                className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none ${
                                  errors.predictedFinalPercentage
                                    ? 'border-red-400'
                                    : 'border-slate-200 focus:border-[#EA580C]'
                                }`}
                              />
                              <span className="absolute right-4 top-2.5 text-slate-400 font-bold text-sm">%</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Guideline: 65% or above till latest exam AND predicted final 65% or above.
                            </p>
                            {errors.predictedFinalPercentage && (
                              <p className="text-[11px] text-red-600 font-semibold">{errors.predictedFinalPercentage}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* SPECIAL COMPUTER SCIENCE / IT CHECK */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <label className="text-xs font-bold text-slate-800">
                          Q13. Which category best describes your Bachelor's qualification?
                        </label>
                        <select
                          value={formData.specificItDegree}
                          onChange={(e) => handleChange('specificItDegree', e.target.value as any)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#EA580C]"
                        >
                          <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                          <option value="B.Sc Information Technology">B.Sc Information Technology</option>
                          <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                          <option value="Other Computer/IT degree">B.Tech / B.E. / Other Computer degree</option>
                          <option value="Other">Other Non-IT Degree (Engineering, Commerce, Arts, Science)</option>
                        </select>
                        {(formData.specificItDegree === 'B.Sc Computer Science' ||
                          formData.specificItDegree === 'B.Sc Information Technology' ||
                          formData.specificItDegree === 'BCA') && (
                          <p className="text-[11px] text-amber-700 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                            <strong>Note on Computer Master's:</strong> Students with B.Sc IT/CS or BCA seeking Master's
                            programmes in computer-related courses require a minimum benchmark of 80% under standard
                            screening. Profiles with other scores are flagged for individual university syllabus evaluation.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 3: STUDY GAP & WORK EXPERIENCE
                  ------------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Study Gap & Work Experience</h3>
                    <p className="text-xs text-slate-500">
                      Don't worry if you have a study gap. Tell us the details so our counsellors can assess your profile
                      and documents correctly.
                    </p>
                  </div>

                  {/* Q14. Education Gap */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-800">
                      Q14. Do you have a gap in your education?
                    </label>
                    <div className="flex gap-3">
                      {['No', 'Yes'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChange('hasEducationGap', opt)}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            formData.hasEducationGap === opt
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {formData.hasEducationGap === 'Yes' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            Q15. How many years is the gap? *
                          </label>
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              placeholder="e.g. 2"
                              value={formData.gapYears}
                              onChange={(e) => handleChange('gapYears', e.target.value)}
                              className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none ${
                                errors.gapYears ? 'border-red-400' : 'border-slate-200 focus:border-[#EA580C]'
                              }`}
                            />
                            <span className="absolute right-4 top-2.5 text-slate-400 font-bold text-xs">Years</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Preliminary guideline: Max stated gap is 3 years after Class 12 for Bachelor's, and up to 10
                            years after Bachelor's for Master's (with justifiable experience).
                          </p>
                          {errors.gapYears && (
                            <p className="text-[11px] text-red-600 font-semibold">{errors.gapYears}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            Q16. What was the primary reason for the gap?
                          </label>
                          <select
                            value={formData.gapReason}
                            onChange={(e) => handleChange('gapReason', e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                          >
                            <option value="Work experience">Work experience / Employment</option>
                            <option value="Competitive examination preparation">
                              Competitive examination preparation (UPSC, GATE, CAT, etc.)
                            </option>
                            <option value="Personal/family reasons">Personal / Family reasons</option>
                            <option value="Health reasons">Health / Medical reasons</option>
                            <option value="Financial reasons">Financial arrangement / Planning</option>
                            <option value="Other">Other reason</option>
                          </select>

                          {formData.gapReason === 'Other' && (
                            <input
                              type="text"
                              placeholder="Please specify gap reason..."
                              value={formData.gapReasonOther || ''}
                              onChange={(e) => handleChange('gapReasonOther', e.target.value)}
                              className="w-full mt-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Q22. Work Experience */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800">
                      Q22. Do you have professional work experience?
                    </label>
                    <div className="flex gap-3">
                      {['No', 'Yes'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChange('hasWorkExperience', opt)}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            formData.hasWorkExperience === opt
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {formData.hasWorkExperience === 'Yes' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            Q23. Total work experience (years) *
                          </label>
                          <div className="relative max-w-xs">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              step="0.5"
                              placeholder="e.g. 2.5"
                              value={formData.workExperienceYears}
                              onChange={(e) => handleChange('workExperienceYears', e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#EA580C]"
                            />
                            <span className="absolute right-4 top-2.5 text-slate-400 font-bold text-xs">Years</span>
                          </div>
                          {errors.workExperienceYears && (
                            <p className="text-[11px] text-red-600 font-semibold">{errors.workExperienceYears}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-800">
                              Q24. Current / Most Recent Job Role
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Software Engineer, Financial Analyst"
                              value={formData.jobRole || ''}
                              onChange={(e) => handleChange('jobRole', e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-800">Q25. Industry</label>
                            <select
                              value={formData.industry}
                              onChange={(e) => handleChange('industry', e.target.value)}
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="IT / Technology">IT / Technology</option>
                              <option value="Finance / Banking">Finance / Banking</option>
                              <option value="Healthcare">Healthcare / Pharma</option>
                              <option value="Engineering">Engineering / Manufacturing</option>
                              <option value="Education">Education / EdTech</option>
                              <option value="Consulting">Consulting / Management</option>
                              <option value="Marketing / Sales">Marketing / Sales</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 4: ENGLISH LANGUAGE & COURSE-SPECIFIC REQUIREMENTS
                  ------------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">English Language & Course Requirements</h3>
                    <p className="text-xs text-slate-500">
                      IELTS requirements vary by university and course. Your answers help us determine which Italian
                      universities fit your language profile.
                    </p>
                  </div>

                  {/* Q17: IELTS status */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-800">
                      Q17. Do you have an IELTS scorecard?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'Yes', label: 'Yes, I have IELTS score' },
                        { id: 'No', label: 'No IELTS scorecard' },
                        { id: 'Planning to take IELTS', label: 'Planning to take IELTS' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleChange('ieltsStatus', opt.id as any)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            formData.ieltsStatus === opt.id
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {formData.ieltsStatus === 'Yes' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <label className="text-xs font-bold text-slate-800">
                          Q18. What is your IELTS overall band? *
                        </label>
                        <div className="relative max-w-xs">
                          <input
                            type="number"
                            min="0"
                            max="9"
                            step="0.5"
                            placeholder="e.g. 6.5"
                            value={formData.ieltsScore}
                            onChange={(e) => handleChange('ieltsScore', e.target.value)}
                            className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none ${
                              errors.ieltsScore ? 'border-red-400' : 'border-slate-200 focus:border-[#EA580C]'
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Average stated Italian university requirement is typically 5.5 to 6.5 overall.
                        </p>
                        {errors.ieltsScore && (
                          <p className="text-[11px] text-red-600 font-semibold">{errors.ieltsScore}</p>
                        )}
                      </div>
                    )}

                    {/* Q19: MOI Certificate */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-800">
                        Q19. Can your previous school/college provide an English Medium of Instruction (MOI) certificate?
                      </label>
                      <div className="flex gap-3">
                        {['Yes', 'No', 'Not sure'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange('moiAvailable', opt as any)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                              formData.moiAvailable === opt
                                ? 'bg-[#EA580C] text-white border-[#EA580C]'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Several top public Italian universities accept an MOI letter in place of IELTS.
                      </p>
                    </div>
                  </div>

                  {/* Q20: Architecture / Design Course */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800">
                      Q20. Is your intended course Architecture, Design, or Fashion Design?
                    </label>
                    <div className="flex gap-3">
                      {['No', 'Yes'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChange('isArchitectureDesign', opt as any)}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            formData.isArchitectureDesign === opt
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {(formData.isArchitectureDesign === 'Yes' ||
                      formData.intendedField === 'Architecture' ||
                      formData.intendedField === 'Design / Fashion Design') && (
                      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                        <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                          Q21. Do you currently have a design portfolio?
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {['Yes', 'No', 'Can prepare one'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleChange('hasPortfolio', opt as any)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                formData.hasPortfolio === opt
                                  ? 'bg-[#EA580C] text-white border-[#EA580C]'
                                  : 'bg-white border-amber-200 text-amber-900 hover:bg-amber-100/50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Architecture and Design faculties in Italian polytechnics (like PoliMi and PoliTo) mandate a
                          creative portfolio for academic admission review.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 5: DOCUMENTS & SCHOLARSHIP
                  ------------------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Document Readiness & Scholarship Interest</h3>
                    <p className="text-xs text-slate-500">
                      Select the documents you currently have available. No file uploads required at this preliminary stage.
                    </p>
                  </div>

                  {/* Q26. Document Availability Checkboxes */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#EA580C]" /> Q26. Which documents do you currently have?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {DOCUMENT_OPTIONS.map((docItem) => {
                        const isChecked = formData.availableDocuments.includes(docItem);
                        return (
                          <button
                            key={docItem}
                            type="button"
                            onClick={() => handleToggleDocument(docItem)}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 ${
                              isChecked
                                ? 'bg-orange-50/80 border-[#EA580C] text-slate-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center text-white text-[10px] ${
                                isChecked ? 'bg-[#EA580C]' : 'border border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{docItem}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <label className="text-[11px] font-bold text-slate-600">
                        Any specific documents still to be arranged? (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Awaiting final semester transcript, applying for passport..."
                        value={formData.documentsToArrange || ''}
                        onChange={(e) => handleChange('documentsToArrange', e.target.value)}
                        className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>
                  </div>

                  {/* Q27. Scholarship Interest */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#EA580C]" />
                        Q27. Are you interested in Italy Regional Government Scholarships (DSU / ER.GO)?
                      </label>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        Up to 100% Free Tuition + €7,500/yr Grant
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {['Yes', 'No', 'I would like to know more'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChange('scholarshipInterest', opt as any)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            formData.scholarshipInterest === opt
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {formData.scholarshipInterest !== 'No' && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            Q28. Approximate annual family income:
                          </label>
                          <select
                            value={formData.familyIncomeRange}
                            onChange={(e) => handleChange('familyIncomeRange', e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                          >
                            <option value="Below ₹5 lakh">Below ₹5 Lakhs per year (High DSU Grant Priority)</option>
                            <option value="₹5–10 lakh">₹5 – ₹10 Lakhs per year (Eligible for DSU & Fee Waivers)</option>
                            <option value="₹10–15 lakh">₹10 – ₹15 Lakhs per year (Eligible)</option>
                            <option value="₹15–20 lakh">₹15 – ₹20 Lakhs per year (Within ceiling)</option>
                            <option value="Above ₹20 lakh">Above ₹20 Lakhs per year</option>
                            <option value="Prefer to discuss with counsellor">Prefer to discuss with counsellor</option>
                          </select>
                          <p className="text-[10px] text-slate-500">
                            Italian DSU Regional Grant income ceiling is approximately €25,000 (~₹22-24 Lakhs).
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-800">
                            Q29. Can your family provide financial/property/income documents if required for DSU?
                          </label>
                          <div className="flex gap-3">
                            {['Yes', 'No', 'Not sure'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleChange('canProvideFinancialDocs', opt as any)}
                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                                  formData.canProvideFinancialDocs === opt
                                    ? 'bg-[#EA580C] text-white border-[#EA580C]'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Q30: How soon planning to apply */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800">
                      Q30. How soon are you planning to apply?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Immediately',
                        'Within 1 month',
                        'Within 3 months',
                        '3–6 months',
                        'Just exploring'
                      ].map((timing) => (
                        <button
                          key={timing}
                          type="button"
                          onClick={() => handleChange('applicationIntent', timing as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                            formData.applicationIntent === timing
                              ? 'bg-orange-50 border-[#EA580C] text-[#EA580C]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {timing}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 6: REVIEW & SUBMIT
                  ------------------------------------------------------------- */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Review Answers & Submit Assessment</h3>
                    <p className="text-xs text-slate-500">
                      Please verify your answers before submitting for automatic preliminary eligibility classification.
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Personal & Study */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Candidate Details</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] font-bold text-[#EA580C] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{formData.fullName}</p>
                      <p className="text-slate-600">{formData.email}</p>
                      <p className="text-slate-600">{formData.phone}</p>
                      <p className="font-semibold text-[#EA580C] pt-1">
                        {formData.studyLevel} in {formData.intendedField === 'Other' ? formData.intendedFieldOther : formData.intendedField}
                      </p>
                      <p className="text-slate-500">Intake: {formData.intake}</p>
                    </div>

                    {/* Academic */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Academic Profile</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] font-bold text-[#EA580C] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      {formData.studyLevel === "Bachelor's" ? (
                        <>
                          <p className="font-bold text-slate-900">
                            Class 12: {formData.class12Percentage ? `${formData.class12Percentage}%` : 'Not provided'}
                          </p>
                          {formData.applyingDiplomaRoute === 'Yes' && (
                            <p className="text-slate-700">Diploma Route: {formData.diplomaPercentage}%</p>
                          )}
                          <p className="text-slate-500">Status: {formData.completedClass12}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-slate-900">{formData.bachelorsDegreeName || 'Bachelors'}</p>
                          <p className="text-slate-700">
                            Score:{' '}
                            {formData.scoreType === 'CGPA'
                              ? `${formData.bachelorsCgpa} CGPA (out of ${formData.cgpaScale})`
                              : `${formData.bachelorsPercentage}%`}
                          </p>
                          <p className="text-slate-500">Status: {formData.completedBachelors}</p>
                        </>
                      )}
                    </div>

                    {/* Gap & Language */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Language & Experience</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] font-bold text-[#EA580C] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-slate-800">
                        <strong>Gap:</strong> {formData.hasEducationGap === 'Yes' ? `${formData.gapYears} yrs (${formData.gapReason})` : 'No gap'}
                      </p>
                      <p className="text-slate-800">
                        <strong>Work Exp:</strong> {formData.hasWorkExperience === 'Yes' ? `${formData.workExperienceYears} yrs (${formData.jobRole})` : 'None'}
                      </p>
                      <p className="text-slate-800">
                        <strong>IELTS:</strong> {formData.ieltsStatus === 'Yes' ? `Band ${formData.ieltsScore}` : formData.ieltsStatus}
                      </p>
                      <p className="text-slate-800">
                        <strong>MOI Available:</strong> {formData.moiAvailable}
                      </p>
                    </div>

                    {/* Documents & Scholarship */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Scholarship & Docs</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="text-[11px] font-bold text-[#EA580C] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-slate-800">
                        <strong>Docs Ready:</strong> {formData.availableDocuments.length} documents marked
                      </p>
                      <p className="text-slate-800">
                        <strong>Scholarship:</strong> {formData.scholarshipInterest}
                      </p>
                      <p className="text-slate-800">
                        <strong>Family Income:</strong> {formData.familyIncomeRange}
                      </p>
                      <p className="text-slate-800">
                        <strong>Planning to Apply:</strong> {formData.applicationIntent}
                      </p>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentAgreed}
                        onChange={(e) => handleChange('consentAgreed', e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-orange-300 text-[#EA580C] focus:ring-[#EA580C]"
                      />
                      <span className="text-xs text-slate-700 leading-relaxed">
                        By submitting this form, you agree that <strong>PrimiPassi Education Advisors</strong> may contact
                        you regarding your Italy education options, admission eligibility, and counselling.
                      </span>
                    </label>
                    {errors.consentAgreed && (
                      <p className="text-[11px] text-red-600 font-semibold pl-7">{errors.consentAgreed}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Profile...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit & View Preliminary Result</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
