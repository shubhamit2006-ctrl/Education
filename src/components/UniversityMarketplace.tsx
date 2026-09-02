import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowRight,
  MapPin,
  TrendingUp,
  DollarSign,
  Download,
  X,
  Share2,
  Globe,
  Sparkles,
  BookOpen,
  Check,
  LayoutGrid,
  Layers,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';
import { University, CountryCode } from '../types';
import { useContent } from '../context/ContentContext';

interface UniversityMarketplaceProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const UniversityMarketplace: React.FC<UniversityMarketplaceProps> = ({
  onOpenBookingWithDetails
}) => {
  const { universities, activeCountries, selectedCountry, setSelectedCountry } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'domestic' | 'overseas'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');
  const [selectedUniModal, setSelectedUniModal] = useState<University | null>(null);
  const [comparedUnis, setComparedUnis] = useState<University[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  const activeCountryIds = new Set(activeCountries.map((c) => c.id));

  // Only display universities belonging to active (visible) countries
  const activeUniversities = universities.filter((uni) =>
    activeCountryIds.has(uni.countryCode)
  );

  const filteredUniversities = activeUniversities.filter((uni) => {
    // Country Filter
    const matchesCountry = selectedCountry === 'all' || uni.countryCode === selectedCountry;

    // Category Filter (domestic vs overseas)
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'domestic' && uni.countryCategory === 'domestic') ||
      (categoryFilter === 'overseas' && uni.countryCategory === 'overseas');

    // Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      uni.name.toLowerCase().includes(query) ||
      uni.shortName.toLowerCase().includes(query) ||
      uni.location.toLowerCase().includes(query) ||
      (uni.city && uni.city.toLowerCase().includes(query)) ||
      (uni.country && uni.country.toLowerCase().includes(query)) ||
      uni.popularCourses.some((c) => c.toLowerCase().includes(query));

    return matchesCountry && matchesCategory && matchesSearch;
  });

  // Group filtered universities by country (only active countries)
  const groupedByCountry = activeCountries
    .map((c) => ({
      country: c,
      unis: filteredUniversities.filter((u) => u.countryCode === c.id)
    }))
    .filter((group) => group.unis.length > 0);

  const toggleCompare = (uni: University) => {
    if (comparedUnis.some((u) => u.id === uni.id)) {
      setComparedUnis(comparedUnis.filter((u) => u.id !== uni.id));
    } else {
      if (comparedUnis.length >= 3) {
        alert('You can compare a maximum of 3 universities at once.');
        return;
      }
      setComparedUnis([...comparedUnis, uni]);
      setCompareDrawerOpen(true);
    }
  };

  const getCountryFlag = (code: CountryCode) => {
    const c = activeCountries.find((item) => item.id === code);
    return c ? c.flag : '🌐';
  };

  const renderUniversityCard = (uni: University) => {
    const isCompared = comparedUnis.some((u) => u.id === uni.id);
    const countryObj = activeCountries.find((c) => c.id === uni.countryCode);

    return (
      <div
        key={uni.id}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col overflow-hidden group"
      >
        {/* Image Banner */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
          <img
            src={uni.image || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80'}
            alt={uni.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C] via-[#1A202C]/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-sm text-xs font-bold text-gray-800">
              <span>{getCountryFlag(uni.countryCode)}</span>
              <span>{uni.country}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                uni.countryCategory === 'domestic' ? 'bg-amber-100 text-amber-900' : 'bg-orange-100 text-orange-900'
              }`}>
                {uni.countryCategory === 'domestic' ? 'Domestic' : 'Overseas'}
              </span>
            </div>

            {uni.scholarshipsMaxPct > 0 && (
              <span className="bg-[#EA580C] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm">
                {uni.scholarshipsMaxPct === 100 ? '100% Full Scholarship' : `Up to ${uni.scholarshipsMaxPct}% Grant`}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow">
                <img
                  src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'}
                  alt={uni.shortName}
                  className="w-full h-full object-cover rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs font-semibold text-slate-100 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{uni.city || uni.location.split(',')[0]}</span>
              </span>
            </div>

            {uni.rankingGlobal && (
              <span className="text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20 font-medium">
                {uni.rankingGlobal}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span className="text-emerald-700 font-bold">
                {uni.placementRate}% Placement Rate
              </span>
              <span>•</span>
              <span>{uni.acceptanceRate}% Acceptance</span>
            </div>

            <h3 className="text-base font-bold text-[#1A202C] group-hover:text-[#EA580C] transition-colors leading-snug">
              {uni.name}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {uni.description}
            </p>
          </div>

          {/* Tuition & Course Details */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Undergrad Tuition:</span>
              <span className="font-bold text-[#EA580C]">{uni.undergradFeesDisplay}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Masters Tuition:</span>
              <span className="font-bold text-[#EA580C]">{uni.mastersFeesDisplay}</span>
            </div>

            {/* Popular Course Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {uni.popularCourses.slice(0, 3).map((course, idx) => (
                <span
                  key={idx}
                  className="bg-orange-50/70 text-[#EA580C] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-orange-100/60"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => toggleCompare(uni)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                isCompared
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isCompared ? '✓ Compared' : '+ Compare'}
            </button>

            <button
              onClick={() => setSelectedUniModal(uni)}
              className="py-2 px-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="universities" className="py-16 bg-[#FDFDFD] text-[#1A202C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Global & Domestic Higher Education Directory</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A202C] tracking-tight">
              Colleges & Universities Directory
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Explore 450+ accredited partner institutions across India (Domestic) and top overseas study destinations in Italy, UK, USA, Canada, Germany, Australia, and more.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search college, course, city, country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A202C] focus:outline-none focus:border-[#EA580C] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scope Filter Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-white text-[#EA580C] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Scope
              </button>
              <button
                onClick={() => setCategoryFilter('domestic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === 'domestic'
                    ? 'bg-white text-[#EA580C] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇮🇳 Domestic (India)
              </button>
              <button
                onClick={() => setCategoryFilter('overseas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  categoryFilter === 'overseas'
                    ? 'bg-white text-[#EA580C] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌐 Overseas
              </button>
            </div>

            {/* Layout Toggle (Grid vs Grouped by Country) */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#EA580C] shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grouped')}
                title="Group by Country View"
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'grouped' ? 'bg-white text-[#EA580C] shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Country Filter Navigation Bar */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCountry === 'all'
                  ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-md shadow-orange-500/20'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Destinations ({activeUniversities.length})</span>
            </button>

            {activeCountries.map((c) => {
              const isSelected = selectedCountry === c.id;
              const count = activeUniversities.filter((u) => u.countryCode === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <span className="text-sm">{c.flag}</span>
                  <span>{c.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Strip */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 border-b border-gray-100 pb-3">
          <div>
            Showing <span className="font-bold text-gray-900">{filteredUniversities.length}</span> institutions
            {selectedCountry !== 'all' && (
              <span> for <strong className="text-[#EA580C]">{activeCountries.find(c => c.id === selectedCountry)?.name}</strong></span>
            )}
            {categoryFilter !== 'all' && (
              <span> under <strong className="text-[#EA580C]">{categoryFilter === 'domestic' ? 'Domestic (India)' : 'Overseas'}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              View: <strong className="text-slate-700">{viewMode === 'grid' ? 'Grid' : 'Categorized by Country'}</strong>
            </span>
            {(selectedCountry !== 'all' || categoryFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCountry('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="text-[#EA580C] font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* University Cards Grid or Country Grouped View */}
        {filteredUniversities.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-8">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No institutions found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search keywords or switching destination country filters.
            </p>
            <button
              onClick={() => {
                setSelectedCountry('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Show All Universities
            </button>
          </div>
        ) : viewMode === 'grouped' ? (
          /* GROUPED BY COUNTRY VIEW */
          <div className="space-y-12">
            {groupedByCountry.map(({ country, unis }) => (
              <div key={country.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-orange-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-[#1A202C]">
                          {country.name}
                        </h3>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          country.category === 'domestic'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-orange-50 text-[#EA580C] border-orange-200'
                        }`}>
                          {country.category === 'domestic' ? '🇮🇳 Domestic Category' : '🌐 Overseas Category'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {country.visaTimeline} • {country.postStudyWork} Post-Study Work • {country.topScholarship}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full border border-orange-200 self-start sm:self-auto">
                    {unis.length} {unis.length === 1 ? 'College' : 'Colleges'} Listed
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unis.map((uni) => renderUniversityCard(uni))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* STANDARD GRID VIEW */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUniversities.map((uni) => renderUniversityCard(uni))}
          </div>
        )}
      </div>

      {/* University Details Modal */}
      {selectedUniModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUniModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-gray-700 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedUniModal.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'}
                alt={selectedUniModal.name}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                    {getCountryFlag(selectedUniModal.countryCode)} {selectedUniModal.country}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    selectedUniModal.countryCategory === 'domestic' ? 'bg-amber-100 text-amber-900' : 'bg-orange-100 text-orange-900'
                  }`}>
                    {selectedUniModal.countryCategory === 'domestic' ? 'Domestic' : 'Overseas'}
                  </span>
                  {selectedUniModal.rankingGlobal && (
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                      {selectedUniModal.rankingGlobal}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedUniModal.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{selectedUniModal.location}</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedUniModal.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-orange-50/60 border border-orange-100 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Scholarship</p>
                <p className="text-sm font-extrabold text-[#EA580C] mt-0.5">
                  {selectedUniModal.scholarshipsMaxPct === 100 ? '100% DSU / Grant' : `Up to ${selectedUniModal.scholarshipsMaxPct}%`}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Acceptance Rate</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedUniModal.acceptanceRate}%</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Placement Rate</p>
                <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{selectedUniModal.placementRate}%</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Avg Fees / Year</p>
                <p className="text-sm font-extrabold text-amber-600 mt-0.5">
                  {selectedUniModal.mastersFeesDisplay || selectedUniModal.undergradFeesDisplay}
                </p>
              </div>
            </div>

            {/* Popular Programs */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Featured Degree Programs</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUniModal.popularCourses.map((c, i) => (
                  <span
                    key={i}
                    className="bg-orange-50 text-[#EA580C] text-xs px-3 py-1 rounded-lg border border-orange-100 font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Placement Partners */}
            {selectedUniModal.industryPartners && selectedUniModal.industryPartners.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Top Recruiters & Placement Partners</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUniModal.industryPartners.map((partner, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-lg border border-slate-200 font-semibold"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  const name = selectedUniModal.name;
                  const country = selectedUniModal.country;
                  setSelectedUniModal(null);
                  onOpenBookingWithDetails(`Applying to ${name} (${country})`);
                }}
                className="w-full sm:flex-1 py-3.5 bg-[#EA580C] hover:bg-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <span>Apply & Claim Scholarship Assistance</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  alert(`Official admission guide & prospectus for ${selectedUniModal.name} (${selectedUniModal.country}) has been sent.`);
                }}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 text-[#EA580C]" />
                <span>Download Brochure</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Compare Drawer */}
      {compareDrawerOpen && comparedUnis.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 text-white shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Comparing {comparedUnis.length}/3 Universities
            </span>
            <button
              onClick={() => setCompareDrawerOpen(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
            {comparedUnis.map((u) => (
              <div key={u.id} className="flex justify-between items-center bg-slate-800 p-2 rounded-lg">
                <span className="font-semibold text-white">
                  {getCountryFlag(u.countryCode)} {u.shortName}
                </span>
                <span className="text-orange-400 font-semibold">{u.undergradFeesDisplay}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const summary = comparedUnis.map((u) => `${u.name} (${u.country})`).join(', ');
              onOpenBookingWithDetails(`Comparing Universities: ${summary}`);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md text-center"
          >
            Get Free Comparative Counselor Assessment
          </button>
        </div>
      )}
    </section>
  );
};

