import React from 'react';
import {
  GraduationCap,
  PhoneCall,
  Mail,
  MapPin,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { BrandLogo } from './BrandLogo';
import { CountryCode } from '../types';

export const Footer: React.FC = () => {
  const { siteConfig, setActiveStudentTab, setSelectedCountry, activeCountries } = useContent();

  const handleCountryClick = (code: CountryCode) => {
    setSelectedCountry(code);
    setActiveStudentTab('universities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 text-[#1A202C] pt-14 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="lg" showTagline={true} />

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              PrimiPassi Education Advisors — Premier domestic & overseas admissions platform. Official university tie-ups across India, Italy, UK, USA, Canada, Ireland, Australia, France, Dubai, New Zealand & Germany with {siteConfig.visaSuccessRate} visa clearance and end-to-end guidance.
            </p>

            <div className="text-xs space-y-1.5 text-slate-600 pt-1 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#EA580C]" /> Offices: {siteConfig.officesText}
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#EA580C]" /> Toll-Free: {siteConfig.tollFreePhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#EA580C]" /> Admissions: {siteConfig.supportEmail}
              </p>
            </div>
          </div>

          {/* Col 2: Study Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Study Destinations
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-slate-600">
              {activeCountries.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => handleCountryClick(c.id)}
                    className="hover:text-[#EA580C] transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    {c.category === 'domestic' && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">
                        Domestic
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Student Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Services & Portals
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <button
                  onClick={() => {
                    setActiveStudentTab('universities');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#EA580C] transition-colors text-left"
                >
                  Colleges & Universities
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStudentTab('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#EA580C] transition-colors text-left"
                >
                  Course Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStudentTab('scholarships');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#EA580C] transition-colors text-left"
                >
                  Scholarships & DSU Grants
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStudentTab('scholarships');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#EA580C] transition-colors text-left"
                >
                  Education Loans & EMI Calc
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStudentTab('visa-stay');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#EA580C] transition-colors text-left"
                >
                  Visa Roadmaps & Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Accreditation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Trust & Guarantees
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Free Consultation</span>
                </div>
                <p className="text-[11px] text-gray-500">Zero service fees charged from students for direct partner university applications.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>99.2% Visa Clearance</span>
                </div>
                <p className="text-[11px] text-gray-500">Rigorous financial verification and mock visa interview training.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-500 gap-4">
          <div className="flex flex-wrap gap-3 uppercase tracking-wider">
            <span>🇮🇳 India Domestic</span>
            <span>•</span>
            <span>🇮🇹 Italy</span>
            <span>•</span>
            <span>🇬🇧 UK</span>
            <span>•</span>
            <span>🇺🇸 USA</span>
            <span>•</span>
            <span>🇨🇦 Canada</span>
            <span>•</span>
            <span>🇩🇪 Germany</span>
            <span>•</span>
            <span>🇦🇺 Australia</span>
          </div>
          <div className="flex gap-4">
            <span>© 2026 PrimiPassi Global Education Advisors</span>
            <span className="text-[#EA580C] hover:underline cursor-pointer">Privacy Policy</span>
            <span className="text-[#EA580C] hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
