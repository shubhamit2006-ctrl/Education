import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Globe, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const FaqSection: React.FC = () => {
  const { faqs, countries } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ['All', ...Array.from(set)];
  }, [faqs]);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' ||
        f.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [faqs, searchQuery, selectedCategory]);

  return (
    <section id="faqs" className="py-20 bg-[#FFFDFB] border-t border-slate-200/60 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 border border-orange-200/80 text-[#EA580C] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Admission Advisory Q&A</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A202C] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about domestic (India) and overseas admissions, scholarships, loans, visas, and student life.
          </p>
        </div>

        {/* Search Input & Category Pills */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic (e.g. DSU Scholarship, IELTS, Germany tuition, Bank loans)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center justify-center flex-wrap gap-1.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIdx(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordions */}
        {filtered.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No matching questions found</h3>
            <p className="text-xs text-slate-500">
              Try searching with a different term or clear your category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 text-xs font-bold text-[#EA580C] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filtered.map((item, idx) => {
              const isOpen = openIdx === idx;
              const countryObj = item.countryCode
                ? countries.find((c) => c.id === item.countryCode)
                : null;

              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-orange-200 shadow-sm ring-1 ring-orange-100'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.category && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-50 text-[#EA580C] border border-orange-100">
                            {item.category}
                          </span>
                        )}
                        {countryObj && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200">
                            <span>{countryObj.flag}</span>
                            <span>{countryObj.name}</span>
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-[#1A202C] text-sm sm:text-base leading-snug block">
                        {item.question}
                      </span>
                    </div>

                    <div className="pt-1 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#EA580C]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 whitespace-pre-line bg-[#FFFDFB]">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
