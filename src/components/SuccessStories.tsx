import React from 'react';
import { Star, Quote, Award, Briefcase, CheckCircle2, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const SuccessStories: React.FC = () => {
  const { testimonials, siteConfig } = useContent();

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFFDF9] to-white text-[#1A202C] transition-colors border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-[#EA580C] text-[#EA580C]" />
            <span>Alumni Verified Reviews</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight">
            Students Transformed Across Global & Domestic Campuses
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            Discover real stories from Indian students who achieved 100% Italy DSU regional grants, tuition-free German universities, premier UK degrees, and top domestic seats.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between space-y-5 relative"
            >
              <Quote className="w-8 h-8 text-orange-300 opacity-40 absolute top-5 right-5" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80'}
                    alt={t.studentName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-orange-300 shadow-2xs shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{t.studentName}</h3>
                    <p className="text-xs text-slate-500">{t.hometown}</p>
                  </div>
                </div>

                <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-100/80 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#EA580C] line-clamp-1">{t.university}</p>
                    {t.destinationCountry && (
                      <span className="text-[10px] bg-white text-orange-900 font-bold px-1.5 py-0.2 rounded border border-orange-100 shrink-0">
                        {t.destinationCountry}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] truncate">{t.course}</p>
                  <p className="text-emerald-700 font-bold text-[11px]">{t.scholarshipReceived}</p>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Placement</span>
                  <span className="font-bold text-gray-900 text-xs truncate max-w-[120px] block">{t.currentRole}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Package</span>
                  <span className="font-bold text-[#EA580C] text-xs">{t.currentSalaryLPA || t.currentSalaryDisplay}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
