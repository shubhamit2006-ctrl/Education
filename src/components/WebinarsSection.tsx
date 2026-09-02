import React, { useState } from 'react';
import { Calendar, Users, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface WebinarsSectionProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const WebinarsSection: React.FC<WebinarsSectionProps> = ({ onOpenBookingWithDetails }) => {
  const { webinars } = useContent();
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const handleRegister = (id: string, title: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds([...registeredIds, id]);
      onOpenBookingWithDetails(`Registered for Webinar: ${title}`);
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> Free Live Interactive Sessions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Dubai Admissions Masterclasses
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-base">
            Join live Q&A webinars with Dubai university directors, immigration experts, and current Indian students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {webinars.map((web) => {
            const isReg = registeredIds.includes(web.id);
            return (
              <div
                key={web.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 relative h-48 sm:h-auto bg-slate-800">
                  <img
                    src={web.image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'}
                    alt={web.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-lg">
                    {web.seatsLeft} SEATS LEFT
                  </div>
                </div>

                <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {web.date} • {web.time}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {web.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Speaker: <span className="font-semibold text-slate-800 dark:text-slate-200">{web.speaker}</span> ({web.role})
                    </p>
                  </div>

                  <button
                    onClick={() => handleRegister(web.id, web.title)}
                    className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 ${
                      isReg
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {isReg ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Seat Reserved!
                      </>
                    ) : (
                      <>
                        <span>Reserve Free Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
