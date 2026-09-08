import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  Plane,
  Sparkles,
  AlertCircle,
  Globe,
  Award,
  Building2
} from 'lucide-react';
import { CountryCode } from '../types';
import { useContent } from '../context/ContentContext';

interface VisaCenterProps {
  onOpenBookingWithDetails: (details: string) => void;
  onOpenItalyAssessment?: () => void;
}

interface CountryVisaGuide {
  countryCode: CountryCode;
  countryName: string;
  flag: string;
  visaType: string;
  processingTime: string;
  financialRequirement: string;
  languageRequirement: string;
  keySteps: { step: number; title: string; desc: string }[];
  documents: { title: string; desc: string }[];
}

const COUNTRY_VISA_GUIDES: CountryVisaGuide[] = [
  {
    countryCode: 'italy',
    countryName: 'Italy',
    flag: '🇮🇹',
    visaType: 'Type D National Student Visa (Long Stay)',
    processingTime: '3 - 6 Weeks',
    financialRequirement: '€6,000 / year (or covered via 100% DSU Regional Grant)',
    languageRequirement: 'English MOI Certificate or IELTS 6.0 / B2',
    keySteps: [
      { step: 1, title: 'Universitaly Pre-Enrollment', desc: 'Register on the Italian Ministry Universitaly portal and upload offer letter & academic credentials.' },
      { step: 2, title: 'Declaration of Value (DOV) / CIMEA', desc: 'Obtain legal equivalency of Indian degrees through CIMEA or Italian Consulates.' },
      { step: 3, title: 'DSU Grant & ISEE Parificato', desc: 'Submit family income documentation for 100% tuition waiver & living allowance.' },
      { step: 4, title: 'VFS Visa Appointment & Stamping', desc: 'Submit passport, DOV, and accommodation certificate for Type D Student Visa.' }
    ],
    documents: [
      { title: 'Universitaly Summary Sheet', desc: 'Validated pre-enrollment document from university.' },
      { title: 'CIMEA / DOV Certificate', desc: 'Statement of Comparability and Verification for degrees.' },
      { title: 'Bank Solvency or DSU Grant Letter', desc: 'Financial proof of living funds (~€6,000) or official DSU regional grant confirmation.' },
      { title: 'Travel Health Insurance & Flight Booking', desc: 'Minimum €30,000 Schengen coverage policy.' }
    ]
  },
  {
    countryCode: 'germany',
    countryName: 'Germany',
    flag: '🇩🇪',
    visaType: 'National Visa for Study (Visum zur Studienzwecken)',
    processingTime: '4 - 8 Weeks',
    financialRequirement: 'Blocked Account (Sperrkonto) €11,904 / year',
    languageRequirement: 'IELTS 6.5 or German B1/B2 (for German taught)',
    keySteps: [
      { step: 1, title: 'APS India Certificate', desc: 'Mandatory verification of Indian academic transcripts by Academic Evaluation Centre Delhi.' },
      { step: 2, title: 'University Admission Letter', desc: 'Secure unconditional admit from German Public/Private state university.' },
      { step: 3, title: 'Blocked Account Setup', desc: 'Deposit €11,904 into Coracle/Expatrio/Fintiba blocked account.' },
      { step: 4, title: 'VFS German Visa Appointment', desc: 'Biometrics and document submission for National D Visa.' }
    ],
    documents: [
      { title: 'Original APS Certificate', desc: 'Mandatory verification certificate issued by APS India.' },
      { title: 'Blocked Account Confirmation', desc: 'Official 06-Blocked Account confirmation letter.' },
      { title: 'University Admission / Offer', desc: 'Zulassungsbescheid from German institution.' },
      { title: 'Public Health Insurance (TK / AOK / Coracle)', desc: 'Statutory student health insurance coverage.' }
    ]
  },
  {
    countryCode: 'uk',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    visaType: 'Student Visa (Points-Based System)',
    processingTime: '3 Weeks (Priority: 5 Days)',
    financialRequirement: '£10,230 (Outside London) / £13,348 (Inside London) + Tuition',
    languageRequirement: 'IELTS 6.0-6.5 or High School English 70%+',
    keySteps: [
      { step: 1, title: 'Confirmation of Acceptance for Studies (CAS)', desc: 'Issued by British university after deposit and condition clearance.' },
      { step: 2, title: 'Financial 28-Day Rule', desc: 'Maintain required funds in bank account for a continuous 28-day period.' },
      { step: 3, title: 'TB Screening Test', desc: 'Get chest X-Ray at UKVI-approved IOM clinic in India.' },
      { step: 4, title: 'VFS Biometrics & IHS Payment', desc: 'Pay Immigration Health Surcharge and attend biometrics appointment.' }
    ],
    documents: [
      { title: 'CAS Statement with Reference Number', desc: 'Electronic record provided by UK sponsor university.' },
      { title: '28-Day Bank Statement / Loan Sanction', desc: 'Proof of funds with official bank seal and sign.' },
      { title: 'IOM Tuberculosis (TB) Clearance', desc: 'Valid medical certificate from approved UKVI medical clinic.' },
      { title: 'Academic Transcripts & English MOI', desc: 'Listed qualifications on CAS statement.' }
    ]
  },
  {
    countryCode: 'usa',
    countryName: 'United States',
    flag: '🇺🇸',
    visaType: 'F-1 Non-Immigrant Academic Student Visa',
    processingTime: '2 - 4 Weeks (Subject to Slot)',
    financialRequirement: '1 Year Total Cost of Attendance (i-20 Amount)',
    languageRequirement: 'TOEFL 80+ / IELTS 6.5+ / Duolingo 110+',
    keySteps: [
      { step: 1, title: 'Form I-20 Issuance', desc: 'Issued by SEVP-certified US university upon verifying financial capability.' },
      { step: 2, title: 'Pay SEVIS I-901 Fee ($350)', desc: 'Register record with Department of Homeland Security.' },
      { step: 3, title: 'Complete DS-160 Form', desc: 'Online non-immigrant visa application.' },
      { step: 4, title: 'OFC Biometrics & Consular Interview', desc: 'Attend two-step consular appointment with US Visa Officer.' }
    ],
    documents: [
      { title: 'Original Signed Form I-20', desc: 'Certificate of Eligibility for Nonimmigrant Student Status.' },
      { title: 'SEVIS Fee Payment Receipt', desc: 'I-901 confirmation receipt.' },
      { title: 'DS-160 Confirmation Barcode', desc: 'Completed online application confirmation page.' },
      { title: 'Comprehensive Financial Portfolio & CA Statement', desc: 'Liquid funds, bank balance certificates, and property valuation.' }
    ]
  },
  {
    countryCode: 'dubai',
    countryName: 'Dubai (UAE)',
    flag: '🇦🇪',
    visaType: '1-Year Renewable Student Residence Visa (GDRFA)',
    processingTime: '7 - 14 Working Days',
    financialRequirement: 'No Complex Financial Show Funds Needed',
    languageRequirement: 'IELTS / MOI / Direct University Entrance Test',
    keySteps: [
      { step: 1, title: 'University Offer & Fee Deposit', desc: 'Accept admission and pay university initial semester deposit.' },
      { step: 2, title: 'Entry Permit Issuance (e-Visa)', desc: 'Issued electronically by Dubai GDRFA in 5-7 business days.' },
      { step: 3, title: 'Fly to Dubai & Medical Fitness Exam', desc: 'Blood test & chest X-Ray at Dubai Health Authority (DHA).' },
      { step: 4, title: 'Emirates ID Biometrics & Visa Stamping', desc: 'Collect official 1-Year / 2-Year UAE Resident Card.' }
    ],
    documents: [
      { title: 'Colored Passport Copy', desc: 'Minimum 6 months validity.' },
      { title: 'University Offer & Fee Receipt', desc: 'Proof of enrollment in accredited Dubai campus.' },
      { title: 'Passport Size White Background Photographs', desc: 'High resolution digital passport photos.' },
      { title: 'Entry Permit Copy', desc: 'Electronic e-visa issued prior to departure.' }
    ]
  },
  {
    countryCode: 'india',
    countryName: 'India (Domestic)',
    flag: '🇮🇳',
    visaType: 'Domestic Direct Seat & Merit Quota Admissions',
    processingTime: 'Direct Seat Allocation (2-5 Days)',
    financialRequirement: 'Domestic Education Loan / Installment Payments',
    languageRequirement: 'English Medium of Instruction',
    keySteps: [
      { step: 1, title: 'Profile & Entrance Score Review', desc: 'Evaluate JEE, CAT, XAT, BITSAT, CUET or 12th/Graduation percentage.' },
      { step: 2, title: 'Seat Reservation & Allotment', desc: 'Lock specialized branch / MBA specialization with institution.' },
      { step: 3, title: 'Verification & Education Loan', desc: 'Avail pre-approved SBI / HDFC domestic loan assistance.' },
      { step: 4, title: 'Campus Orientation & Commencement', desc: 'Begin academic session in premier Indian private/deemed university.' }
    ],
    documents: [
      { title: '10th & 12th / Graduation Marksheets', desc: 'Original certificates and scorecards.' },
      { title: 'National / State Entrance Scorecard', desc: 'JEE, CAT, MAT, CUET, or equivalent test result if applicable.' },
      { title: 'Identity Proof (Aadhaar / PAN)', desc: 'Government photo identification.' },
      { title: 'Transfer & Migration Certificate', desc: 'Issued by previous school / college.' }
    ]
  }
];

export const VisaCenter: React.FC<VisaCenterProps> = ({
  onOpenBookingWithDetails,
  onOpenItalyAssessment
}) => {
  const { activeCountries, selectedCountry, setSelectedCountry, siteConfig } = useContent();
  const [activeTab, setActiveTab] = useState<'guides' | 'checklist'>('guides');

  const visibleVisaGuides = COUNTRY_VISA_GUIDES.filter((g) =>
    activeCountries.some((c) => c.id === g.countryCode)
  );

  const defaultCountryCode = (selectedCountry !== 'all' && activeCountries.some(c => c.id === selectedCountry))
    ? selectedCountry
    : (visibleVisaGuides[0]?.countryCode || 'italy');

  const [currentCountryCode, setCurrentCountryCode] = useState<CountryCode>(defaultCountryCode);

  const activeGuide =
    visibleVisaGuides.find((g) => g.countryCode === currentCountryCode) ||
    visibleVisaGuides[0] ||
    COUNTRY_VISA_GUIDES[0];

  return (
    <section id="visa-center" className="py-20 bg-gradient-to-b from-orange-50/40 via-white to-orange-50/30 text-[#1A202C] transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{siteConfig.visaSuccessRate} Global Visa Clearance Rate</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A202C] tracking-tight">
            Visa & Admissions Processing Center
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            From Universitaly pre-enrollment & German APS verification to UK CAS, US SEVIS I-20, and Dubai e-Visas — our specialized immigration desk handles end-to-end filing.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'guides'
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Country Visa Roadmaps
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'checklist'
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Essential Document Vault
            </button>
          </div>
        </div>

        {/* Tab 1: Country Visa Guides */}
        {activeTab === 'guides' && (
          <div className="space-y-8">
            {/* Country Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center scrollbar-none no-scrollbar">
              {visibleVisaGuides.map((g) => {
                const isSelected = g.countryCode === currentCountryCode;
                return (
                  <button
                    key={g.countryCode}
                    onClick={() => setCurrentCountryCode(g.countryCode)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                      isSelected
                        ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-md shadow-orange-500/20'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    <span className="text-base">{g.flag}</span>
                    <span>{g.countryName}</span>
                  </button>
                );
              })}
            </div>

            {/* Country Guide Feature Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeGuide.flag}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {activeGuide.countryName} Visa & Admission Guide
                    </h3>
                    <p className="text-xs text-[#EA580C] font-semibold mt-0.5">
                      {activeGuide.visaType}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBookingWithDetails(`Visa consultation for ${activeGuide.countryName}`)}
                  className="px-5 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Book {activeGuide.countryName} Visa Expert</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <p className="text-xs text-gray-500 font-medium">Average Processing Time</p>
                  <p className="text-base font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#EA580C]" /> {activeGuide.processingTime}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <p className="text-xs text-gray-500 font-medium">Financial / Living Funds</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {activeGuide.financialRequirement}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <p className="text-xs text-gray-500 font-medium">Language Requirement</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {activeGuide.languageRequirement}
                  </p>
                </div>
              </div>

              {/* Special Italy Assessment Banner */}
              {activeGuide.countryCode === 'italy' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                        Free Tool
                      </span>
                      <span className="text-xs font-bold text-emerald-950">
                        Check Your Italy Eligibility (6-Step Questionnaire)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800/90 max-w-xl">
                      Evaluate your academic cutoff, bachelor&apos;s degrees, education gap, IELTS/MOI waiver, and regional scholarship qualifications through our multi-step engine.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenItalyAssessment) {
                        onOpenItalyAssessment();
                      } else {
                        window.history.pushState(null, '', '/italy-eligibility-assessment');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Launch Italy Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Step Roadmap */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-4">
                  Step-by-Step Filing Roadmap
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeGuide.keySteps.map((s) => (
                    <div key={s.step} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#EA580C] font-bold text-xs flex items-center justify-center">
                        0{s.step}
                      </div>
                      <h5 className="font-bold text-sm text-gray-900">{s.title}</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-gray-900 mb-3">
                  Mandatory Submission Documents for {activeGuide.countryName}
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {activeGuide.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50/40 border border-orange-100/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-gray-900">{doc.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{doc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Document Checklist General */}
        {activeTab === 'checklist' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-3xl mx-auto space-y-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1A202C] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#EA580C]" /> Essential Student Visa Document Vault
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3 p-4 bg-orange-50/40 rounded-2xl border border-orange-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1A202C]">Valid Passport</p>
                  <p className="text-xs text-slate-500">Original passport with minimum 6 to 12 months validity from travel date.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50/40 rounded-2xl border border-orange-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1A202C]">Official University Offer & CAS / I-20 / Admit Letter</p>
                  <p className="text-xs text-slate-500">Unconditional Admission Letter issued by accredited university campus.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50/40 rounded-2xl border border-orange-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1A202C]">Academic Marksheets & Degree Certificates</p>
                  <p className="text-xs text-slate-500">10th, 12th, or Bachelor’s Transcripts with verified English translations.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50/40 rounded-2xl border border-orange-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1A202C]">Financial Solvency / Bank Statements / DSU Grant Letter</p>
                  <p className="text-xs text-slate-500">Sponsor affidavits, bank statements, education loan sanction, or regional grant letters.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
