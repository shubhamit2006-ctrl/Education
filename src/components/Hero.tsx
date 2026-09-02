import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  Globe2,
  Search,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { CountryCode } from '../types';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreUnis: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreUnis
}) => {
  const { siteConfig, universities, countries, selectedCountry, setSelectedCountry, setActiveStudentTab } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [targetDegree, setTargetDegree] = useState('all');

  const handleCountryBadgeClick = (cId: CountryCode) => {
    setSelectedCountry(cId);
    setActiveStudentTab('universities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStudentTab('universities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 bg-[#FDFDFD] text-[#1A202C]">
      {/* Background Graphic Subdued Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/60 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-50 text-[#EA580C] text-xs font-bold tracking-wider uppercase rounded-full mb-6 border border-orange-200/80 shadow-xs">
          <Globe2 className="w-3.5 h-3.5" />
          <span>{siteConfig.eyebrowBadge}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A202C] leading-[1.12] mb-6">
              {siteConfig.heroTitle}<br />
              <span className="text-[#EA580C]">{siteConfig.heroHighlightText}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mb-8">
              {siteConfig.heroSubtitle}
            </p>

            {/* Quick Country Destination Selector Pills */}
            <div className="mb-8">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Select Your Preferred Study Destination:</span>
                <span className="text-[#EA580C] font-semibold text-[11px]">{countries.length} Destinations Available</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {countries.map((c) => {
                  const isSelected = selectedCountry === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCountryBadgeClick(c.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      {c.category === 'domestic' && (
                        <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                        }`}>
                          India
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Search Box */}
            <form onSubmit={handleHeroSearch} className="p-2 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-orange-500/5 mb-8 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-6 flex items-center px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search degree, course, or university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
                <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-gray-100 px-3 py-2">
                  <select
                    value={targetDegree}
                    onChange={(e) => setTargetDegree(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Degrees</option>
                    {(siteConfig.bookingFormDegreeOptions && siteConfig.bookingFormDegreeOptions.length > 0
                      ? siteConfig.bookingFormDegreeOptions
                      : ['Undergraduate (Bachelors)', 'Masters / Post-Graduate', 'MBA / Executive Management', 'PhD / Doctorate']
                    ).map((deg) => (
                      <option key={deg} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Editorial Stats Row */}
            <div className="flex items-center gap-6 sm:gap-10 pb-6 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-[#EA580C]">{siteConfig.visaSuccessRate}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Visa & Seat Success</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-[#EA580C]">{siteConfig.partnerUniCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Partner Campuses</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-[#C5A059]">{siteConfig.avgStartingSalary}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Avg Starting Package</span>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
              <button
                onClick={onOpenBooking}
                className="px-8 py-4 bg-[#EA580C] text-white font-bold text-sm sm:text-base rounded-xl shadow-xl shadow-orange-600/25 hover:translate-y-[-2px] hover:bg-[#C2410C] active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <span>Book Free Profile Evaluation</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={onExploreUnis}
                className="px-7 py-4 bg-slate-900 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-800"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Explore All 450+ Colleges</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Showcase Column */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl group text-left">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                  alt="Global & Domestic higher education students"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#EA580C] text-[11px] font-extrabold rounded-full shadow-lg border border-white/40 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Global & Domestic Admissions</span>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>2026-27 Intake Open</span>
                  </div>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold tracking-wider uppercase">
                    <Users className="w-4 h-4" />
                    <span>11 Accredited Destination Countries</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    India (Domestic) & Top Overseas Study Hubs
                  </h3>
                  <p className="text-xs text-slate-200 font-normal leading-relaxed line-clamp-2">
                    Italy 100% DSU scholarships, Germany tuition-free state unis, UK 1-year Masters, US 3-year STEM OPT, and premier Indian institute quotas.
                  </p>
                </div>
              </div>

              {/* Bottom Quick Destination Cards Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-slate-500">Student Satisfaction</p>
                  <p className="text-xs font-extrabold text-[#EA580C] flex items-center gap-1">
                    <span className="text-amber-500">★ 4.95/5</span> across 25,000+ Students Placed
                  </p>
                </div>
                <button
                  onClick={onExploreUnis}
                  className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <span>View Colleges</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Official Partners Banner */}
        <div className="pt-12 mt-10 border-t border-slate-100">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">
            Partner Institutions Across India, Europe, UK, USA, Canada, Australia & UAE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {universities.slice(0, 8).map((uni) => (
              <div
                key={uni.id}
                onClick={() => {
                  setSelectedCountry(uni.countryCode);
                  setActiveStudentTab('universities');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-semibold text-gray-800 flex items-center gap-2 hover:border-orange-400 hover:text-[#EA580C] transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>{uni.shortName}</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded font-normal">
                  {uni.country}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
