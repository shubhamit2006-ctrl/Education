import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  PhoneCall,
  Globe,
  Menu,
  X,
  UserCheck,
  Building2,
  BookOpen,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Home,
  MessageSquare,
  Award,
  Plane,
  CreditCard,
  Lock,
  LogOut,
  ChevronDown,
  Globe2,
  Check
} from 'lucide-react';
import { Currency, ViewRole, StudentTab, CountryCode } from '../types';
import { useContent } from '../context/ContentContext';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  viewRole: ViewRole;
  onChangeViewRole: (role: ViewRole) => void;
  onOpenBooking: () => void;
  onOpenAdminLogin: () => void;
  isAdminAuthenticated?: boolean;
  onOpenItalyAssessment?: () => void;
  onBackToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewRole,
  onChangeViewRole,
  onOpenBooking,
  onOpenAdminLogin,
  isAdminAuthenticated = false,
  onOpenItalyAssessment,
  onBackToHome
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const {
    siteConfig,
    activeStudentTab,
    setActiveStudentTab,
    selectedCountry,
    setSelectedCountry,
    activeCountries
  } = useContent();

  const currentCountryObj = activeCountries.find(c => c.id === selectedCountry);

  const navTabs: { id: StudentTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'universities', label: 'Colleges & Universities', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'courses', label: 'Course Directory', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'scholarships', label: 'Scholarships & Loans', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'visa-stay', label: 'Visa Guide', icon: <Plane className="w-3.5 h-3.5" /> }
  ];

  const handleTabClick = (tabId: StudentTab) => {
    setActiveStudentTab(tabId);
    if (viewRole !== 'student') {
      onChangeViewRole('student');
    }
    if (onBackToHome) {
      onBackToHome();
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountry = (countryCode: CountryCode) => {
    setSelectedCountry(countryCode);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 transition-colors duration-200">
      {/* Top Banner Ticker */}
      <div className="bg-[#EA580C] text-white text-xs py-2 px-4 text-center overflow-hidden border-b border-orange-700/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-amber-100 font-medium text-xs">
            <span className="inline-flex items-center gap-1.5 bg-black/20 text-white px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-200" /> 2026 Admissions Open
            </span>
            <span className="text-white/95 font-medium truncate">{siteConfig.announcementTicker}</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] text-orange-100 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> {siteConfig.visaSuccessRate} Visa Success
            </span>
            <span className="flex items-center gap-1 text-white font-semibold">
              <PhoneCall className="w-3 h-3 text-amber-200" /> Toll Free: {siteConfig.tollFreePhone}
            </span>
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 text-[11px] text-white hover:text-amber-200 font-bold transition-colors bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-full border border-white/20"
              title="Secure Staff & Admin System Login"
            >
              <Lock className="w-3 h-3 text-amber-200" />
              <span>{isAdminAuthenticated ? 'Admin Portal' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => {
              onChangeViewRole('student');
              setActiveStudentTab('overview');
              if (onBackToHome) {
                onBackToHome();
              }
            }}
            className="flex items-center text-left group focus:outline-none shrink-0 hover:opacity-95 transition-opacity"
            title="PrimiPassi Global Education Advisors"
          >
            <BrandLogo size="md" variant="compact" />
          </button>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Destination Selector Dropdown (Desktop) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-800 flex items-center gap-2 transition-all"
                title="Select destination country focus"
              >
                <Globe className="w-3.5 h-3.5 text-[#EA580C]" />
                <span className="max-w-[130px] truncate">
                  {selectedCountry === 'all' ? 'All Destinations' : `${currentCountryObj?.flag} ${currentCountryObj?.name}`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {countryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCountryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 space-y-1">
                    <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Study Destinations
                      </span>
                      <span className="text-[10px] font-bold text-[#EA580C]">
                        {activeCountries.length} Available
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleSelectCountry('all');
                        setCountryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        selectedCountry === 'all'
                          ? 'bg-[#EA580C] text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>All Destinations (Global)</span>
                      </div>
                      {selectedCountry === 'all' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="max-h-60 overflow-y-auto space-y-0.5 pt-1">
                      {activeCountries.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            handleSelectCountry(c.id);
                            setCountryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                            selectedCountry === c.id
                              ? 'bg-[#EA580C] text-white font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm">{c.flag || '🌐'}</span>
                            <span className="truncate">{c.name}</span>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                            selectedCountry === c.id
                              ? 'bg-white/20 text-white'
                              : c.category === 'domestic'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {c.category === 'domestic' ? 'India' : c.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Italy Eligibility Assessment Quick Trigger */}
            {onOpenItalyAssessment && (
              <button
                onClick={onOpenItalyAssessment}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-full shadow-xs transition-all hover:scale-105"
                title="Free 6-Step Italy Student Eligibility Calculator"
              >
                <span>🇮🇹</span>
                <span>Italy Eligibility Check</span>
              </button>
            )}

            {/* Book Consultation */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-xs sm:text-sm rounded-full shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Free Consultation</span>
              <span className="sm:hidden">Consult</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar (Visible in Student View) */}
        {viewRole === 'student' && (
          <div className="border-t border-slate-100 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-center gap-2 min-w-max">
              {navTabs.map((tab) => {
                const isActive = activeStudentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#EA580C] text-white shadow-md shadow-orange-900/10'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#EA580C] border border-slate-100'
                    }`}
                  >
                    <span className={isActive ? 'text-amber-200' : 'text-slate-500'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              {/* Active Country Filter Tag if selected */}
              {selectedCountry !== 'all' && (
                <div className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 text-[#EA580C] text-xs font-bold border border-orange-200">
                  <span>Filtered: {currentCountryObj?.flag} {currentCountryObj?.name}</span>
                  <button
                    onClick={() => setSelectedCountry('all')}
                    className="hover:bg-orange-200 rounded p-0.5 text-orange-800"
                    title="Clear country filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Country Switcher on Mobile */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Country Focus</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSelectCountry('all')}
                className={`p-2 rounded-lg text-xs font-bold text-left flex items-center gap-2 ${
                  selectedCountry === 'all' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Globe className="w-4 h-4" /> All Countries
              </button>
              {activeCountries.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCountry(c.id)}
                  className={`p-2 rounded-lg text-xs font-semibold text-left flex items-center gap-1.5 truncate ${
                    selectedCountry === c.id ? 'bg-[#EA580C] text-white font-bold' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Role selector mobile */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onChangeViewRole('student');
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 ${
                viewRole === 'student' ? 'bg-[#EA580C] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Compass className="w-4 h-4" /> Explore Portal
            </button>

            <button
              onClick={() => {
                onOpenAdminLogin();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 bg-slate-100 text-slate-700"
            >
              <LayoutDashboard className="w-4 h-4 text-[#EA580C]" /> Admin Portal
            </button>
          </div>

          {/* Student Tabs list */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            {onOpenItalyAssessment && (
              <button
                onClick={() => {
                  onOpenItalyAssessment();
                  setMobileMenuOpen(false);
                }}
                className="w-full mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span>🇮🇹</span>
                  <span>Check Italy Eligibility (Free)</span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                  Instant
                </span>
              </button>
            )}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Sections</p>
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeStudentTab === tab.id
                    ? 'bg-orange-50 text-[#EA580C] font-bold border border-orange-100'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
