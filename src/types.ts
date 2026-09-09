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
  isActive?: boolean;
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
  targetCountry?: string;
  intake: string;
  degree: string;
  selectedSlot: string;
  callbackDate?: string;
  callbackTime?: string;
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
  countryCode?: CountryCode;
  topDestinations?: string[];
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

export type MediaCategory =
  | 'universities'
  | 'destinations'
  | 'blogs'
  | 'testimonials'
  | 'accommodations'
  | 'webinars'
  | 'loans'
  | 'branding'
  | 'general';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  storagePath?: string;
  sizeBytes: number;
  sizeFormatted: string;
  contentType: string;
  uploadedAt: string;
  uploadedAtMs: number;
  uploadedBy?: string;
  altText?: string;
  category?: MediaCategory;
  associatedEntityId?: string;
  associatedEntityTitle?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

// ---------------------------------------------------------------------------
// ITALY ELIGIBILITY ASSESSMENT QUESTIONNAIRE & LEAD MODELS
// ---------------------------------------------------------------------------

export type PreliminaryEligibilityStatus = 'ELIGIBLE' | 'PROFILE_REVIEW' | 'NOT_ELIGIBLE';

export type ItalyStudyLevel = "Bachelor's" | "Master's";

export type CounsellorLeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up Required'
  | 'Counselling Scheduled'
  | 'Application Interested'
  | 'Application Started'
  | 'Converted'
  | 'Not Interested'
  | 'Not Eligible'
  | 'Closed';

export interface ItalyEligibilityFormData {
  // Step 1: Personal & Study Interest
  fullName: string;
  email: string;
  phone: string;
  studyLevel: ItalyStudyLevel;
  intendedField: string;
  intendedFieldOther?: string;
  intake: string;

  // Step 2: Academic Profile
  // Bachelor's flow
  completedClass12?: 'Yes' | 'No, currently pursuing';
  class12Percentage?: number | string;
  applyingDiplomaRoute?: 'Yes' | 'No';
  diplomaPercentage?: number | string;

  // Master's flow
  bachelorsDegreeName?: string;
  bachelorsSpecialisation?: string;
  scoreType?: 'Percentage' | 'CGPA';
  bachelorsPercentage?: number | string;
  bachelorsCgpa?: number | string;
  cgpaScale?: number | string;
  completedBachelors?: 'Yes' | 'No, currently pursuing';
  latestSemesterPercentage?: number | string;
  predictedFinalPercentage?: number | string;
  specificItDegree?: 'B.Sc Computer Science' | 'B.Sc Information Technology' | 'BCA' | 'Other Computer/IT degree' | 'Other';

  // Step 3: Study Gap & Experience
  hasEducationGap: 'Yes' | 'No';
  gapYears?: number | string;
  gapReason?: string;
  gapReasonOther?: string;

  hasWorkExperience: 'Yes' | 'No';
  workExperienceYears?: number | string;
  jobRole?: string;
  industry?: string;
  industryOther?: string;

  // Step 4: English Language & Course Requirements
  ieltsStatus: 'Yes' | 'No' | 'Planning to take IELTS';
  ieltsScore?: number | string;
  moiAvailable: 'Yes' | 'No' | 'Not sure';

  isArchitectureDesign: 'Yes' | 'No';
  hasPortfolio?: 'Yes' | 'No' | 'Can prepare one';

  // Step 5: Documents & Scholarship
  availableDocuments: string[];
  documentsToArrange?: string;

  scholarshipInterest: 'Yes' | 'No' | 'I would like to know more';
  familyIncomeRange?: string;
  canProvideFinancialDocs?: 'Yes' | 'No' | 'Not sure';

  applicationIntent: 'Immediately' | 'Within 1 month' | 'Within 3 months' | '3–6 months' | 'Just exploring';
  consentAgreed: boolean;
}

export interface ItalyEligibilityLead extends ItalyEligibilityFormData {
  id: string;
  questionnaireVersion: string; // 'Italy-Eligibility-v1'
  preliminaryEligibilityStatus: PreliminaryEligibilityStatus;
  eligibilityReasons: string[];
  eligibilityFlags: string[];
  rulesTriggered: string[];

  counsellorStatus: CounsellorLeadStatus;
  counsellorNotes?: string;
  assignedCounsellor?: string;
  lastContactedAt?: string;
  counsellorEligibilityStatus?: string; // Counsellor override

  createdAt: string;
  createdAtMs: number;
  updatedAt?: string;
  updatedAtMs?: number;

  // Lead Attribution
  leadSource?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

