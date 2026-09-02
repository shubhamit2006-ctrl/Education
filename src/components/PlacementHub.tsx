import React from 'react';
import {
  Briefcase,
  TrendingUp,
  Building2,
  DollarSign,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface PlacementHubProps {
  onOpenBooking: () => void;
}

export const PlacementHub: React.FC<PlacementHubProps> = ({ onOpenBooking }) => {
  const topRecruiters = [
    { name: 'Google Cloud & AI', sector: 'Software & Cloud Engineering', avgSalary: '₹34 LPA / €65k', location: 'USA / Europe / India' },
    { name: 'Microsoft Enterprise', sector: 'AI Systems & Cloud Services', avgSalary: '₹32 LPA / £55k', location: 'UK / USA / India' },
    { name: 'Ferrari & Stellantis', sector: 'Automotive & Mechanical Tech', avgSalary: '€52,000 / yr', location: 'Italy (Motor Valley)' },
    { name: 'Siemens & SAP AG', sector: 'Industrial Automation & Enterprise', avgSalary: '€62,000 / yr', location: 'Germany' },
    { name: 'Amazon Global Hubs', sector: 'E-Commerce & AWS Infra', avgSalary: '₹30 LPA / AED 24k', location: 'Dubai / USA / UK' },
    { name: 'Deloitte & PwC', sector: 'Global Strategy & Management', avgSalary: '₹22 LPA / €50k', location: 'Global Offices' },
    { name: 'Tata Consultancy & Tata Motors', sector: 'Tech & EV Engineering', avgSalary: '₹18 - 25 LPA', location: 'India / UK' },
    { name: 'Emirates Group & DP World', sector: 'Aviation & Logistics', avgSalary: 'AED 20,000 / mo', location: 'Dubai (UAE)' }
  ];

  return (
    <section className="py-20 bg-white text-[#1A202C] transition-colors border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200 shadow-2xs">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Global Career Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Top Recruiters Hiring Domestic & International Graduates
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Benefit from extensive corporate alumni networks, post-study work visas (up to 3 years), and premier campus placement drives.
          </p>
        </div>

        {/* Recruiters Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRecruiters.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 space-y-3 group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center font-bold text-sm border border-orange-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                  {rec.location}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-[#EA580C] transition-colors leading-snug">
                  {rec.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{rec.sector}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Avg Package:</span>
                <span className="font-bold text-[#EA580C]">{rec.avgSalary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
