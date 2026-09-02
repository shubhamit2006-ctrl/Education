import React from 'react';
import {
  Globe,
  ShieldCheck,
  Building2,
  DollarSign,
  Plane,
  HeartHandshake,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WhyDubaiProps {
  onOpenBooking: () => void;
}

export const WhyDubai: React.FC<WhyDubaiProps> = ({ onOpenBooking }) => {
  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-[#EA580C]" />,
      title: '100% Tax-Free Salaries',
      description: 'Keep 100% of your earnings. No income tax or capital gains tax means faster loan payoff and high savings.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'World’s Safest City for Students',
      description: 'Ranked #1 globally for public safety, 24/7 student security, and high quality of life.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#EA580C]" />,
      title: '10-Year UAE Golden Visa',
      description: 'Graduates with high academic distinction qualify for a 10-year self-sponsored residency visa.'
    },
    {
      icon: <Building2 className="w-6 h-6 text-amber-600" />,
      title: 'Fortune 500 Global Hub',
      description: 'Headquarters for Google, Microsoft, Amazon, Deloitte, Emaar, and Emirates Airlines right next to campus.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
      title: '3.5 Million Indian Diaspora',
      description: 'Familiar culture, authentic Indian food, festivals, and strong alumni network across UAE.'
    },
    {
      icon: <Plane className="w-6 h-6 text-[#EA580C]" />,
      title: '3.5 Hour Direct Flights Home',
      description: 'Fly back to Delhi, Mumbai, Bangalore, or Kochi in under 4 hours with cheap daily flights.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50/60 via-white to-orange-50/40 text-[#1A202C] relative overflow-hidden border-t border-b border-orange-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200">
            <Globe className="w-3.5 h-3.5" /> Why Choose Dubai Over UK / US?
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A202C] tracking-tight">
            The World’s #1 Study & Career Destination
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Get top-tier UK & US degrees at 40% lower overall cost while living in a futuristic, tax-free global metropolis.
          </p>
        </div>

        {/* Grid of Infographic Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-slate-200/80 hover:border-orange-300 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 space-y-4 shadow-sm group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform shadow-xs">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1A202C] group-hover:text-[#EA580C] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FB923C] p-8 sm:p-10 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-500/25 border border-orange-400/40">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-amber-200" /> Free Guidance
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ready to begin your Dubai Journey?</h3>
            <p className="text-sm text-orange-100 max-w-xl">
              Talk to our expert counselors who have placed over 15,000 students in accredited Dubai universities.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="whitespace-nowrap px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Book 1-on-1 Free Session</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
