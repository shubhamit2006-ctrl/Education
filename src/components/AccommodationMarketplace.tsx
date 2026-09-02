import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Star,
  CheckCircle2,
  Wifi,
  Tv,
  Coffee,
  Car,
  Search,
  ArrowRight,
  Compass
} from 'lucide-react';
import { Accommodation, Currency } from '../types';
import { DUB_AED_TO_INR } from '../data/mockData';
import { useContent } from '../context/ContentContext';

interface AccommodationMarketplaceProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const AccommodationMarketplace: React.FC<AccommodationMarketplaceProps> = ({
  onOpenBookingWithDetails
}) => {
  const { accommodations } = useContent();
  const [typeFilter, setTypeFilter] = useState('ALL');

  const formatRent = (rentAED: number) => {
    const inr = Math.round(rentAED * DUB_AED_TO_INR);
    return `₹${inr.toLocaleString()} / mo`;
  };

  const filtered = accommodations.filter(
    (acc) => typeFilter === 'ALL' || acc.type === typeFilter
  );

  return (
    <section id="accommodation" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" /> Verified Student Residences
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dubai Student Housing Marketplace
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-base max-w-2xl">
              Book safe, fully-furnished student residences with daily campus shuttles, Indian mess food, and 24/7 security.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['ALL', 'Student Residence', 'Co-Living', 'Hostel', 'Private Apartment'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  typeFilter === type
                    ? 'bg-[#EA580C] text-white shadow'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {type === 'ALL' ? 'All Housing' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((acc) => (
            <div
              key={acc.id}
              className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={acc.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80'}
                  alt={acc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 border border-white/10">
                  {acc.type}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs">
                  <span className="flex items-center gap-1 font-semibold text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" /> {acc.location}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-400" /> {acc.rating}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#EA580C] transition-colors">
                    {acc.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Distance: <span className="font-semibold text-slate-700 dark:text-slate-200">{acc.distanceKm} km to Campus</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {acc.amenities.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Monthly Rent</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {formatRent(acc.monthlyRentAED)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBookingWithDetails(`Reserving Housing at ${acc.name}`)}
                  className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Book Virtual Tour</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
