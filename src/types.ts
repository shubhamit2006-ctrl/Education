export type ViewRole = 'student' | 'admin';

export type StudentTab =
  | 'overview'
  | 'countries'
  | 'universities'
  | 'courses'
  | 'scholarships'
  | 'visa-stay';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'AED' | 'NZD';

export type CountryCode =
  | 'all'
  | 'india'
  | 'italy'
  | 'uk'
  | 'usa'
  | 'canada'
  | 'ireland'
  | 'australia'
  | 'france'
  | 'dubai'
  | 'new-zealand'
  | 'germany'
  | (string & {});

export type CountryCategory = 'domestic' | 'overseas';

export interface CountryDestination {
  id: CountryCode;
  name: string;
  code: string;
  flag: string;
  category: CountryCategory;
  tagline: string;
  heroDescription: string;
  coverImage: string;
  avgTuitionDisplay: string;
  avgLivingCostDisplay: string;
  postStudyWorkVisa: string;
  topIntakes: string[];
  universitiesCount: string;
  coursesCount: string;
  popularDegrees: string[];
  testRequirements: string;
  scholarshipHighlight: string;
  workRights: string;
  keyHighlights: string[];
  whyChoosePoints: { title: string; desc: string }[];
  admissionSteps: { step: number; title: string; desc: string }[];
  popularCities: string[];
}

export interface SiteConfig {
  heroTitle: string;
  heroHighlightText: string;
  heroSubtitle: string;
  eyebrowBadge: string;
  visaSuccessRate: string;
  partnerUniCount: string;
  avgStartingSalary: string;
  studentsGuidedCount: string;
  announcementTicker: string;
  tollFreePhone: string;
  supportEmail: string;
  officesText: string;
  counsellingNotificationEmail: string;
  totalPlacedStudents: string;
  grantsAllocatedInr: string;
  grantsAllocatedAed: string;
  yoyGrowthRate: string;
  // Booking Form & Dropdown controls configurable by Admin
  bookingFormTitle?: string;
  bookingFormSubtitle?: string;
  bookingFormBadge?: string;
  bookingFormCtaText?: string;
  bookingFormDegreeOptions?: string[];
  bookingFormIntakeOptions?: string[];
  bookingFormSlotOptions?: string[];
  bookingFormDestinationOptions?: { id: string; name: string; flag: string; category?: string }[];
}

export interface CounsellingBooking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  destinationCountry?: string;
  intake: string;
  degree: string;
  selectedSlot: string;
  prefilledDetails?: string;
  createdAt: string;
  createdAtMs?: number;
  status: 'New' | 'Contacted' | 'In Consultation' | 'Converted' | 'Closed' | 'Archived';
  isArchived?: boolean;
  notificationRecipientEmail?: string;
  emailSentAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  countryCode?: CountryCode;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  image: string;
  country: string;
  countryCode: CountryCode;
  countryCategory?: CountryCategory;
  city?: string;
  location: string;
  rankingGlobal?: string;
  rankingNational?: string;
  rankingUae?: string; // backwards compatibility
  undergradFeesDisplay?: string;
  mastersFeesDisplay?: string;
  undergradFeesINR?: number;
  mastersFeesINR?: number;
  undergradFeesAED?: number;
  mastersFeesAED?: number;
  scholarshipsMaxPct: number;
  acceptanceRate: number;
  placementRate: number;
  avgStartingSalaryDisplay?: string;
  avgStartingSalaryAED?: number;
  popularCourses: string[];
  accreditation: string[];
  industryPartners: string[];
  description: string;
  campusType: string;
  featured?: boolean;
  brochureUrl?: string;
  degreesOffered?: string[];
  intakeSeasons?: string[];
  examsAccepted?: string[];
}

export interface CourseCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  avgDuration: string;
  tuitionRangeDisplay?: string;
  tuitionRangeAED?: string;
  topCareers: string[];
  startingSalaryDisplay?: string;
  startingSalaryAED?: number;
  popularUniversities: string[];
  countriesAvailable?: string[];
  degreeLevels?: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  university: string;
  country?: string;
  countryCode?: CountryCode;
  amount: string;
  discountPct: number;
  eligibility: string;
  minGPAOrPct: string;
  deadline: string;
  category: 'Merit' | 'Need-based' | 'Sports' | 'Women in Tech' | 'Early Bird' | 'Government / Regional';
  featured?: boolean;
  description?: string;
}

export interface LoanProvider {
  id: string;
  bankName: string;
  logo: string;
  interestRate: string;
  maxAmountINR: number;
  processingTimeDays: number;
  collateralRequired: boolean;
  moratoriumPeriodYears: number;
  features: string[];
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'Hostel' | 'Co-Living' | 'Private Apartment' | 'PG' | 'Student Residence';
  image: string;
  location: string;
  country?: string;
  nearUniversities: string[];
  monthlyRentDisplay?: string;
  monthlyRentAED?: number;
  amenities: string[];
  roomTypes: string[];
  rating: number;
  distanceKm: number;
}

export interface VisaStep {
  stepNumber: number;
  title: string;
  description: string;
  durationDays: string;
  requiredDocuments: string[];
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export interface CountryVisaGuide {
  countryCode: CountryCode;
  countryName: string;
  visaType: string;
  processingTime: string;
  stayBackPeriod: string;
  financialRequirements: string;
  steps: VisaStep[];
  essentialDocuments: string[];
  workRules: string;
}

export interface Webinar {
  id: string;
  title: string;
  speaker: string;
  role: string;
  date: string;
  time: string;
  image: string;
  seatsLeft: number;
  tags: string[];
  destinationCountry?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  snippet: string;
  content?: string;
  countryTag?: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  hometown: string;
  university: string;
  country?: string;
  course: string;
  scholarshipReceived: string;
  currentRole: string;
  currentSalaryDisplay?: string;
  currentSalaryLPA?: string;
  quote: string;
  avatar: string;
  videoUrl?: string;
}

export interface PdfDocument {
  id: string;
  title: string;
  category: 'Brochure' | 'Fee Structure' | 'Visa Guide' | 'Scholarship Form' | 'Admission Guide' | 'General';
  fileSize: string;
  uploadDate: string;
  fileUrl: string;
  description: string;
  universityName?: string;
  country?: string;
}

export interface StudentApplication {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  destinationCountry: string;
  universityName: string;
  courseName: string;
  intake: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Offer Issued' | 'Visa Processing' | 'Enrolled';
  scholarshipApplied: string;
  loanStatus: 'Not Requested' | 'Applied' | 'Approved' | 'Disbursed';
  visaStatus: 'Pending' | 'Document Check' | 'Approved';
  appliedDate: string;
}
