import React from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  const steps = [
    { num: '01', title: 'Free Counselling', desc: '1-on-1 discovery session with senior advisors to evaluate domestic vs overseas path.' },
    { num: '02', title: 'AI Profile Evaluation', desc: 'Instant eligibility matching for scholarships, DSU grants, APS, and visa quotas.' },
    { num: '03', title: 'Destination & College Shortlisting', desc: 'Curated selection of top institutions across 11 countries tailored to your budget.' },
    { num: '04', title: 'Fast-Track Application', desc: 'Direct university representative processing with expedited admission offers.' },
    { num: '05', title: 'Scholarship & DSU Grants', desc: 'Secure 100% Italy DSU fee waivers, German 0€ tuition, or merit scholarships.' },
    { num: '06', title: 'Education Loan Sanction', desc: 'Pre-approved collateral-free loan sanction letters from top Indian banks & NBFCs.' },
    { num: '07', title: 'Visa Filing & Verification', desc: 'End-to-end guidance for Universitaly, APS India, UK CAS, US SEVIS, or Dubai e-Visas.' },
    { num: '08', title: 'Foreign Exchange & Flights', desc: 'Zero forex markup multi-currency cards, student discounted airfares, and insurance.' },
    { num: '09', title: 'Pre-Departure Briefing', desc: 'Comprehensive orientation on packing, customs, student unions, and campus arrival.' },
    { num: '10', title: 'Campus Arrival & Enrollment', desc: 'Airport welcome, SIM card activation, student card & residency registration.' }
  ];

  return (
    <section className="py-20 bg-white text-[#1A202C] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200 shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
            <span>End-to-End Admission Mentorship</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A202C] tracking-tight">
            10-Step Global Admission Roadmap
          </h2>
          <p className="mt-4 text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            From your very first counselling session in India to stepping onto your global campus with full enrollment support.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFB] p-5 rounded-3xl border border-slate-200/80 hover:border-orange-300 hover:shadow-lg hover:translate-y-[-2px] transition-all space-y-2.5 relative group shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#EA580C] font-black text-2xl font-mono">{step.num}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="font-bold text-[#1A202C] text-sm group-hover:text-[#EA580C] transition-colors leading-snug">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
