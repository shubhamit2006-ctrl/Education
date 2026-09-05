import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  CountryDestination,
  MediaItem,
  MediaCategory
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
import {
  saveContentSectionToFirestore,
  subscribeToContentSection,
  batchSaveAllContentSections,
  submitLeadToFirestore,
  uploadImageToFirebaseStorage,
  deleteImageFromFirebaseStorage,
  updateMediaItemInFirestore,
  subscribeToMediaItems,
  AUTHORIZED_ADMIN_EMAIL
} from '../lib/firebase';

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

  // Media Library & Firebase Storage
  mediaItems: MediaItem[];
  uploadMediaItem: (
    file: File,
    options?: {
      category?: MediaCategory;
      altText?: string;
      associatedEntityId?: string;
      associatedEntityTitle?: string;
    },
    onProgress?: (pct: number) => void
  ) => Promise<MediaItem>;
  deleteMediaItem: (item: MediaItem) => Promise<void>;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => Promise<void>;

  // Cloud Synchronization
  isCloudSynced: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastCloudSyncTime: string;
  syncAllToFirestore: () => Promise<void>;

  resetAllToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize states with fast localStorage fallback for instant zero-lag rendering
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

  const normalizeUni = useCallback((u: any): University => {
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
  }, [countries]);

  const [universities, setUniversities] = useState<University[]>(() => {
    const saved = localStorage.getItem('primipassi_global_universities');
    const list: any[] = saved ? JSON.parse(saved) : MOCK_UNIVERSITIES;
    return list.map((u) => {
      const code: CountryCode = u.countryCode || (u.country?.toLowerCase().includes('india') ? 'india' : 'dubai');
      const matchedCountry = COUNTRIES_DATA.find((c) => c.id === code);
      return {
        ...u,
        countryCode: code,
        country: u.country || (matchedCountry ? matchedCountry.name : 'India'),
        countryCategory: u.countryCategory || (matchedCountry ? matchedCountry.category : (code === 'india' ? 'domestic' : 'overseas')),
      };
    });
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
      if (!Array.isArray(parsed) || parsed.length < MOCK_TESTIMONIALS.length) {
        return MOCK_TESTIMONIALS;
      }
      return parsed;
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

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('primipassi_global_mediaItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Cloud Sync Status Tracking
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>(() => new Date().toLocaleTimeString());

  // Save changes to localStorage cache
  useEffect(() => {
    localStorage.setItem('primipassi_global_siteConfig', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('primipassi_global_countries', JSON.stringify(countries));
  }, [countries]);

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

  useEffect(() => {
    localStorage.setItem('primipassi_global_mediaItems', JSON.stringify(mediaItems));
  }, [mediaItems]);

  // 2. Real-time Firebase Firestore Listeners (Ensures AI Studio Admin & Public Website are Always in Sync)
  useEffect(() => {
    setCloudSyncStatus('syncing');

    // 1. Site Config Listener
    const unsubConfig = subscribeToContentSection<SiteConfig>('site_config', (data) => {
      if (data && typeof data === 'object') {
        setSiteConfig(data);
        localStorage.setItem('primipassi_global_siteConfig', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('site_config', DEFAULT_SITE_CONFIG).catch(() => {});
      }
      setIsCloudSynced(true);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    });

    // 2. Countries / Destinations Listener
    const unsubCountries = subscribeToContentSection<CountryDestination[]>('countries', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        const withActive = data.map((c) => ({ ...c, isActive: c.isActive !== false }));
        setCountries(withActive);
        localStorage.setItem('primipassi_global_countries', JSON.stringify(withActive));
      } else if (data === null) {
        saveContentSectionToFirestore('countries', COUNTRIES_DATA).catch(() => {});
      }
      setIsCloudSynced(true);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    });

    // 3. Universities Listener
    const unsubUniversities = subscribeToContentSection<University[]>('universities', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setUniversities(data);
        localStorage.setItem('primipassi_global_universities', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('universities', MOCK_UNIVERSITIES).catch(() => {});
      }
      setIsCloudSynced(true);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    });

    // 4. Courses Listener
    const unsubCourses = subscribeToContentSection<CourseCategory[]>('courses', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
        localStorage.setItem('primipassi_global_courses', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('courses', MOCK_COURSES).catch(() => {});
      }
    });

    // 5. Scholarships Listener
    const unsubScholarships = subscribeToContentSection<Scholarship[]>('scholarships', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setScholarships(data);
        localStorage.setItem('primipassi_global_scholarships', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('scholarships', MOCK_SCHOLARSHIPS).catch(() => {});
      }
    });

    // 6. Loan Providers Listener
    const unsubLoans = subscribeToContentSection<LoanProvider[]>('loan_providers', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setLoanProviders(data);
        localStorage.setItem('primipassi_global_loanProviders', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('loan_providers', MOCK_LOAN_PROVIDERS).catch(() => {});
      }
    });

    // 7. Accommodations Listener
    const unsubAccommodations = subscribeToContentSection<Accommodation[]>('accommodations', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setAccommodations(data);
        localStorage.setItem('primipassi_global_accommodations', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('accommodations', MOCK_ACCOMMODATIONS).catch(() => {});
      }
    });

    // 8. Webinars Listener
    const unsubWebinars = subscribeToContentSection<Webinar[]>('webinars', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setWebinars(data);
        localStorage.setItem('primipassi_global_webinars', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('webinars', MOCK_WEBINARS).catch(() => {});
      }
    });

    // 9. Blog Posts Listener
    const unsubBlogs = subscribeToContentSection<BlogPost[]>('blog_posts', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setBlogPosts(data);
        localStorage.setItem('primipassi_global_blogPosts', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('blog_posts', MOCK_BLOGS).catch(() => {});
      }
    });

    // 10. FAQs Listener
    const unsubFaqs = subscribeToContentSection<FAQItem[]>('faqs', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setFaqs(data);
        localStorage.setItem('primipassi_global_faqs', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('faqs', DEFAULT_FAQS).catch(() => {});
      }
    });

    // 11. Testimonials Listener
    const unsubTestimonials = subscribeToContentSection<Testimonial[]>('testimonials', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
        localStorage.setItem('primipassi_global_testimonials', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('testimonials', MOCK_TESTIMONIALS).catch(() => {});
      }
    });

    // 12. PDF Documents Listener
    const unsubPdfs = subscribeToContentSection<PdfDocument[]>('pdf_documents', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setPdfDocuments(data);
        localStorage.setItem('primipassi_global_pdfDocuments', JSON.stringify(data));
      } else if (data === null) {
        saveContentSectionToFirestore('pdf_documents', DEFAULT_PDF_DOCUMENTS).catch(() => {});
      }
    });

    // 13. Media Library Real-time Listener
    const unsubMedia = subscribeToMediaItems((items) => {
      if (Array.isArray(items)) {
        setMediaItems(items);
        localStorage.setItem('primipassi_global_mediaItems', JSON.stringify(items));
      }
    });

    return () => {
      unsubConfig();
      unsubCountries();
      unsubUniversities();
      unsubCourses();
      unsubScholarships();
      unsubLoans();
      unsubAccommodations();
      unsubWebinars();
      unsubBlogs();
      unsubFaqs();
      unsubTestimonials();
      unsubPdfs();
      unsubMedia();
    };
  }, []);

  // Helper to persist section to Firestore and update sync timestamp
  const persistSection = useCallback(async (sectionId: string, data: any) => {
    try {
      setCloudSyncStatus('syncing');
      await saveContentSectionToFirestore(sectionId, data);
      setIsCloudSynced(true);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.warn(`Firestore background save notice for ${sectionId}:`, error);
      // Local copy remains updated
      setCloudSyncStatus('synced');
    }
  }, []);

  // Sync All Sections to Firestore on Demand
  const syncAllToFirestore = async () => {
    try {
      setCloudSyncStatus('syncing');
      await batchSaveAllContentSections({
        site_config: siteConfig,
        countries: countries,
        universities: universities,
        courses: courses,
        scholarships: scholarships,
        loan_providers: loanProviders,
        accommodations: accommodations,
        webinars: webinars,
        blog_posts: blogPosts,
        faqs: faqs,
        testimonials: testimonials,
        pdf_documents: pdfDocuments
      });
      setIsCloudSynced(true);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Manual Firestore batch sync failed:', error);
      setCloudSyncStatus('error');
      throw error;
    }
  };

  // Actions & Mutations with automatic Firestore persistence
  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const merged = { ...prev, ...config };
      persistSection('site_config', merged);
      return merged;
    });
  };

  const addCountry = (country: CountryDestination) => {
    const itemWithActive = {
      ...country,
      isActive: country.isActive !== false
    };
    setCountries((prev) => {
      const exists = prev.some((c) => c.id === itemWithActive.id);
      const updated = exists
        ? prev.map((c) => (c.id === itemWithActive.id ? itemWithActive : c))
        : [...prev, itemWithActive];
      persistSection('countries', updated);
      return updated;
    });
  };

  const updateCountry = (id: string, updated: Partial<CountryDestination>) => {
    setCountries((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      persistSection('countries', next);
      return next;
    });
  };

  const toggleCountryVisibility = (id: string, active?: boolean) => {
    setCountries((prev) => {
      const next = prev.map((c) => {
        if (c.id === id) {
          const nextActive = active !== undefined ? active : !(c.isActive !== false);
          return { ...c, isActive: nextActive };
        }
        return c;
      });
      persistSection('countries', next);
      return next;
    });
  };

  const deleteCountry = (id: string) => {
    setCountries((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistSection('countries', next);
      return next;
    });
    if (selectedCountry === id) {
      setSelectedCountry('all');
    }
  };

  const addUniversity = (uni: University) => {
    const normalized = normalizeUni(uni);
    setUniversities((prev) => {
      const next = [normalized, ...prev];
      persistSection('universities', next);
      return next;
    });
  };

  const updateUniversity = (id: string, updated: Partial<University>) => {
    setUniversities((prev) => {
      const next = prev.map((u) => {
        if (u.id !== id) return u;
        const merged = { ...u, ...updated };
        return normalizeUni(merged);
      });
      persistSection('universities', next);
      return next;
    });
  };

  const deleteUniversity = (id: string) => {
    setUniversities((prev) => {
      const next = prev.filter((u) => u.id !== id);
      persistSection('universities', next);
      return next;
    });
  };

  const addCourse = (course: CourseCategory) => {
    setCourses((prev) => {
      const next = [course, ...prev];
      persistSection('courses', next);
      return next;
    });
  };

  const updateCourse = (id: string, updated: Partial<CourseCategory>) => {
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      persistSection('courses', next);
      return next;
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistSection('courses', next);
      return next;
    });
  };

  const addScholarship = (scholarship: Scholarship) => {
    setScholarships((prev) => {
      const next = [scholarship, ...prev];
      persistSection('scholarships', next);
      return next;
    });
  };

  const updateScholarship = (id: string, updated: Partial<Scholarship>) => {
    setScholarships((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      persistSection('scholarships', next);
      return next;
    });
  };

  const deleteScholarship = (id: string) => {
    setScholarships((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistSection('scholarships', next);
      return next;
    });
  };

  const addLoanProvider = (provider: LoanProvider) => {
    setLoanProviders((prev) => {
      const next = [provider, ...prev];
      persistSection('loan_providers', next);
      return next;
    });
  };

  const updateLoanProvider = (id: string, updated: Partial<LoanProvider>) => {
    setLoanProviders((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...updated } : l));
      persistSection('loan_providers', next);
      return next;
    });
  };

  const deleteLoanProvider = (id: string) => {
    setLoanProviders((prev) => {
      const next = prev.filter((l) => l.id !== id);
      persistSection('loan_providers', next);
      return next;
    });
  };

  const addAccommodation = (acc: Accommodation) => {
    setAccommodations((prev) => {
      const next = [acc, ...prev];
      persistSection('accommodations', next);
      return next;
    });
  };

  const updateAccommodation = (id: string, updated: Partial<Accommodation>) => {
    setAccommodations((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      persistSection('accommodations', next);
      return next;
    });
  };

  const deleteAccommodation = (id: string) => {
    setAccommodations((prev) => {
      const next = prev.filter((a) => a.id !== id);
      persistSection('accommodations', next);
      return next;
    });
  };

  const addWebinar = (webinar: Webinar) => {
    setWebinars((prev) => {
      const next = [webinar, ...prev];
      persistSection('webinars', next);
      return next;
    });
  };

  const updateWebinar = (id: string, updated: Partial<Webinar>) => {
    setWebinars((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, ...updated } : w));
      persistSection('webinars', next);
      return next;
    });
  };

  const deleteWebinar = (id: string) => {
    setWebinars((prev) => {
      const next = prev.filter((w) => w.id !== id);
      persistSection('webinars', next);
      return next;
    });
  };

  const addBlogPost = (blog: BlogPost) => {
    setBlogPosts((prev) => {
      const next = [blog, ...prev];
      persistSection('blog_posts', next);
      return next;
    });
  };

  const updateBlogPost = (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...updated } : b));
      persistSection('blog_posts', next);
      return next;
    });
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => {
      const next = prev.filter((b) => b.id !== id);
      persistSection('blog_posts', next);
      return next;
    });
  };

  const addFaq = (faq: FAQItem) => {
    setFaqs((prev) => {
      const next = [faq, ...prev];
      persistSection('faqs', next);
      return next;
    });
  };

  const updateFaq = (id: string, updated: Partial<FAQItem>) => {
    setFaqs((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...updated } : f));
      persistSection('faqs', next);
      return next;
    });
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => {
      const next = prev.filter((f) => f.id !== id);
      persistSection('faqs', next);
      return next;
    });
  };

  const addTestimonial = (t: Testimonial) => {
    setTestimonials((prev) => {
      const next = [t, ...prev];
      persistSection('testimonials', next);
      return next;
    });
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonials((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      persistSection('testimonials', next);
      return next;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistSection('testimonials', next);
      return next;
    });
  };

  const addPdfDocument = (doc: PdfDocument) => {
    setPdfDocuments((prev) => {
      const next = [doc, ...prev];
      persistSection('pdf_documents', next);
      return next;
    });
  };

  const updatePdfDocument = (id: string, updated: Partial<PdfDocument>) => {
    setPdfDocuments((prev) => {
      const next = prev.map((doc) => (doc.id === id ? { ...doc, ...updated } : doc));
      persistSection('pdf_documents', next);
      return next;
    });
  };

  const deletePdfDocument = (id: string) => {
    setPdfDocuments((prev) => {
      const next = prev.filter((doc) => doc.id !== id);
      persistSection('pdf_documents', next);
      return next;
    });
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

  const uploadMediaItem = async (
    file: File,
    options?: {
      category?: MediaCategory;
      altText?: string;
      associatedEntityId?: string;
      associatedEntityTitle?: string;
    },
    onProgress?: (pct: number) => void
  ): Promise<MediaItem> => {
    const uploadedItem = await uploadImageToFirebaseStorage(file, options, onProgress);
    setMediaItems((prev) => [uploadedItem, ...prev.filter((m) => m.id !== uploadedItem.id)]);
    return uploadedItem;
  };

  const deleteMediaItem = async (item: MediaItem) => {
    await deleteImageFromFirebaseStorage(item);
    setMediaItems((prev) => prev.filter((m) => m.id !== item.id));
  };

  const updateMediaItem = async (id: string, updates: Partial<MediaItem>) => {
    await updateMediaItemInFirestore(id, updates);
    setMediaItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
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

    // Also push default seeds to Firestore
    syncAllToFirestore().catch(() => {});

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
        mediaItems,
        uploadMediaItem,
        deleteMediaItem,
        updateMediaItem,
        isCloudSynced,
        cloudSyncStatus,
        lastCloudSyncTime,
        syncAllToFirestore,
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
