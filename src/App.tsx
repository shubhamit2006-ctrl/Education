import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UniversityMarketplace } from './components/UniversityMarketplace';
import { CourseDirectory } from './components/CourseDirectory';
import { WhyDubai } from './components/WhyDubai';
import { ScholarshipFinder } from './components/ScholarshipFinder';
import { LoanMarketplace } from './components/LoanMarketplace';
import { VisaCenter } from './components/VisaCenter';
import { PlacementHub } from './components/PlacementHub';
import { JourneyTimeline } from './components/JourneyTimeline';
import { SuccessStories } from './components/SuccessStories';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ItalyEligibilityAssessment } from './components/ItalyEligibilityAssessment';

import { BookingModal } from './components/BookingModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

import { ViewRole } from './types';
import { MessageCircle } from 'lucide-react';
import { useContent } from './context/ContentContext';
import { auth, isAuthorizedAdminEmail } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export function App() {
  const [viewRole, setViewRole] = useState<ViewRole>('student');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState('');

  const [isAssessmentRoute, setIsAssessmentRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path.includes('italy-eligibility') ||
      path.includes('italy-assessment') ||
      hash.includes('italy-eligibility') ||
      hash.includes('italy-assessment')
    );
  });

  const { activeStudentTab, setActiveStudentTab } = useContent();

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAssessmentRoute(
        path.includes('italy-eligibility') ||
        path.includes('italy-assessment') ||
        hash.includes('italy-eligibility') ||
        hash.includes('italy-assessment')
      );
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenItalyAssessment = () => {
    window.history.pushState(null, '', '/italy-eligibility-assessment');
    setIsAssessmentRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    window.history.pushState(null, '', '/');
    setIsAssessmentRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedAdminEmail(user.email)) {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
        if (viewRole === 'admin') {
          setViewRole('student');
        }
      }
    });
    return () => unsubscribe();
  }, [viewRole]);

  const handleOpenBookingWithDetails = (details: string) => {
    setBookingDetails(details);
    setBookingOpen(true);
  };

  const handleOpenAdminLogin = () => {
    if (isAdminAuthenticated) {
      setViewRole('admin');
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleChangeViewRole = (role: ViewRole) => {
    if (role === 'admin' && !isAdminAuthenticated) {
      setAdminLoginOpen(true);
      return;
    }
    setViewRole(role);
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign-out issue:', e);
    }
    setIsAdminAuthenticated(false);
    setViewRole('student');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A202C] font-sans antialiased selection:bg-orange-500/20 selection:text-[#EA580C]">
      {/* Top Navbar */}
      <Navbar
        viewRole={viewRole}
        onChangeViewRole={handleChangeViewRole}
        onOpenBooking={() => handleOpenBookingWithDetails('General Counseling Inquiry')}
        onOpenAdminLogin={handleOpenAdminLogin}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenItalyAssessment={handleOpenItalyAssessment}
        onBackToHome={handleBackToHome}
      />

      {/* Role View Routing */}
      {viewRole === 'admin' && isAdminAuthenticated && (
        <AdminDashboard
          onLogout={handleAdminLogout}
        />
      )}

      {viewRole === 'student' && (
        <main>
          {isAssessmentRoute ? (
            <ItalyEligibilityAssessment
              onBackToHome={handleBackToHome}
              onOpenBookingWithDetails={handleOpenBookingWithDetails}
            />
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeStudentTab === 'overview' && (
                <>
                  <Hero
                    onOpenBooking={() => handleOpenBookingWithDetails('Hero CTA Booking')}
                    onExploreUnis={() => {
                      setActiveStudentTab('universities');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                  <WhyDubai onOpenBooking={() => handleOpenBookingWithDetails('Why Dubai Consultation')} />
                  <JourneyTimeline />
                  <SuccessStories />
                  <FaqSection />
                </>
              )}

              {/* TAB 2: UNIVERSITIES MARKETPLACE */}
              {activeStudentTab === 'universities' && (
                <>
                  <UniversityMarketplace
                    onOpenBookingWithDetails={handleOpenBookingWithDetails}
                  />
                </>
              )}

              {/* TAB 3: COURSES DIRECTORY */}
              {activeStudentTab === 'courses' && (
                <>
                  <CourseDirectory
                    onOpenBookingWithDetails={handleOpenBookingWithDetails}
                  />
                  <PlacementHub onOpenBooking={() => handleOpenBookingWithDetails('Placement Hub CTA')} />
                </>
              )}

              {/* TAB 4: SCHOLARSHIPS & LOANS */}
              {activeStudentTab === 'scholarships' && (
                <>
                  <ScholarshipFinder
                    onOpenBookingWithDetails={handleOpenBookingWithDetails}
                  />
                  <LoanMarketplace
                    onOpenBookingWithDetails={handleOpenBookingWithDetails}
                  />
                </>
              )}

              {/* TAB 5: VISA GUIDE */}
              {activeStudentTab === 'visa-stay' && (
                <>
                  <VisaCenter
                    onOpenBookingWithDetails={handleOpenBookingWithDetails}
                    onOpenItalyAssessment={handleOpenItalyAssessment}
                  />
                </>
              )}
            </>
          )}

          {/* Global Footer */}
          <Footer onOpenItalyAssessment={handleOpenItalyAssessment} />
        </main>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Floating WhatsApp / Phone Consult */}
        <button
          onClick={() => handleOpenBookingWithDetails('Floating WhatsApp Consultation')}
          className="w-12 h-12 rounded-full bg-emerald-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          title="Connect on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prefilledDetails={bookingDetails}
      />

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setAdminLoginOpen(false);
          setViewRole('admin');
        }}
      />
    </div>
  );
}

export default App;
