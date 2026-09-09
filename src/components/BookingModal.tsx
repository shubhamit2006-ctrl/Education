import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Mail,
  Send,
  Globe2
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { CounsellingBooking, CountryCode } from '../types';
import { DateTimePicker, formatSlotString, formatDateString } from './DateTimePicker';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDetails?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  prefilledDetails = ''
}) => {
  const { addCounsellingBooking, siteConfig, activeCountries, selectedCountry } = useContent();

  const degreeOptions = siteConfig.bookingFormDegreeOptions && siteConfig.bookingFormDegreeOptions.length > 0
    ? siteConfig.bookingFormDegreeOptions
    : ['Undergraduate (Bachelors)', 'Masters / Post-Graduate', 'MBA / Executive Management', 'PhD / Doctorate'];

  const intakeOptions = siteConfig.bookingFormIntakeOptions && siteConfig.bookingFormIntakeOptions.length > 0
    ? siteConfig.bookingFormIntakeOptions
    : ['September 2026', 'January 2027', 'May 2027', 'September 2027', 'Immediate 2026 Admissions'];

  const slotOptions = siteConfig.bookingFormSlotOptions && siteConfig.bookingFormSlotOptions.length > 0
    ? siteConfig.bookingFormSlotOptions
    : ['11:00 AM IST (Morning)', '2:00 PM IST (Afternoon)', '4:00 PM IST (Evening)', '7:30 PM IST (Late Evening)'];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetCountry, setTargetCountry] = useState<string>(
    selectedCountry !== 'all' ? selectedCountry : 'italy'
  );
  const [intake, setIntake] = useState(intakeOptions[0] || 'September 2026');
  const [degree, setDegree] = useState(degreeOptions[0] || 'Masters / Post-Graduate');

  // Interactive Date & Time Picker for Callback
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Default to tomorrow
    return d;
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [selectedSlot, setSelectedSlot] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatSlotString(d, '10:00 AM');
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastLead, setLastLead] = useState<CounsellingBooking | null>(null);

  if (!isOpen) return null;

  const handleDateTimeChange = (date: Date, time: string, formattedSlot: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedSlot(formattedSlot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    const lead = addCounsellingBooking({
      fullName,
      email,
      phone,
      targetCountry,
      intake,
      degree,
      selectedSlot,
      callbackDate: formatDateString(selectedDate),
      callbackTime: selectedTime,
      prefilledDetails: prefilledDetails || 'General Admission Counseling Inquiry'
    });

    setLastLead(lead);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {siteConfig.bookingFormBadge || 'Free 1-on-1 Mentorship'}
              </span>
              <h3 className="text-2xl font-black mt-1 text-gray-900">
                {siteConfig.bookingFormTitle || 'Book Free Admissions Consultation'}
              </h3>
              <p className="text-xs text-slate-500">
                {siteConfig.bookingFormSubtitle || 'Connect with our senior study abroad & domestic advisors for course selection, 100% scholarships, and visa filing.'}
              </p>
            </div>

            {prefilledDetails && (
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-xs text-orange-900">
                <span className="font-bold">Topic:</span> {prefilledDetails}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Preferred Destination</label>
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  >
                    <option value="all">Multiple / Undecided</option>
                    {activeCountries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name} {c.category === 'domestic' ? '(Domestic)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Degree Level</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  >
                    {degreeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Target Intake</label>
                  <select
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  >
                    {intakeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Callback Date & Time</label>
                  <DateTimePicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onChange={handleDateTimeChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{siteConfig.bookingFormCtaText || 'Confirm 100% Free Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              No service charges. Fast response within 30 minutes via WhatsApp & Call.
            </p>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Consultation Scheduled!</h3>

            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Thank you, <span className="font-bold text-gray-900">{fullName}</span>! Our lead academic counselor has reserved your slot for{' '}
              <span className="font-bold text-[#EA580C]">{selectedSlot}</span>.
            </p>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-xs text-left space-y-2">
              <p className="font-bold text-gray-900">What happens next?</p>
              <div className="space-y-1.5 text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Personalized shortlist of universities matching your profile & budget.</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Estimated scholarship eligibility (up to 100% tuition waiver).</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Step-by-step visa roadmap and timeline.</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done & Explore Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
