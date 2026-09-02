import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Briefcase,
  TrendingUp,
  Wrench,
  Hotel,
  ShieldCheck,
  Building2,
  Plane,
  Search,
  Clock,
  ArrowRight,
  Globe,
  Award,
  DollarSign
} from 'lucide-react';
import { CourseCategory, CountryCode } from '../types';
import { useContent } from '../context/ContentContext';

interface CourseDirectoryProps {
  onOpenBookingWithDetails: (details: string) => void;
}

export const CourseDirectory: React.FC<CourseDirectoryProps> = ({
  onOpenBookingWithDetails
}) => {
  const { courses, countries, selectedCountry, setSelectedCountry, setActiveStudentTab } = useContent();
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#EA580C]" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-amber-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-indigo-600" />;
      case 'Hotel':
        return <Hotel className="w-6 h-6 text-rose-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-teal-600" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-orange-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-[#EA580C]" />;
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      !courseSearch ||
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.topCareers.some((car) => car.toLowerCase().includes(courseSearch.toLowerCase())) ||
      (c.topDestinations && c.topDestinations.some(d => d.toLowerCase().includes(courseSearch.toLowerCase())));

    const matchesCountry =
      selectedCountry === 'all' ||
      !c.countryCode ||
      c.countryCode === selectedCountry ||
      (c.topDestinations && c.topDestinations.some(d => {
        const countryObj = countries.find(co => co.id === selectedCountry);
        return countryObj && d.toLowerCase().includes(countryObj.name.toLowerCase());
      }));

    return matchesSearch && matchesCountry;
  });

  return (
    <section id="courses" className="py-16 bg-[#FDFDFD] text-[#1A202C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold mb-3 uppercase tracking-wider border border-orange-200">
              <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>In-Demand Global & Domestic Programs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A202C] tracking-tight">
              Specialized Course Directory
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Explore high-growth degree disciplines across top institutions in India, Europe, UK, North America, Australia, and the Middle East.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course (e.g. AI, MBA, Data, Fintech)..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A202C] focus:outline-none focus:border-[#EA580C] shadow-2xs"
            />
          </div>
        </div>

        {/* Country Quick Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              selectedCountry === 'all'
                ? 'bg-[#EA580C] text-white shadow-2xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Destinations
          </button>
          {countries.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCountry(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                selectedCountry === c.id
                  ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-2xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Grid of Courses */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 p-3 flex items-center justify-center border border-orange-100 group-hover:scale-105 transition-transform">
                  {getIcon(course.iconName)}
                </div>

                <h3 className="text-lg font-bold text-[#1A202C] group-hover:text-[#EA580C] transition-colors leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> Duration
                  </span>
                  <span className="font-semibold text-[#1A202C]">{course.avgDuration}</span>
                </div>

                <div className="bg-orange-50/80 p-2.5 rounded-xl border border-orange-100 flex justify-between items-center">
                  <span className="text-[11px] text-gray-600 font-medium">Avg Starting Package:</span>
                  <span className="font-bold text-[#EA580C]">{course.startingSalaryDisplay}</span>
                </div>

                {course.topDestinations && course.topDestinations.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      Top Destinations:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {course.topDestinations.map((dest, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-medium"
                        >
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Career Outcomes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {course.topCareers.slice(0, 3).map((career, i) => (
                      <span
                        key={i}
                        className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-medium"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveStudentTab('universities');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Partner Universities</span>
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
