import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  University,
  CourseCategory,
  Scholarship,
  LoanProvider,
  Accommodation,
  Webinar,
  BlogPost,
  Testimonial,
  FAQItem,
  SiteConfig,
  StudentTab,
  PdfDocument,
  CounsellingBooking,
  CountryCode,
  CountryDestination
} from '../types';
import {
  COUNTRIES_DATA,
  MOCK_UNIVERSITIES,
  MOCK_COURSES,
  MOCK_SCHOLARSHIPS,
  MOCK_LOAN_PROVIDERS,
  MOCK_ACCOMMODATIONS,
  MOCK_WEBINARS,
  MOCK_BLOGS,
  MOCK_TESTIMONIALS
} from '../data/mockData';
import { submitLeadToFirestore, AUTHORIZED_ADMIN_EMAIL } from '../lib/firebase';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  heroTitle: 'Study in India & Overseas.',
  heroHighlightText: 'Your Gateway to Global Higher Education.',
  heroSubtitle: 'Expert admissions guidance for Domestic top colleges in India and premier overseas destinations across Italy, UK, USA, Canada, Ireland, Australia, France, Dubai, New Zealand & Germany.',
  eyebrowBadge: 'Global & Domestic Admissions • Your Dreams. Our Guidance. Your Future.',
  visaSuccessRate: '99.2%',
  partnerUniCount: '450+',
  avgStartingSalary: '₹22.5 LPA',
  studentsGuidedCount: '+25k Students Placed',
  announcementTicker: 'Fall 2026 & Spring 2027 Intakes Open • 100% Italy DSU Scholarships & UK/USA Early Bird Admissions Closing Soon',
  tollFreePhone: '1800-202-GLOBAL',
  supportEmail: 'admissions@primipassi.com',
  officesText: 'Delhi | Mumbai | Bangalore | Hyderabad | Pune | Milan | London | Dubai',
  counsellingNotificationEmail: AUTHORIZED_ADMIN_EMAIL,
  totalPlacedStudents: '25,850+',
  grantsAllocatedInr: '₹84.5 Cr',
  grantsAllocatedAed: 'AED 38.2M',
  yoyGrowthRate: '+34.2% YoY',
  bookingFormTitle: 'Book Free Admissions Consultation',
  bookingFormSubtitle: 'Connect with our senior study abroad & domestic advisors for course selection, 100% scholarships, and visa filing.',
  bookingFormBadge: 'Free 1-on-1 Mentorship',
  bookingFormCtaText: 'Confirm & Schedule Free Consultation',
  bookingFormDegreeOptions: [
    'Undergraduate (Bachelors)',
    'Masters / Post-Graduate',
    'MBA / Executive Management',
    'PhD / Doctorate',
    'Post-Graduate Diploma (PGD)',
    'Foundation / Pathway Program'
  ],
  bookingFormIntakeOptions: [
    'September 2026',
    'January 2027',
    'May 2027',
    'September 2027',
    'Immediate 2026 Admissions'
  ],
  bookingFormSlotOptions: [
    '11:00 AM IST (Morning)',
    '2:00 PM IST (Afternoon)',
    '4:00 PM IST (Evening)',
    '7:30 PM IST (Late Evening)',
    'Immediate (Next 15 Mins)'
  ]
};

export const INITIAL_COUNSELLING_BOOKINGS: CounsellingBooking[] = [];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I choose between Domestic (India) and Overseas (Italy, UK, USA, Germany, etc.) admissions?',
    answer: 'Our senior academic advisors evaluate your financial budget, career aspirations, language preferences, and entrance readiness. If you seek maximum global RoI with 0€ or heavily subsidized tuition, destinations like Italy (DSU 100% grant) and Germany (0€ tuition) are excellent. For rapid 1-year degrees with 2-year work visas, UK & Ireland lead. For top domestic placements, premier Indian institutes like BITS Pilani or Ashoka provide stellar returns.',
    category: 'Admissions'
  },
  {
    id: 'faq-2',
    question: 'What is the Italy DSU Regional Scholarship, and can Indian students get 100% free tuition?',
    answer: 'Yes! Italian regional governments (DSU, ER.GO, DiSCo) provide means-tested scholarships to international students whose family income is below ~€25,000/year (₹22 Lakhs). This covers 100% of university tuition fees, provides free daily canteen meals, and gives a cash living allowance of up to €7,500/year.',
    category: 'Scholarships',
    countryCode: 'italy'
  },
  {
    id: 'faq-3',
    question: 'Is tuition really free in German public universities for international students?',
    answer: 'Yes! State universities in Germany charge €0 tuition fees for all students (including Indian and international students) for most programs. Students only pay a minor semester contribution (approx €250–€350/sem) which includes an unlimited public transit ticket.',
    category: 'Admissions',
    countryCode: 'germany'
  },
  {
    id: 'faq-4',
    question: 'What are the post-study work visa rights across different countries?',
    answer: 'Post-study work rights vary: UK offers 2 years (Graduate Route); USA offers 3 years for STEM programs (OPT); Canada offers up to 3 years (PGWP); Australia offers 2-4 years (Subclass 485); Germany offers 18 months; Ireland offers 2 years; France offers 2 years plus a 5-year circulation visa for Master graduates; and Dubai offers fast job seeker visas & 10-year Golden Visas.',
    category: 'Work & Visas'
  },
  {
    id: 'faq-5',
    question: 'Can I get an IELTS waiver for studying abroad?',
    answer: 'Yes! Many universities in the UK, France, Dubai, and Italy accept 70%+ in High School English (CBSE, ISC, State Board) or an English Medium of Instruction (MOI) certificate from your college in place of IELTS.',
    category: 'Admissions'
  },
  {
    id: 'faq-6',
    question: 'Can I get education loans from Indian banks for both domestic and overseas programs?',
    answer: 'Yes! Partner banks (SBI, HDFC Credila, Auxilo, Prodigy Finance) offer collateral-free pre-visa education loans up to ₹45-75 Lakhs for overseas universities and up to ₹25 Lakhs for premier domestic Indian institutions.',
    category: 'Finance & Loans'
  }
];

export const DEFAULT_PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: 'pdf-1',
    title: 'Global & Domestic Admissions Comprehensive Handbook 2026-27',
    category: 'Brochure',
    fileSize: '4.8 MB',
    uploadDate: '2026-08-01',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Complete guide covering 11 countries: India, Italy, UK, USA, Canada, Ireland, Australia, France, Dubai, New Zealand & Germany.',
    country: 'All Destinations'
  },
  {
    id: 'pdf-2',
    title: 'Italy DSU Scholarship & Universitaly Pre-Enrollment Guide',
    category: 'Scholarship Form',
    fileSize: '2.4 MB',
    uploadDate: '2026-07-28',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Detailed instructions for ISEE Parificato documentation, family income certificates, and 100% fee waiver applications.',
    country: 'Italy'
  },
  {
    id: 'pdf-3',
    title: 'Germany APS Certificate & Blocked Account Setup Manual',
    category: 'Visa Guide',
    fileSize: '1.9 MB',
    uploadDate: '2026-07-25',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Step-by-step roadmap to obtaining the mandatory APS verification in India and opening a German Blocked Account.',
    country: 'Germany'
  },
  {
    id: 'pdf-4',
    title: 'UK 1-Year Masters & 2-Year Graduate Visa Roadmap',
    category: 'Admission Guide',
    fileSize: '2.1 MB',
    uploadDate: '2026-07-20',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Russell Group admission criteria, IELTS waiver rules, CAS issuance, and post-study career trajectories.',
    country: 'United Kingdom'
  }
];

interface ContentContextType {
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;

  activeStudentTab: StudentTab;
  setActiveStudentTab: (tab: StudentTab) => void;

  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;

  countries: CountryDestination[];
  activeCountries: CountryDestination[];
  toggleCountryVisibility: (id: string, active?: boolean) => void;
  addCountry: (country: CountryDestination) => void;
  updateCountry: (id: string, updated: Partial<CountryDestination>) => void;
  deleteCountry: (id: string) => void;

  pdfDocuments: PdfDocument[];
  addPdfDocument: (doc: PdfDocument) => void;
  updatePdfDocument: (id: string, updated: Partial<PdfDocument>) => void;
  deletePdfDocument: (id: string) => void;

  universities: University[];
  addUniversity: (uni: University) => void;
  updateUniversity: (id: string, updated: Partial<University>) => void;
  deleteUniversity: (id: string) => void;

  courses: CourseCategory[];
  addCourse: (course: CourseCategory) => void;
  updateCourse: (id: string, updated: Partial<CourseCategory>) => void;
  deleteCourse: (id: string) => void;

  scholarships: Scholarship[];
  addScholarship: (scholarship: Scholarship) => void;
  updateScholarship: (id: string, updated: Partial<Scholarship>) => void;
  deleteScholarship: (id: string) => void;

  loanProviders: LoanProvider[];
  addLoanProvider: (provider: LoanProvider) => void;
  updateLoanProvider: (id: string, updated: Partial<LoanProvider>) => void;
  deleteLoanProvider: (id: string) => void;

  accommodations: Accommodation[];
  addAccommodation: (acc: Accommodation) => void;
  updateAccommodation: (id: string, updated: Partial<Accommodation>) => void;
  deleteAccommodation: (id: string) => void;

  webinars: Webinar[];
  addWebinar: (webinar: Webinar) => void;
  updateWebinar: (id: string, updated: Partial<Webinar>) => void;
  deleteWebinar: (id: string) => void;

  blogPosts: BlogPost[];
  addBlogPost: (blog: BlogPost) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  faqs: FAQItem[];
  addFaq: (faq: FAQItem) => void;
  updateFaq: (id: string, updated: Partial<FAQItem>) => void;
  deleteFaq: (id: string) => void;

  testimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  counsellingBookings: CounsellingBooking[];
  addCounsellingBooking: (bookingData: {
    fullName: string;
    email: string;
    phone: string;
    destinationCountry?: string;
    intake: string;
    degree: string;
    selectedSlot: string;
    prefilledDetails?: string;
  }) => CounsellingBooking;
  updateCounsellingBookingStatus: (id: string, status: CounsellingBooking['status']) => void;
  deleteCounsellingBooking: (id: string) => void;

  resetAllToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('primipassi_global_siteConfig');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_CONFIG;
  });

  const [activeStudentTab, setActiveStudentTab] = useState<StudentTab>('overview');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('all');
  const [countries, setCountries] = useState<CountryDestination[]>(() => {
    const saved = localStorage.getItem('primipassi_global_countries');
    const list: CountryDestination[] = saved ? JSON.parse(saved) : COUNTRIES_DATA;
    return list.map((c) => ({
      ...c,
      isActive: c.isActive !== false
    }));
  });

  const activeCountries = useMemo(() => {
    return countries.filter((c) => c.isActive !== false);
  }, [countries]);

  // If currently selected destination is turned OFF, safely fallback to 'all'
  useEffect(() => {
    if (selectedCountry !== 'all') {
      const isStillActive = activeCountries.some((c) => c.id === selectedCountry);
      if (!isStillActive) {
        setSelectedCountry('all');
      }
    }
  }, [selectedCountry, activeCountries]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_countries', JSON.stringify(countries));
  }, [countries]);

  const normalizeUni = (u: any): University => {
    const code: CountryCode = u.countryCode || (u.country?.toLowerCase().includes('india') ? 'india' : 'dubai');
    const matchedCountry = countries.find((c) => c.id === code) || COUNTRIES_DATA.find((c) => c.id === code);
    const countryName = u.country || (matchedCountry ? matchedCountry.name : 'India');
    const countryCategory = u.countryCategory || (matchedCountry ? matchedCountry.category : (code === 'india' ? 'domestic' : 'overseas'));
    return {
      ...u,
      countryCode: code,
      country: countryName,
      countryCategory: countryCategory,
    };
  };

  const [universities, setUniversities] = useState<University[]>(() => {
    const saved = localStorage.getItem('primipassi_global_universities');
    const list: any[] = saved ? JSON.parse(saved) : MOCK_UNIVERSITIES;
    return list.map(normalizeUni);
  });

  const [courses, setCourses] = useState<CourseCategory[]>(() => {
    const saved = localStorage.getItem('primipassi_global_courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    const saved = localStorage.getItem('primipassi_global_scholarships');
    return saved ? JSON.parse(saved) : MOCK_SCHOLARSHIPS;
  });

  const [loanProviders, setLoanProviders] = useState<LoanProvider[]>(() => {
    const saved = localStorage.getItem('primipassi_global_loanProviders');
    return saved ? JSON.parse(saved) : MOCK_LOAN_PROVIDERS;
  });

  const [accommodations, setAccommodations] = useState<Accommodation[]>(() => {
    const saved = localStorage.getItem('primipassi_global_accommodations');
    return saved ? JSON.parse(saved) : MOCK_ACCOMMODATIONS;
  });

  const [webinars, setWebinars] = useState<Webinar[]>(() => {
    const saved = localStorage.getItem('primipassi_global_webinars');
    return saved ? JSON.parse(saved) : MOCK_WEBINARS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('primipassi_global_blogPosts');
    return saved ? JSON.parse(saved) : MOCK_BLOGS;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('primipassi_global_faqs');
    return saved ? JSON.parse(saved) : DEFAULT_FAQS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('primipassi_global_testimonials');
    if (!saved) return MOCK_TESTIMONIALS;
    try {
      const parsed: Testimonial[] = JSON.parse(saved);
      // Ensure avatars are authentic Indian student photos without repeated legacy images
      if (!Array.isArray(parsed) || parsed.length < MOCK_TESTIMONIALS.length) {
        return MOCK_TESTIMONIALS;
      }
      return parsed.map((t) => {
        const defaultMatch = MOCK_TESTIMONIALS.find((m) => m.id === t.id);
        if (
          defaultMatch &&
          (!t.avatar ||
            t.avatar.includes('photo-1534528741775-53994a69daeb') ||
            t.avatar.includes('photo-1517841905240-472988babdf9') ||
            t.avatar.includes('photo-1507003211169-0a1dd7228f2d'))
        ) {
          return {
            ...t,
            avatar: defaultMatch.avatar,
            currentSalaryLPA: t.currentSalaryLPA || defaultMatch.currentSalaryLPA
          };
        }
        return t;
      });
    } catch {
      return MOCK_TESTIMONIALS;
    }
  });

  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>(() => {
    const saved = localStorage.getItem('primipassi_global_pdfDocuments');
    return saved ? JSON.parse(saved) : DEFAULT_PDF_DOCUMENTS;
  });

  const [counsellingBookings, setCounsellingBookings] = useState<CounsellingBooking[]>(() => {
    const saved = localStorage.getItem('primipassi_global_counsellingBookings');
    return saved ? JSON.parse(saved) : INITIAL_COUNSELLING_BOOKINGS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('primipassi_global_siteConfig', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_counsellingBookings', JSON.stringify(counsellingBookings));
  }, [counsellingBookings]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_pdfDocuments', JSON.stringify(pdfDocuments));
  }, [pdfDocuments]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_loanProviders', JSON.stringify(loanProviders));
  }, [loanProviders]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_accommodations', JSON.stringify(accommodations));
  }, [accommodations]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_webinars', JSON.stringify(webinars));
  }, [webinars]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Actions
  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...config }));
  };

  const addCountry = (country: CountryDestination) => {
    const itemWithActive = {
      ...country,
      isActive: country.isActive !== false
    };
    setCountries((prev) => {
      const exists = prev.some((c) => c.id === itemWithActive.id);
      if (exists) {
        return prev.map((c) => (c.id === itemWithActive.id ? itemWithActive : c));
      }
      return [...prev, itemWithActive];
    });
  };

  const updateCountry = (id: string, updated: Partial<CountryDestination>) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const toggleCountryVisibility = (id: string, active?: boolean) => {
    setCountries((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextActive = active !== undefined ? active : !(c.isActive !== false);
          return { ...c, isActive: nextActive };
        }
        return c;
      })
    );
  };

  const deleteCountry = (id: string) => {
    setCountries((prev) => prev.filter((c) => c.id !== id));
    if (selectedCountry === id) {
      setSelectedCountry('all');
    }
  };

  const addUniversity = (uni: University) => {
    const normalized = normalizeUni(uni);
    setUniversities((prev) => [normalized, ...prev]);
  };

  const updateUniversity = (id: string, updated: Partial<University>) => {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const merged = { ...u, ...updated };
        return normalizeUni(merged);
      })
    );
  };

  const deleteUniversity = (id: string) => {
    setUniversities((prev) => prev.filter((u) => u.id !== id));
  };

  const addCourse = (course: CourseCategory) => {
    setCourses((prev) => [course, ...prev]);
  };

  const updateCourse = (id: string, updated: Partial<CourseCategory>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addScholarship = (scholarship: Scholarship) => {
    setScholarships((prev) => [scholarship, ...prev]);
  };

  const updateScholarship = (id: string, updated: Partial<Scholarship>) => {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteScholarship = (id: string) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id));
  };

  const addLoanProvider = (provider: LoanProvider) => {
    setLoanProviders((prev) => [provider, ...prev]);
  };

  const updateLoanProvider = (id: string, updated: Partial<LoanProvider>) => {
    setLoanProviders((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
  };

  const deleteLoanProvider = (id: string) => {
    setLoanProviders((prev) => prev.filter((l) => l.id !== id));
  };

  const addAccommodation = (acc: Accommodation) => {
    setAccommodations((prev) => [acc, ...prev]);
  };

  const updateAccommodation = (id: string, updated: Partial<Accommodation>) => {
    setAccommodations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAccommodation = (id: string) => {
    setAccommodations((prev) => prev.filter((a) => a.id !== id));
  };

  const addWebinar = (webinar: Webinar) => {
    setWebinars((prev) => [webinar, ...prev]);
  };

  const updateWebinar = (id: string, updated: Partial<Webinar>) => {
    setWebinars((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
  };

  const deleteWebinar = (id: string) => {
    setWebinars((prev) => prev.filter((w) => w.id !== id));
  };

  const addBlogPost = (blog: BlogPost) => {
    setBlogPosts((prev) => [blog, ...prev]);
  };

  const updateBlogPost = (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
  };

  const addFaq = (faq: FAQItem) => {
    setFaqs((prev) => [faq, ...prev]);
  };

  const updateFaq = (id: string, updated: Partial<FAQItem>) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const addTestimonial = (t: Testimonial) => {
    setTestimonials((prev) => [t, ...prev]);
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const addPdfDocument = (doc: PdfDocument) => {
    setPdfDocuments((prev) => [doc, ...prev]);
  };

  const updatePdfDocument = (id: string, updated: Partial<PdfDocument>) => {
    setPdfDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updated } : doc))
    );
  };

  const deletePdfDocument = (id: string) => {
    setPdfDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const addCounsellingBooking = (bookingData: {
    fullName: string;
    email: string;
    phone: string;
    destinationCountry?: string;
    intake: string;
    degree: string;
    selectedSlot: string;
    prefilledDetails?: string;
  }) => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const recipientEmail = siteConfig.counsellingNotificationEmail || AUTHORIZED_ADMIN_EMAIL;

    const newBooking: CounsellingBooking = {
      ...bookingData,
      id: `lead-${Date.now()}`,
      createdAt: timestamp,
      createdAtMs: Date.now(),
      status: 'New',
      isArchived: false,
      notificationRecipientEmail: recipientEmail,
      emailSentAt: timestamp
    };

    setCounsellingBookings((prev) => [newBooking, ...prev]);

    // Submit lead directly to Firestore database
    submitLeadToFirestore(bookingData)
      .then((docId) => {
        console.log('Lead saved to Firestore with ID:', docId);
      })
      .catch((err) => {
        console.warn('Firestore lead submission:', err);
      });

    return newBooking;
  };

  const updateCounsellingBookingStatus = (id: string, status: CounsellingBooking['status']) => {
    setCounsellingBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const deleteCounsellingBooking = (id: string) => {
    setCounsellingBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const resetAllToDefaults = () => {
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setUniversities(MOCK_UNIVERSITIES);
    setCourses(MOCK_COURSES);
    setScholarships(MOCK_SCHOLARSHIPS);
    setLoanProviders(MOCK_LOAN_PROVIDERS);
    setAccommodations(MOCK_ACCOMMODATIONS);
    setWebinars(MOCK_WEBINARS);
    setBlogPosts(MOCK_BLOGS);
    setFaqs(DEFAULT_FAQS);
    setTestimonials(MOCK_TESTIMONIALS);
    setPdfDocuments(DEFAULT_PDF_DOCUMENTS);
    setCounsellingBookings(INITIAL_COUNSELLING_BOOKINGS);
    setCountries(COUNTRIES_DATA);

    ['primipassi_global', 'primipassi', 'dubaiedu'].forEach(prefix => {
      localStorage.removeItem(`${prefix}_siteConfig`);
      localStorage.removeItem(`${prefix}_countries`);
      localStorage.removeItem(`${prefix}_universities`);
      localStorage.removeItem(`${prefix}_courses`);
      localStorage.removeItem(`${prefix}_scholarships`);
      localStorage.removeItem(`${prefix}_loanProviders`);
      localStorage.removeItem(`${prefix}_accommodations`);
      localStorage.removeItem(`${prefix}_webinars`);
      localStorage.removeItem(`${prefix}_blogPosts`);
      localStorage.removeItem(`${prefix}_faqs`);
      localStorage.removeItem(`${prefix}_testimonials`);
      localStorage.removeItem(`${prefix}_pdfDocuments`);
      localStorage.removeItem(`${prefix}_counsellingBookings`);
    });
  };

  return (
    <ContentContext.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        activeStudentTab,
        setActiveStudentTab,
        selectedCountry,
        setSelectedCountry,
        countries,
        activeCountries,
        toggleCountryVisibility,
        addCountry,
        updateCountry,
        deleteCountry,
        pdfDocuments,
        addPdfDocument,
        updatePdfDocument,
        deletePdfDocument,
        universities,
        addUniversity,
        updateUniversity,
        deleteUniversity,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        scholarships,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        loanProviders,
        addLoanProvider,
        updateLoanProvider,
        deleteLoanProvider,
        accommodations,
        addAccommodation,
        updateAccommodation,
        deleteAccommodation,
        webinars,
        addWebinar,
        updateWebinar,
        deleteWebinar,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        counsellingBookings,
        addCounsellingBooking,
        updateCounsellingBookingStatus,
        deleteCounsellingBooking,
        resetAllToDefaults
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
