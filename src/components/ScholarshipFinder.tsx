import React, { useState, useMemo } from 'react';
import {
  Award,
  Filter,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Building2,
  Globe,
  DollarSign
} from 'lucide-react';
import { Scholarship, CountryCode } from '../types';
import { useContent } from '../context/ContentContext';

interface ScholarshipFinderProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const ScholarshipFinder: React.FC<ScholarshipFinderProps> = ({
  onOpenBookingWithDetails
}) => {
  const { scholarships, activeCountries, selectedCountry, setSelectedCountry, siteConfig } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const activeCountryIds = new Set(activeCountries.map((c) => c.id));

  // Only consider scholarships for active (visible) countries
  const activeScholarships = useMemo(() => {
    return scholarships.filter((s) => !s.countryCode || activeCountryIds.has(s.countryCode));
  }, [scholarships, activeCountries]);

  // Dynamically extract categories from all active scholarships
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    activeScholarships.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [activeScholarships]);

  const filteredScholarships = useMemo(() => {
    return activeScholarships.filter((s) => {
      const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
      const matchesCountry =
        selectedCountry === 'all' || !s.countryCode || s.countryCode === selectedCountry;
      return matchesCat && matchesCountry;
    });
  }, [activeScholarships, selectedCategory, selectedCountry]);

  return (
    <section id="scholarships" className="py-20 bg-[#FDFDFD] text-[#1A202C] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200 shadow-2xs">
              <Award className="w-3.5 h-3.5" /> {siteConfig.grantsAllocatedInr || '₹18.5 Cr+'} Total Grants Secured
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Global & Domestic Scholarship Grants
            </h2>
            <p className="mt-2 text-slate-600 text-base max-w-2xl">
              Discover fully funded government grants, Italy 100% DSU allowances, university merit waivers, and domestic scholarship quotas.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#EA580C] text-white font-bold shadow-md shadow-orange-500/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat === 'ALL' ? 'All Grant Types' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCountry === 'all'
                ? 'bg-[#EA580C] text-white shadow-2xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Destinations ({activeScholarships.length})
          </button>
          {activeCountries.map((c) => {
            const count = activeScholarships.filter((s) => s.countryCode === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                  selectedCountry === c.id
                    ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-2xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    selectedCountry === c.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scholarships Grid */}
        {filteredScholarships.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-1" />
            <h3 className="font-bold text-slate-700 text-sm">No scholarships matching your selection</h3>
            <p className="text-xs text-slate-500">Try switching to all destinations or resetting the grant type filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedCountry('all');
              }}
              className="mt-2 text-xs font-bold text-[#EA580C] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((sch) => {
              const countryObj = sch.countryCode ? activeCountries.find(c => c.id === sch.countryCode) : null;

              return (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  {sch.featured && (
                    <div className="absolute top-0 right-0 bg-[#EA580C] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-xs">
                      TOP RECOMMENDATION
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-[#EA580C]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>{sch.university}</span>
                      </div>
                      {countryObj ? (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-semibold flex items-center gap-1">
                          <span>{countryObj.flag}</span>
                          <span>{countryObj.name}</span>
                        </span>
                      ) : sch.country ? (
                        <span className="text-[10px] bg-orange-50 text-orange-800 px-1.5 py-0.2 rounded border border-orange-100 font-semibold">
                          {sch.country}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                      {sch.name}
                    </h3>

                    <div className="bg-orange-50/70 p-3.5 rounded-xl border border-orange-100">
                      <span className="text-[10px] uppercase font-bold text-orange-700 block">Grant Amount / Coverage</span>
                      <span className="text-lg font-extrabold text-[#EA580C]">{sch.amount}</span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <p>
                        <span className="font-semibold text-gray-900">Eligibility:</span> {sch.eligibility}
                      </p>
                      <p className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-[#EA580C]" /> Deadline: <span className="font-bold text-gray-800">{sch.deadline}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenBookingWithDetails(`Applying for ${sch.name} at ${sch.university} (${sch.country || countryObj?.name || 'Global'})`)}
                      className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <span>Apply & Claim Grant</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
