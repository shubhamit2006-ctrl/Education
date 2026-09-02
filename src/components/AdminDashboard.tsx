import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  Award,
  DollarSign,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  BookOpen,
  Home,
  Calendar,
  HelpCircle,
  Star,
  Settings,
  X,
  Sparkles,
  Search,
  FileText,
  FileUp,
  Download,
  LogOut,
  ExternalLink,
  Eye,
  EyeOff,
  Inbox,
  Mail,
  Send,
  Phone,
  User,
  Clock,
  SendHorizontal,
  Check,
  Sliders,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  GraduationCap,
  RefreshCw,
  PlusCircle,
  CheckCheck,
  Globe,
  Archive,
  ArchiveRestore,
  CheckSquare,
  Square,
  Database,
  Filter,
  AlertTriangle,
  Quote,
  Power,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Currency, University, CourseCategory, Scholarship, LoanProvider, Accommodation, Webinar, BlogPost, FAQItem, Testimonial, PdfDocument, CounsellingBooking, CountryCode, CountryCategory, CountryDestination } from '../types';
import { useContent } from '../context/ContentContext';
import {
  fetchLeadsFromFirestore,
  updateLeadStatusInFirestore,
  updateLeadArchiveInFirestore,
  deleteLeadFromFirestore,
  bulkArchiveLeadsInFirestore,
  bulkDeleteLeadsFromFirestore,
  AUTHORIZED_ADMIN_EMAIL
} from '../lib/firebase';

interface AdminDashboardProps {
  onLogout?: () => void;
}

type AdminTab =
  | 'overview'
  | 'countries'
  | 'bookings'
  | 'formConfig'
  | 'config'
  | 'pdfs'
  | 'universities'
  | 'courses'
  | 'scholarships'
  | 'loans'
  | 'accommodations'
  | 'webinars'
  | 'blogs'
  | 'faqs'
  | 'testimonials';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout
}) => {
  const {
    siteConfig,
    updateSiteConfig,
    countries,
    activeCountries,
    toggleCountryVisibility,
    addCountry,
    updateCountry,
    deleteCountry,
    counsellingBookings,
    addCounsellingBooking,
    updateCounsellingBookingStatus,
    deleteCounsellingBooking,
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
    resetAllToDefaults
  } = useContent();

  const getCountryFlag = (code?: CountryCode) => {
    const c = countries.find((item) => item.id === code);
    return c ? c.flag : '🌐';
  };

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Search queries for admin lists
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state for editing/adding items
  const [editingCountry, setEditingCountry] = useState<Partial<CountryDestination> | null>(null);
  const [isNewCountry, setIsNewCountry] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [countryCategoryFilter, setCountryCategoryFilter] = useState<'all' | 'domestic' | 'overseas'>('all');
  const [countryStatusFilter, setCountryStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [editingPdf, setEditingPdf] = useState<Partial<PdfDocument> | null>(null);
  const [isNewPdf, setIsNewPdf] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<PdfDocument | null>(null);

  const [editingUni, setEditingUni] = useState<Partial<University> | null>(null);
  const [isNewUni, setIsNewUni] = useState(false);
  const [adminUniCountryFilter, setAdminUniCountryFilter] = useState<CountryCode | 'all'>('all');
  const [adminUniCategoryFilter, setAdminUniCategoryFilter] = useState<'all' | 'domestic' | 'overseas'>('all');
  const [adminUniGroupByCountry, setAdminUniGroupByCountry] = useState<boolean>(true);

  const [editingCourse, setEditingCourse] = useState<Partial<CourseCategory> | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);

  const [editingScholarship, setEditingScholarship] = useState<Partial<Scholarship> | null>(null);
  const [isNewScholarship, setIsNewScholarship] = useState(false);
  const [scholarshipSearchTerm, setScholarshipSearchTerm] = useState('');
  const [scholarshipCategoryFilter, setScholarshipCategoryFilter] = useState<string>('all');
  const [scholarshipCountryFilter, setScholarshipCountryFilter] = useState<CountryCode | 'all'>('all');

  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);
  const [faqSearchTerm, setFaqSearchTerm] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('all');
  const [faqCountryFilter, setFaqCountryFilter] = useState<CountryCode | 'all'>('all');

  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  const [editingLoan, setEditingLoan] = useState<Partial<LoanProvider> | null>(null);
  const [isNewLoan, setIsNewLoan] = useState(false);

  const [editingAccommodation, setEditingAccommodation] = useState<Partial<Accommodation> | null>(null);
  const [isNewAccommodation, setIsNewAccommodation] = useState(false);

  const [editingWebinar, setEditingWebinar] = useState<Partial<Webinar> | null>(null);
  const [isNewWebinar, setIsNewWebinar] = useState(false);

  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [isNewBlog, setIsNewBlog] = useState(false);

  // Form State for Site Config
  const [configForm, setConfigForm] = useState({ ...siteConfig });

  // Sync config form when siteConfig changes externally
  useEffect(() => {
    setConfigForm({ ...siteConfig });
  }, [siteConfig]);

  // Leads & Bookings state (Firestore backed)
  const [firestoreLeads, setFirestoreLeads] = useState<CounsellingBooking[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadViewMode, setLeadViewMode] = useState<'active' | 'archived' | 'all'>('active');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<CounsellingBooking | null>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('All');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [exportedLeadIdsForArchive, setExportedLeadIdsForArchive] = useState<string[]>([]);

  const loadFirestoreLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const leads = await fetchLeadsFromFirestore();
      setFirestoreLeads(leads);
    } catch (err: any) {
      console.warn('Error loading leads from Firestore:', err);
      showNotify('Could not load Firestore leads. Please ensure you are logged in as admin.');
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    loadFirestoreLeads();
  }, []);

  const handleUpdateFirestoreLeadStatus = async (
    leadId: string,
    newStatus: CounsellingBooking['status']
  ) => {
    try {
      await updateLeadStatusInFirestore(leadId, newStatus);
      setFirestoreLeads((prev) =>
        prev.map((b) => (b.id === leadId ? { ...b, status: newStatus } : b))
      );
      updateCounsellingBookingStatus(leadId, newStatus);
      showNotify(`Status updated to "${newStatus}" in Firestore!`);
    } catch (err: any) {
      console.error('Update status error:', err);
      showNotify('Failed to update status in Firestore: ' + (err.message || 'Error'));
    }
  };

  const handleToggleArchiveLead = async (leadId: string, shouldArchive: boolean) => {
    try {
      await updateLeadArchiveInFirestore(leadId, shouldArchive);
      setFirestoreLeads((prev) =>
        prev.map((b) =>
          b.id === leadId
            ? {
                ...b,
                isArchived: shouldArchive,
                status: shouldArchive ? 'Archived' : 'New'
              }
            : b
        )
      );
      showNotify(shouldArchive ? 'Lead moved to Archive.' : 'Lead restored to Active queue.');
    } catch (err: any) {
      console.error('Archive error:', err);
      showNotify('Failed to update archive status: ' + (err.message || 'Error'));
    }
  };

  const handleDeleteFirestoreLead = async (leadId: string, studentName: string) => {
    if (!window.confirm(`Permanently delete lead for "${studentName}" from Firestore? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteLeadFromFirestore(leadId);
      setFirestoreLeads((prev) => prev.filter((b) => b.id !== leadId));
      deleteCounsellingBooking(leadId);
      setSelectedLeadIds((prev) => prev.filter((id) => id !== leadId));
      showNotify('Lead permanently removed from Firestore.');
    } catch (err: any) {
      console.error('Delete error:', err);
      showNotify('Failed to delete lead from Firestore: ' + (err.message || 'Error'));
    }
  };

  const handleBulkArchiveSelected = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!window.confirm(`Archive ${selectedLeadIds.length} selected leads in Firestore?`)) return;

    try {
      await bulkArchiveLeadsInFirestore(selectedLeadIds);
      setFirestoreLeads((prev) =>
        prev.map((b) =>
          selectedLeadIds.includes(b.id)
            ? { ...b, isArchived: true, status: 'Archived' }
            : b
        )
      );
      setSelectedLeadIds([]);
      showNotify(`Archived ${selectedLeadIds.length} leads in Firestore.`);
    } catch (err: any) {
      console.error('Bulk archive error:', err);
      showNotify('Failed to archive leads in Firestore: ' + (err.message || 'Error'));
    }
  };

  const handleBulkDeleteSelected = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!window.confirm(`Permanently DELETE ${selectedLeadIds.length} selected leads from Firestore? This cannot be undone.`)) return;

    try {
      await bulkDeleteLeadsFromFirestore(selectedLeadIds);
      setFirestoreLeads((prev) => prev.filter((b) => !selectedLeadIds.includes(b.id)));
      selectedLeadIds.forEach((id) => deleteCounsellingBooking(id));
      setSelectedLeadIds([]);
      showNotify(`Deleted ${selectedLeadIds.length} leads from Firestore.`);
    } catch (err: any) {
      console.error('Bulk delete error:', err);
      showNotify('Failed to delete leads: ' + (err.message || 'Error'));
    }
  };

  const showNotify = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(configForm);
    showNotify('Site Configuration updated successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all site content back to initial default values?')) {
      resetAllToDefaults();
      setConfigForm(siteConfig);
      showNotify('All site data reset to default configuration.');
    }
  };

  // Dropdown management inputs & state
  const [newDegreeInput, setNewDegreeInput] = useState('');
  const [editingDegreeIdx, setEditingDegreeIdx] = useState<number | null>(null);
  const [editingDegreeText, setEditingDegreeText] = useState('');

  const [newIntakeInput, setNewIntakeInput] = useState('');
  const [editingIntakeIdx, setEditingIntakeIdx] = useState<number | null>(null);
  const [editingIntakeText, setEditingIntakeText] = useState('');

  const [newSlotInput, setNewSlotInput] = useState('');
  const [editingSlotIdx, setEditingSlotIdx] = useState<number | null>(null);
  const [editingSlotText, setEditingSlotText] = useState('');

  // Dropdown option handlers
  const handleAddDegreeOption = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = configForm.bookingFormDegreeOptions || [
      'Undergraduate (Bachelors)',
      'Masters / Post-Graduate',
      'MBA / Executive Management',
      'PhD / Doctorate'
    ];
    if (current.includes(trimmed)) {
      showNotify('Option already exists in list');
      return;
    }
    const updated = [...current, trimmed];
    const newConfig = { ...configForm, bookingFormDegreeOptions: updated };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    setNewDegreeInput('');
    showNotify(`Added "${trimmed}" to Degree dropdown`);
  };

  const handleRemoveDegreeOption = (index: number) => {
    const current = configForm.bookingFormDegreeOptions || [];
    const updated = current.filter((_, i) => i !== index);
    const newConfig = { ...configForm, bookingFormDegreeOptions: updated };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    showNotify('Degree option removed');
  };

  const handleMoveDegreeOption = (index: number, direction: 'up' | 'down') => {
    const current = [...(configForm.bookingFormDegreeOptions || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    const newConfig = { ...configForm, bookingFormDegreeOptions: current };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
  };

  const handleSaveDegreeEdit = (index: number) => {
    const trimmed = editingDegreeText.trim();
    if (!trimmed) return;
    const current = [...(configForm.bookingFormDegreeOptions || [])];
    current[index] = trimmed;
    const newConfig = { ...configForm, bookingFormDegreeOptions: current };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    setEditingDegreeIdx(null);
    setEditingDegreeText('');
    showNotify('Degree option updated');
  };

  // Intake handlers
  const handleAddIntakeOption = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = configForm.bookingFormIntakeOptions || [
      'September 2026',
      'January 2027',
      'May 2027',
      'September 2027'
    ];
    if (current.includes(trimmed)) {
      showNotify('Intake option already exists');
      return;
    }
    const updated = [...current, trimmed];
    const newConfig = { ...configForm, bookingFormIntakeOptions: updated };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    setNewIntakeInput('');
    showNotify(`Added "${trimmed}" to Intake dropdown`);
  };

  const handleRemoveIntakeOption = (index: number) => {
    const current = configForm.bookingFormIntakeOptions || [];
    const updated = current.filter((_, i) => i !== index);
    const newConfig = { ...configForm, bookingFormIntakeOptions: updated };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    showNotify('Intake option removed');
  };

  const handleMoveIntakeOption = (index: number, direction: 'up' | 'down') => {
    const current = [...(configForm.bookingFormIntakeOptions || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    const newConfig = { ...configForm, bookingFormIntakeOptions: current };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
  };

  const handleSaveIntakeEdit = (index: number) => {
    const trimmed = editingIntakeText.trim();
    if (!trimmed) return;
    const current = [...(configForm.bookingFormIntakeOptions || [])];
    current[index] = trimmed;
    const newConfig = { ...configForm, bookingFormIntakeOptions: current };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    setEditingIntakeIdx(null);
    setEditingIntakeText('');
    showNotify('Intake option updated');
  };

  // Slot handlers
  const handleAddSlotOption = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = configForm.bookingFormSlotOptions || [
      '11:00 AM IST (Morning)',
      '2:00 PM IST (Afternoon)',
      '4:00 PM IST (Evening)',
      '7:30 PM IST (Late Evening)'
    ];
    if (current.includes(trimmed)) {
      showNotify('Time slot already exists');
      return;
    }
    const updated = [...current, trimmed];
    const newConfig = { ...configForm, bookingFormSlotOptions: updated };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    setNewSlotInput('');
    showNotify(`Added "${trimmed}" to Callback Slots`);
  };

  const handleRemoveSlotOption = (index: number) => {
    const current = configForm.bookingFormSlotOptions || [];
    const updated = current.filter((_, i) => i !== index);
    const newConfig = { ...configForm, bookingFormSlotOptions: updated };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    showNotify('Time slot removed');
  };

  const handleMoveSlotOption = (index: number, direction: 'up' | 'down') => {
    const current = [...(configForm.bookingFormSlotOptions || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    const newConfig = { ...configForm, bookingFormSlotOptions: current };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
  };

  const handleSaveSlotEdit = (index: number) => {
    const trimmed = editingSlotText.trim();
    if (!trimmed) return;
    const current = [...(configForm.bookingFormSlotOptions || [])];
    current[index] = trimmed;
    const newConfig = { ...configForm, bookingFormSlotOptions: current };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    setEditingSlotIdx(null);
    setEditingSlotText('');
    showNotify('Time slot option updated');
  };

  // Quick Preset Handlers
  const handleResetFormDropdowns = () => {
    const defaults = {
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
    const newConfig = { ...configForm, ...defaults };
    setConfigForm(newConfig);
    updateSiteConfig(newConfig);
    showNotify('Form dropdowns reset to default standard configuration.');
  };

  // Loan Save Handler
  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoan || !editingLoan.bankName) return;
    const featuresArray = typeof editingLoan.features === 'string'
      ? (editingLoan.features as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingLoan.features || ['Instant Pre-approval', 'Flexible Tenure']);

    if (isNewLoan) {
      const newObj: LoanProvider = {
        id: editingLoan.id || `loan-${Date.now()}`,
        bankName: editingLoan.bankName || 'New Partner Bank',
        logo: editingLoan.logo || 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&auto=format&fit=crop&q=80',
        interestRate: editingLoan.interestRate || '8.5% p.a.',
        maxAmountINR: Number(editingLoan.maxAmountINR) || 5000000,
        processingTimeDays: Number(editingLoan.processingTimeDays) || 7,
        collateralRequired: editingLoan.collateralRequired ?? false,
        moratoriumPeriodYears: Number(editingLoan.moratoriumPeriodYears) || 1,
        features: featuresArray
      };
      addLoanProvider(newObj);
      showNotify(`Loan provider "${newObj.bankName}" added!`);
    } else {
      updateLoanProvider(editingLoan.id!, {
        ...editingLoan,
        features: featuresArray
      });
      showNotify(`Updated loan provider "${editingLoan.bankName}"!`);
    }
    setEditingLoan(null);
  };

  // Accommodation Save Handler
  const handleSaveAccommodation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccommodation || !editingAccommodation.name) return;
    const amenitiesArray = typeof editingAccommodation.amenities === 'string'
      ? (editingAccommodation.amenities as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingAccommodation.amenities || ['High-Speed WiFi', 'Furnished']);

    const roomTypesArray = typeof editingAccommodation.roomTypes === 'string'
      ? (editingAccommodation.roomTypes as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingAccommodation.roomTypes || ['Single Studio', 'Shared 2-Bed']);

    const nearUnisArray = typeof editingAccommodation.nearUniversities === 'string'
      ? (editingAccommodation.nearUniversities as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingAccommodation.nearUniversities || ['Dubai Knowledge Park']);

    if (isNewAccommodation) {
      const newObj: Accommodation = {
        id: editingAccommodation.id || `acc-${Date.now()}`,
        name: editingAccommodation.name || 'New Student Residence',
        type: editingAccommodation.type || 'Hostel',
        image: editingAccommodation.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
        location: editingAccommodation.location || 'Dubai Marina Hub',
        nearUniversities: nearUnisArray,
        monthlyRentAED: Number(editingAccommodation.monthlyRentAED) || 2500,
        amenities: amenitiesArray,
        roomTypes: roomTypesArray,
        rating: Number(editingAccommodation.rating) || 4.8,
        distanceKm: Number(editingAccommodation.distanceKm) || 1.5
      };
      addAccommodation(newObj);
      showNotify(`Housing property "${newObj.name}" added!`);
    } else {
      updateAccommodation(editingAccommodation.id!, {
        ...editingAccommodation,
        amenities: amenitiesArray,
        roomTypes: roomTypesArray,
        nearUniversities: nearUnisArray
      });
      showNotify(`Updated housing property "${editingAccommodation.name}"!`);
    }
    setEditingAccommodation(null);
  };

  // Webinar Save Handler
  const handleSaveWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWebinar || !editingWebinar.title) return;
    const tagsArray = typeof editingWebinar.tags === 'string'
      ? (editingWebinar.tags as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingWebinar.tags || ['Scholarship', 'Admissions']);

    if (isNewWebinar) {
      const newObj: Webinar = {
        id: editingWebinar.id || `webinar-${Date.now()}`,
        title: editingWebinar.title || 'New Live Masterclass',
        speaker: editingWebinar.speaker || 'Senior Advisor',
        role: editingWebinar.role || 'Dubai Admissions Head',
        date: editingWebinar.date || 'Aug 20, 2026',
        time: editingWebinar.time || '6:00 PM IST',
        image: editingWebinar.image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
        seatsLeft: Number(editingWebinar.seatsLeft) || 45,
        tags: tagsArray
      };
      addWebinar(newObj);
      showNotify(`Webinar "${newObj.title}" scheduled!`);
    } else {
      updateWebinar(editingWebinar.id!, {
        ...editingWebinar,
        tags: tagsArray
      });
      showNotify(`Updated webinar "${editingWebinar.title}"!`);
    }
    setEditingWebinar(null);
  };

  // Blog Save Handler
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title) return;
    if (isNewBlog) {
      const newObj: BlogPost = {
        id: editingBlog.id || `blog-${Date.now()}`,
        title: editingBlog.title || 'New Guide',
        category: editingBlog.category || 'Visas & Living',
        readTime: editingBlog.readTime || '4 min read',
        author: editingBlog.author || 'PrimiPassi Editorial Team',
        date: editingBlog.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: editingBlog.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
        snippet: editingBlog.snippet || 'Essential insights for studying and working in Dubai.',
        content: editingBlog.content || 'Detailed guide content here...'
      };
      addBlogPost(newObj);
      showNotify(`Blog article "${newObj.title}" published!`);
    } else {
      updateBlogPost(editingBlog.id!, editingBlog);
      showNotify(`Updated article "${editingBlog.title}"!`);
    }
    setEditingBlog(null);
  };

  // Country Destination Save Handler
  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCountry || !editingCountry.name?.trim()) return;

    const rawId = (editingCountry.id || editingCountry.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id: CountryCode = rawId || 'destination';

    const topIntakesArray = typeof editingCountry.topIntakes === 'string'
      ? (editingCountry.topIntakes as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingCountry.topIntakes && editingCountry.topIntakes.length > 0)
        ? editingCountry.topIntakes
        : ['September / Fall Intake', 'January / Spring Intake'];

    const popularDegreesArray = typeof editingCountry.popularDegrees === 'string'
      ? (editingCountry.popularDegrees as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingCountry.popularDegrees && editingCountry.popularDegrees.length > 0)
        ? editingCountry.popularDegrees
        : ['Computer Science & AI', 'Master of Business Administration (MBA)', 'Data Science', 'Engineering'];

    const popularCitiesArray = typeof editingCountry.popularCities === 'string'
      ? (editingCountry.popularCities as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingCountry.popularCities && editingCountry.popularCities.length > 0)
        ? editingCountry.popularCities
        : ['Capital Region', 'Major Education Hubs'];

    const keyHighlightsArray = typeof editingCountry.keyHighlights === 'string'
      ? (editingCountry.keyHighlights as string).split('\n').map(s => s.trim()).filter(Boolean)
      : (editingCountry.keyHighlights && editingCountry.keyHighlights.length > 0)
        ? editingCountry.keyHighlights
        : [
            'Global accredited university network with top academic standing',
            'End-to-end visa counseling, SOP drafting and scholarship assistance',
            'Post-study stayback visa opportunities with active hiring markets'
          ];

    const whyChoosePointsArray = editingCountry.whyChoosePoints && editingCountry.whyChoosePoints.length > 0
      ? editingCountry.whyChoosePoints
      : [
          { title: 'World-Class Education', desc: 'Internationally recognized degrees offering rich hands-on experience and global network.' },
          { title: 'Generous Post-Study Work Rights', desc: 'Ample stayback rights and active job markets for skilled graduates.' },
          { title: 'Scholarship & Grant Opportunities', desc: 'Substantial merit waivers and regional grants available for eligible students.' }
        ];

    const admissionStepsArray = editingCountry.admissionSteps && editingCountry.admissionSteps.length > 0
      ? editingCountry.admissionSteps
      : [
          { step: 1, title: 'Profile Evaluation & Course Selection', desc: 'Assess qualifications, GPA, and map eligible institutions and programs.' },
          { step: 2, title: 'University Application & Documentation', desc: 'Draft tailored SOP, compile recommendation letters, and submit application.' },
          { step: 3, title: 'Offer Letter & Scholarship Filing', desc: 'Receive university offer letter and apply for institutional & government waivers.' },
          { step: 4, title: 'Visa Filing & Pre-Departure', desc: 'Complete embassy visa requirements, financial documents, and book accommodation.' }
        ];

    const countryObj: CountryDestination = {
      id,
      name: editingCountry.name.trim(),
      code: (editingCountry.code || editingCountry.name.slice(0, 2)).toUpperCase(),
      flag: editingCountry.flag?.trim() || '🌐',
      category: editingCountry.category || 'overseas',
      isActive: editingCountry.isActive !== false,
      tagline: editingCountry.tagline?.trim() || 'World-Class Higher Education & Global Career Opportunities',
      heroDescription: editingCountry.heroDescription?.trim() || `Explore top ranked universities, courses, scholarship opportunities, and post-study career options in ${editingCountry.name}.`,
      coverImage: editingCountry.coverImage?.trim() || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80',
      avgTuitionDisplay: editingCountry.avgTuitionDisplay?.trim() || 'Tuition on consultation',
      avgLivingCostDisplay: editingCountry.avgLivingCostDisplay?.trim() || 'Living cost on consultation',
      postStudyWorkVisa: editingCountry.postStudyWorkVisa?.trim() || 'Post study work visa available',
      topIntakes: topIntakesArray,
      universitiesCount: editingCountry.universitiesCount?.trim() || '20+ Partner Colleges',
      coursesCount: editingCountry.coursesCount?.trim() || '150+ Programs',
      popularDegrees: popularDegreesArray,
      testRequirements: editingCountry.testRequirements?.trim() || 'IELTS / TOEFL / Duolingo / English Medium Certificate',
      scholarshipHighlight: editingCountry.scholarshipHighlight?.trim() || 'Institutional Merit Waivers & Government Grants Available',
      workRights: editingCountry.workRights?.trim() || 'Part-time work permitted during studies',
      popularCities: popularCitiesArray,
      keyHighlights: keyHighlightsArray,
      whyChoosePoints: whyChoosePointsArray,
      admissionSteps: admissionStepsArray
    };

    if (isNewCountry) {
      addCountry(countryObj);
      showNotify(`Destination "${countryObj.name}" added successfully!`);
    } else {
      updateCountry(countryObj.id, countryObj);
      showNotify(`Destination "${countryObj.name}" updated successfully!`);
    }
    setEditingCountry(null);
  };

  const handleDeleteCountry = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from study destinations?\n\nThis will remove "${name}" from navigation, filters, university listings, and scholarship grant pages across the entire website.`)) {
      deleteCountry(id);
      showNotify(`Removed destination "${name}".`);
    }
  };

  // University Save Handler
  const handleSaveUni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni || !editingUni.name) return;

    const targetCountryCode: CountryCode = editingUni.countryCode || 'india';
    const matchedCountry = countries.find((c) => c.id === targetCountryCode);
    const targetCountryName = editingUni.country || (matchedCountry ? matchedCountry.name : 'India');
    const targetCategory: CountryCategory = editingUni.countryCategory || (matchedCountry ? matchedCountry.category : (targetCountryCode === 'india' ? 'domestic' : 'overseas'));

    const popularCoursesArray = typeof editingUni.popularCourses === 'string'
      ? (editingUni.popularCourses as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingUni.popularCourses && editingUni.popularCourses.length > 0)
        ? editingUni.popularCourses
        : ['Computer Science & AI', 'MBA International', 'Finance'];

    const accreditationArray = typeof editingUni.accreditation === 'string'
      ? (editingUni.accreditation as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingUni.accreditation && editingUni.accreditation.length > 0)
        ? editingUni.accreditation
        : ['Accredited Higher Education Institution'];

    const industryPartnersArray = typeof editingUni.industryPartners === 'string'
      ? (editingUni.industryPartners as string).split(',').map(s => s.trim()).filter(Boolean)
      : (editingUni.industryPartners && editingUni.industryPartners.length > 0)
        ? editingUni.industryPartners
        : ['Global Corporate & Placement Partners'];

    if (isNewUni) {
      const newObj: University = {
        id: editingUni.id || `uni-${Date.now()}`,
        name: editingUni.name.trim(),
        shortName: (editingUni.shortName || editingUni.name.split(' ')[0]).trim(),
        country: targetCountryName,
        countryCode: targetCountryCode,
        countryCategory: targetCategory,
        city: editingUni.city || editingUni.location?.split(',')[0] || targetCountryName,
        location: editingUni.location || `${editingUni.city || 'Main Campus'}, ${targetCountryName}`,
        rankingGlobal: editingUni.rankingGlobal || '#250 QS Global',
        rankingNational: editingUni.rankingNational || `Top Tier Institution in ${targetCountryName}`,
        rankingUae: editingUni.rankingUae || '',
        undergradFeesDisplay: editingUni.undergradFeesDisplay || (targetCategory === 'domestic' ? '₹4.5 Lakhs / yr' : '€4,000 / yr'),
        mastersFeesDisplay: editingUni.mastersFeesDisplay || (targetCategory === 'domestic' ? '₹5.0 Lakhs / yr' : '€4,500 / yr'),
        undergradFeesINR: Number(editingUni.undergradFeesINR) || (targetCategory === 'domestic' ? 450000 : 350000),
        mastersFeesINR: Number(editingUni.mastersFeesINR) || (targetCategory === 'domestic' ? 500000 : 400000),
        undergradFeesAED: Number(editingUni.undergradFeesAED) || 55000,
        mastersFeesAED: Number(editingUni.mastersFeesAED) || 72000,
        scholarshipsMaxPct: Number(editingUni.scholarshipsMaxPct) || (targetCountryCode === 'italy' ? 100 : 50),
        acceptanceRate: Number(editingUni.acceptanceRate) || 75,
        placementRate: Number(editingUni.placementRate) || 94,
        avgStartingSalaryDisplay: editingUni.avgStartingSalaryDisplay || (targetCategory === 'domestic' ? '₹14 LPA Median' : '€45,000 / yr'),
        avgStartingSalaryAED: Number(editingUni.avgStartingSalaryAED) || 14500,
        accreditation: accreditationArray,
        campusType: editingUni.campusType || 'Modern University Campus',
        popularCourses: popularCoursesArray,
        industryPartners: industryPartnersArray,
        image: editingUni.image || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
        logo: editingUni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80',
        description: editingUni.description || `Premier accredited higher education institution located in ${targetCountryName}.`,
        brochureUrl: editingUni.brochureUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        featured: editingUni.featured ?? true,
        degreesOffered: editingUni.degreesOffered || ['Bachelor', 'Master', 'PhD']
      };
      addUniversity(newObj);
      showNotify(`Added "${newObj.name}" categorized under ${targetCountryName} (${targetCategory === 'domestic' ? 'Domestic' : 'Overseas'})!`);
    } else {
      updateUniversity(editingUni.id!, {
        ...editingUni,
        country: targetCountryName,
        countryCode: targetCountryCode,
        countryCategory: targetCategory,
        city: editingUni.city || editingUni.location?.split(',')[0] || targetCountryName,
        location: editingUni.location || `${editingUni.city || 'Main Campus'}, ${targetCountryName}`,
        undergradFeesDisplay: editingUni.undergradFeesDisplay,
        mastersFeesDisplay: editingUni.mastersFeesDisplay,
        undergradFeesAED: Number(editingUni.undergradFeesAED) || 55000,
        mastersFeesAED: Number(editingUni.mastersFeesAED) || 72000,
        scholarshipsMaxPct: Number(editingUni.scholarshipsMaxPct) || 30,
        acceptanceRate: Number(editingUni.acceptanceRate) || 80,
        placementRate: Number(editingUni.placementRate) || 94,
        avgStartingSalaryAED: Number(editingUni.avgStartingSalaryAED) || 14500,
        popularCourses: popularCoursesArray,
        accreditation: accreditationArray,
        industryPartners: industryPartnersArray
      });
      showNotify(`Updated "${editingUni.name}" in ${targetCountryName} category!`);
    }
    setEditingUni(null);
  };

  // Course Save Handler
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title) return;
    if (isNewCourse) {
      const newObj: CourseCategory = {
        id: editingCourse.id || `course-${Date.now()}`,
        title: editingCourse.title || 'New Course',
        iconName: editingCourse.iconName || 'BookOpen',
        description: editingCourse.description || 'Comprehensive degree program.',
        avgDuration: editingCourse.avgDuration || '3-4 Years',
        tuitionRangeAED: editingCourse.tuitionRangeAED || '50,000 - 85,000 AED/yr',
        startingSalaryAED: editingCourse.startingSalaryAED || 14000,
        topCareers: editingCourse.topCareers || ['Specialist', 'Consultant'],
        popularUniversities: editingCourse.popularUniversities || ['Dubai Campus']
      };
      addCourse(newObj);
      showNotify('New Course category created!');
    } else {
      updateCourse(editingCourse.id!, editingCourse);
      showNotify('Course updated!');
    }
    setEditingCourse(null);
  };

  // Scholarship Save Handler
  const handleSaveScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScholarship || !editingScholarship.name?.trim()) {
      showNotify('Please enter a scholarship name.');
      return;
    }
    const scholarshipData: Scholarship = {
      id: editingScholarship.id || `sch-${Date.now()}`,
      name: editingScholarship.name.trim(),
      university: editingScholarship.university?.trim() || 'All Partner Universities',
      country: editingScholarship.country?.trim() || (editingScholarship.countryCode ? countries.find(c => c.id === editingScholarship.countryCode)?.name : undefined),
      countryCode: editingScholarship.countryCode || undefined,
      amount: editingScholarship.amount?.trim() || 'Up to 30% Tuition Waiver',
      discountPct: Number(editingScholarship.discountPct) || 30,
      eligibility: editingScholarship.eligibility?.trim() || 'Merit and academic excellence',
      minGPAOrPct: editingScholarship.minGPAOrPct?.trim() || '70%+',
      deadline: editingScholarship.deadline?.trim() || 'Rolling Admissions',
      category: (editingScholarship.category as any) || 'Merit',
      featured: Boolean(editingScholarship.featured),
      description: editingScholarship.description?.trim() || undefined
    };

    if (isNewScholarship) {
      addScholarship(scholarshipData);
      showNotify('Scholarship grant added successfully!');
    } else {
      updateScholarship(editingScholarship.id!, scholarshipData);
      showNotify('Scholarship grant updated successfully!');
    }
    setEditingScholarship(null);
  };

  // FAQ Save Handler
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question?.trim() || !editingFaq.answer?.trim()) {
      showNotify('Please provide both question and answer.');
      return;
    }
    if (isNewFaq) {
      const newObj: FAQItem = {
        id: editingFaq.id || `faq-${Date.now()}`,
        question: editingFaq.question.trim(),
        answer: editingFaq.answer.trim(),
        category: editingFaq.category || 'Admissions',
        countryCode: editingFaq.countryCode || undefined
      };
      addFaq(newObj);
      showNotify('FAQ added successfully!');
    } else {
      updateFaq(editingFaq.id!, {
        question: editingFaq.question.trim(),
        answer: editingFaq.answer.trim(),
        category: editingFaq.category || 'Admissions',
        countryCode: editingFaq.countryCode || undefined
      });
      showNotify('FAQ updated successfully!');
    }
    setEditingFaq(null);
  };

  // Testimonial Save Handler
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.studentName) return;
    if (isNewTestimonial) {
      const newObj: Testimonial = {
        id: editingTestimonial.id || `test-${Date.now()}`,
        studentName: editingTestimonial.studentName || 'Student Name',
        hometown: editingTestimonial.hometown || 'City, India',
        university: editingTestimonial.university || 'University of Birmingham Dubai',
        course: editingTestimonial.course || 'BSc Computer Science',
        scholarshipReceived: editingTestimonial.scholarshipReceived || '30% Grant',
        currentRole: editingTestimonial.currentRole || 'Software Engineer',
        currentSalaryLPA: editingTestimonial.currentSalaryLPA || '₹25 LPA',
        quote: editingTestimonial.quote || 'Great guidance and visa support!',
        avatar: editingTestimonial.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80'
      };
      addTestimonial(newObj);
      showNotify('Testimonial added!');
    } else {
      updateTestimonial(editingTestimonial.id!, editingTestimonial);
      showNotify('Testimonial updated!');
    }
    setEditingTestimonial(null);
  };

  // PDF Document Save Handler
  const handleSavePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPdf || !editingPdf.title) return;
    if (isNewPdf) {
      const newObj: PdfDocument = {
        id: editingPdf.id || `pdf-${Date.now()}`,
        title: editingPdf.title || 'New PDF Document',
        category: editingPdf.category || 'Brochure',
        fileSize: editingPdf.fileSize || '1.5 MB',
        uploadDate: editingPdf.uploadDate || new Date().toISOString().split('T')[0],
        fileUrl: editingPdf.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: editingPdf.description || 'Official educational PDF document.',
        universityName: editingPdf.universityName || 'PrimiPassi Portal'
      };
      addPdfDocument(newObj);
      showNotify('PDF document uploaded successfully!');
    } else {
      updatePdfDocument(editingPdf.id!, editingPdf);
      showNotify('PDF document updated!');
    }
    setEditingPdf(null);
  };

  return (
    <section className="py-8 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Save Notification Toast */}
        {saveNotification && (
          <div className="fixed top-24 right-6 z-50 bg-[#EA580C] text-white px-5 py-3 rounded-xl shadow-2xl border border-amber-300 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold">{saveNotification}</span>
          </div>
        )}

        {/* Admin Executive Header */}
        <div className="bg-[#EA580C] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase rounded-full border border-white/30 mb-2">
              <Settings className="w-3.5 h-3.5" /> Full Site & PDF Content Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">PrimiPassi Central Admin Console</h1>
            <p className="text-xs text-orange-100/90 mt-1">
              Edit site copy, hero metrics, upload official PDF prospectuses, manage universities, courses, FAQs & reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold text-xs rounded-xl border border-red-500/40 flex items-center gap-1.5 transition-all"
              title="Reset all content back to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2.5 bg-white hover:bg-orange-50 text-[#EA580C] font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
                title="Log out of Admin System"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out Admin
              </button>
            )}
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview', label: 'Executive Stats', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'countries', label: `Destinations (${countries.length})`, icon: <Globe className="w-4 h-4 text-emerald-500" /> },
            { id: 'bookings', label: `Student Leads (${firestoreLeads.filter(l => !l.isArchived).length})`, icon: <Database className="w-4 h-4 text-orange-500" /> },
            { id: 'formConfig', label: 'Consultation Form & Dropdowns', icon: <Sliders className="w-4 h-4 text-orange-500" /> },
            { id: 'config', label: 'Site & Hero Config', icon: <Settings className="w-4 h-4" /> },
            { id: 'pdfs', label: `PDF Documents (${pdfDocuments.length})`, icon: <FileText className="w-4 h-4" /> },
            { id: 'universities', label: `Universities (${universities.length})`, icon: <Building2 className="w-4 h-4" /> },
            { id: 'courses', label: `Courses (${courses.length})`, icon: <BookOpen className="w-4 h-4" /> },
            { id: 'scholarships', label: `Scholarships (${scholarships.length})`, icon: <Award className="w-4 h-4" /> },
            { id: 'loans', label: `Loans (${loanProviders.length})`, icon: <Landmark className="w-4 h-4" /> },
            { id: 'accommodations', label: `Housing (${accommodations.length})`, icon: <Home className="w-4 h-4" /> },
            { id: 'webinars', label: `Webinars (${webinars.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'blogs', label: `Blogs (${blogPosts.length})`, icon: <BookOpen className="w-4 h-4" /> },
            { id: 'faqs', label: `FAQs (${faqs.length})`, icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'testimonials', label: `Reviews (${testimonials.length})`, icon: <Star className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeAdminTab === tab.id
                  ? 'bg-[#EA580C] text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: EXECUTIVE STATS OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold">Total Placed Students</p>
                <p className="text-3xl font-black text-[#EA580C]">{siteConfig.totalPlacedStudents || '15,420+'}</p>
                <span className="text-[10px] text-emerald-600 font-bold">{siteConfig.yoyGrowthRate || '+18.4% YoY Growth'}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold">University Campuses</p>
                <p className="text-3xl font-black text-orange-600">{universities.length} Active ({siteConfig.partnerUniCount || '50+'})</p>
                <span className="text-[10px] text-orange-600 font-bold">100% Direct MoUs</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold">Grants Allocated</p>
                <p className="text-3xl font-black text-amber-600">{siteConfig.grantsAllocatedInr || '₹25.8 Cr'}</p>
                <span className="text-[10px] text-amber-600 font-bold">{siteConfig.grantsAllocatedAed || 'AED 11.4M'}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold">Visa Clearance</p>
                <p className="text-3xl font-black text-emerald-600">{siteConfig.visaSuccessRate || '98%'}</p>
                <span className="text-[10px] text-emerald-600 font-bold">Zero Rejections</span>
              </div>
            </div>

            {/* INTERACTIVE KPI METRICS EDITOR */}
            <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#EA580C]" />
                    <h3 className="text-lg font-bold text-slate-900">Edit Executive Key Metrics & Dashboard Numbers</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize every stat value displayed across the Executive Console and Homepage instantly as per your admin choice.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow hover:bg-[#C2410C] transition-all flex items-center gap-2 shrink-0"
                >
                  <Save className="w-4 h-4 text-amber-300" /> Save Metric Values
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Placed Students</label>
                  <input
                    type="text"
                    value={configForm.totalPlacedStudents || ''}
                    onChange={(e) => setConfigForm({ ...configForm, totalPlacedStudents: e.target.value })}
                    placeholder="15,420+"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">YoY Growth Rate Badge</label>
                  <input
                    type="text"
                    value={configForm.yoyGrowthRate || ''}
                    onChange={(e) => setConfigForm({ ...configForm, yoyGrowthRate: e.target.value })}
                    placeholder="+18.4% YoY"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grants Allocated (INR)</label>
                  <input
                    type="text"
                    value={configForm.grantsAllocatedInr || ''}
                    onChange={(e) => setConfigForm({ ...configForm, grantsAllocatedInr: e.target.value })}
                    placeholder="₹25.8 Cr"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Grants Allocated (AED)</label>
                  <input
                    type="text"
                    value={configForm.grantsAllocatedAed || ''}
                    onChange={(e) => setConfigForm({ ...configForm, grantsAllocatedAed: e.target.value })}
                    placeholder="AED 11.4M"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Visa Success Rate</label>
                  <input
                    type="text"
                    value={configForm.visaSuccessRate || ''}
                    onChange={(e) => setConfigForm({ ...configForm, visaSuccessRate: e.target.value })}
                    placeholder="98%"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Partner Universities Count</label>
                  <input
                    type="text"
                    value={configForm.partnerUniCount || ''}
                    onChange={(e) => setConfigForm({ ...configForm, partnerUniCount: e.target.value })}
                    placeholder="50+"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Average Starting Salary</label>
                  <input
                    type="text"
                    value={configForm.avgStartingSalary || ''}
                    onChange={(e) => setConfigForm({ ...configForm, avgStartingSalary: e.target.value })}
                    placeholder="₹18.5L"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Students Guided Count</label>
                  <input
                    type="text"
                    value={configForm.studentsGuidedCount || ''}
                    onChange={(e) => setConfigForm({ ...configForm, studentsGuidedCount: e.target.value })}
                    placeholder="+12k Students Guided"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>
              </div>
            </form>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">System Management Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use the tabs above to customize every piece of content across the PrimiPassi Marketplace. All edits take effect immediately and are saved locally in your browser session.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-[#EA580C]">Site Configuration</p>
                  <p className="text-[11px] text-slate-500">Edit hero titles, subtitle, top ticker announcement, visa rate, phone & email.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-[#EA580C]">University Catalog</p>
                  <p className="text-[11px] text-slate-500">Add new Dubai campuses, adjust tuition fees, rankings, and popular courses.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-[#EA580C]">Scholarships & Loans</p>
                  <p className="text-[11px] text-slate-500">Update grant percentages, bank interest rates, deadlines, and eligibility criteria.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: STUDY DESTINATIONS & COUNTRY MANAGEMENT */}
        {activeAdminTab === 'countries' && (
          <div className="space-y-6">
            {/* Header / Info card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Study Destinations & Visibility Control</h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Manage global study destinations with country-level ON/OFF visibility controls. When a country is toggled OFF, it is immediately hidden across the website, including its universities, courses, admission details, and scholarships without deleting any underlying data.
                </p>

                {/* Live Visibility Status Summary */}
                <div className="flex items-center gap-3 pt-1 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                    <span>Total Destinations:</span>
                    <span className="bg-white px-2 py-0.5 rounded-lg text-slate-900 shadow-2xs">{countries.length}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-xl text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live on Website (ON):</span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg shadow-2xs font-mono">{countries.filter(c => c.isActive !== false).length}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200/60 rounded-xl text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Hidden from Website (OFF):</span>
                    <span className="bg-rose-600 text-white px-2 py-0.5 rounded-lg shadow-2xs font-mono">{countries.filter(c => c.isActive === false).length}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingCountry({
                    name: '',
                    id: '',
                    code: '',
                    flag: '🌐',
                    category: 'overseas',
                    isActive: true,
                    tagline: '',
                    heroDescription: '',
                    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80',
                    avgTuitionDisplay: '₹8L – ₹22L / yr',
                    avgLivingCostDisplay: '₹50,000 – ₹90,000 / mo',
                    postStudyWorkVisa: '1 – 3 Years Post-Study Work Visa',
                    universitiesCount: '15+ Partner Colleges',
                    coursesCount: '120+ Degrees',
                    topIntakes: ['September / Fall Intake', 'January / Spring Intake'],
                    popularDegrees: ['Computer Science & AI', 'Master of Business Administration (MBA)', 'Data Analytics', 'Engineering'],
                    testRequirements: 'IELTS / TOEFL / Duolingo / English Medium Waiver',
                    scholarshipHighlight: 'Up to 50% Merit Scholarships & Government Grants',
                    workRights: '20 hours/week during term time',
                    popularCities: ['Capital Region', 'Major Education Hubs'],
                    keyHighlights: [
                      'Internationally accredited universities and recognized degrees',
                      'Comprehensive visa guidance, SOP assistance and scholarship filing',
                      'High graduate employability and multi-year stayback rights'
                    ]
                  });
                  setIsNewCountry(true);
                }}
                className="px-5 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all shrink-0"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Add New Destination
              </button>
            </div>

            {/* Quick Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search countries, ISO codes, cities..."
                  value={countrySearchTerm}
                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto flex-wrap">
                {/* Category Filters */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['all', 'domestic', 'overseas'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCountryCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize whitespace-nowrap ${
                        countryCategoryFilter === cat
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'all' ? `All (${countries.length})` : cat === 'domestic' ? `Domestic (${countries.filter(c => c.category === 'domestic').length})` : `Overseas (${countries.filter(c => c.category === 'overseas').length})`}
                    </button>
                  ))}
                </div>

                {/* Visibility Status Filters */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setCountryStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      countryStatusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => setCountryStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      countryStatusFilter === 'active'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Live ON ({countries.filter(c => c.isActive !== false).length})</span>
                  </button>
                  <button
                    onClick={() => setCountryStatusFilter('inactive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      countryStatusFilter === 'inactive'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 hover:text-rose-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Hidden OFF ({countries.filter(c => c.isActive === false).length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Countries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries
                .filter((c) => {
                  const matchesSearch =
                    c.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                    c.code.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                    (c.tagline && c.tagline.toLowerCase().includes(countrySearchTerm.toLowerCase())) ||
                    (c.popularCities && c.popularCities.some(city => city.toLowerCase().includes(countrySearchTerm.toLowerCase())));
                  const matchesCategory =
                    countryCategoryFilter === 'all' || c.category === countryCategoryFilter;
                  const isCountryActive = c.isActive !== false;
                  const matchesStatus =
                    countryStatusFilter === 'all' ||
                    (countryStatusFilter === 'active' && isCountryActive) ||
                    (countryStatusFilter === 'inactive' && !isCountryActive);

                  return matchesSearch && matchesCategory && matchesStatus;
                })
                .map((c) => {
                  const isLive = c.isActive !== false;
                  const linkedUnis = universities.filter(
                    (u) => u.countryCode === c.id || u.country.toLowerCase() === c.name.toLowerCase()
                  );
                  const linkedScholarships = scholarships.filter(
                    (s) => s.countryCode === c.id || s.country?.toLowerCase() === c.name.toLowerCase()
                  );

                  return (
                    <div
                      key={c.id}
                      className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${
                        isLive
                          ? 'border-slate-200'
                          : 'border-rose-200 bg-rose-50/20 ring-1 ring-rose-200/50'
                      }`}
                    >
                      {/* Image Header with Badge Overlay */}
                      <div className="relative h-48 bg-slate-800 overflow-hidden">
                        <img
                          src={c.coverImage || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=80'}
                          alt={c.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            isLive ? 'opacity-80' : 'opacity-40 grayscale contrast-125'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                        {/* Top Badges & Quick Toggle */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${
                            c.category === 'domestic'
                              ? 'bg-amber-500 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}>
                            {c.category === 'domestic' ? 'Domestic Admissions' : 'Overseas Study'}
                          </span>

                          {/* Country Visibility Toggle Button in Header */}
                          <button
                            type="button"
                            onClick={() => {
                              toggleCountryVisibility(c.id);
                              showNotify(`Destination "${c.name}" is now ${isLive ? 'HIDDEN from' : 'VISIBLE on'} the public website.`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                              isLive
                                ? 'bg-emerald-600/95 hover:bg-emerald-700 text-white border border-emerald-400/40'
                                : 'bg-rose-600/95 hover:bg-rose-700 text-white border border-rose-400/40 animate-pulse'
                            }`}
                            title={`Click to switch ${c.name} ${isLive ? 'OFF' : 'ON'}`}
                          >
                            {isLive ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>ON • Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>OFF • Hidden</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Bottom Name Title */}
                        <div className="absolute bottom-3 left-4 right-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl drop-shadow">{c.flag || '🌐'}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-white leading-tight drop-shadow-sm">{c.name}</h3>
                                <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-mono font-bold rounded border border-white/20">
                                  {c.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-200 line-clamp-1">{c.tagline || 'Top Higher Education Destination'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Visibility Banner Alert if OFF */}
                          {!isLive && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-rose-900">
                              <EyeOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div className="text-xs leading-relaxed">
                                <p className="font-bold text-rose-800">Hidden from Public Website</p>
                                <p className="text-[11px] text-rose-600 mt-0.5">
                                  This destination, its {linkedUnis.length} colleges, courses, and scholarship records are hidden from visitors. Toggle ON to restore.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Tuition</p>
                              <p className="font-bold text-slate-800 line-clamp-1">{c.avgTuitionDisplay || 'Contact for info'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Living Cost</p>
                              <p className="font-bold text-slate-800 line-clamp-1">{c.avgLivingCostDisplay || 'Contact for info'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Post-Study Visa</p>
                              <p className="font-bold text-emerald-700 line-clamp-1">{c.postStudyWorkVisa || 'Available'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Linked Unis</p>
                              <p className="font-bold text-[#EA580C]">{linkedUnis.length} Campuses</p>
                            </div>
                          </div>

                          {/* Quick details */}
                          <div className="space-y-1.5 text-xs text-slate-600">
                            {c.testRequirements && (
                              <div className="flex items-start gap-1.5">
                                <span className="text-slate-400 font-bold text-[10px] uppercase shrink-0 mt-0.5">Tests:</span>
                                <span className="text-slate-700 font-medium line-clamp-1">{c.testRequirements}</span>
                              </div>
                            )}
                            {c.scholarshipHighlight && (
                              <div className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold text-[10px] uppercase shrink-0 mt-0.5">Grants:</span>
                                <span className="text-emerald-800 font-semibold line-clamp-1">{c.scholarshipHighlight}</span>
                              </div>
                            )}
                          </div>

                          {/* Popular Cities */}
                          {c.popularCities && c.popularCities.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {c.popularCities.slice(0, 3).map((city, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                                  📍 {city}
                                </span>
                              ))}
                              {c.popularCities.length > 3 && (
                                <span className="text-[10px] font-bold text-slate-400">+{c.popularCities.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Actions & Visibility Switch Row */}
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          {/* Dedicated ON/OFF Toggle Bar */}
                          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <div>
                                <p className="text-xs font-bold text-slate-900 leading-none">
                                  Website Visibility: <span className={isLive ? 'text-emerald-600' : 'text-rose-600'}>{isLive ? 'ON (Visible)' : 'OFF (Hidden)'}</span>
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {isLive ? 'Live for all website visitors' : 'Hidden from navigation & lists'}
                                </p>
                              </div>
                            </div>

                            {/* Accessible Interactive Switch */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isLive}
                              onClick={() => {
                                toggleCountryVisibility(c.id);
                                showNotify(`Destination "${c.name}" is now ${isLive ? 'HIDDEN from' : 'VISIBLE on'} the public website.`);
                              }}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2 ${
                                isLive ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            >
                              <span className="sr-only">Toggle {c.name} visibility</span>
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  isLive ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-400">
                              {linkedScholarships.length} Grants Linked
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingCountry({ ...c });
                                  setIsNewCountry(false);
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-[#EA580C] hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                                title="Edit Destination details"
                              >
                                <Edit className="w-3.5 h-3.5" /> Edit
                              </button>

                              <button
                                onClick={() => handleDeleteCountry(c.id, c.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title={`Delete ${c.name} Destination`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 2: FIRESTORE STUDENT LEADS & COUNSELLING BOOKINGS */}
        {activeAdminTab === 'bookings' && (
          <div className="space-y-6">
            {/* Top Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="p-2 bg-orange-100 text-[#EA580C] rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Student Admissions Leads</h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Firebase Firestore Live Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
                  Real-time student consultation requests stored centrally in Google Cloud Firestore. Public website visitors can submit inquiries; only authorized administrator (<span className="font-mono font-bold text-slate-700">{AUTHORIZED_ADMIN_EMAIL}</span>) can access, manage, and export records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={loadFirestoreLeads}
                  disabled={isLoadingLeads}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all border border-slate-200"
                  title="Reload leads from Firestore"
                >
                  <RefreshCw className={`w-4 h-4 text-[#EA580C] ${isLoadingLeads ? 'animate-spin' : ''}`} />
                  <span>{isLoadingLeads ? 'Syncing...' : 'Refresh Leads'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stored Leads</div>
                <div className="text-2xl font-black text-slate-900">{firestoreLeads.length}</div>
                <p className="text-[10px] text-slate-500">Central cloud database</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Active Queue</div>
                <div className="text-2xl font-black text-[#EA580C]">
                  {firestoreLeads.filter((b) => !b.isArchived).length}
                </div>
                <p className="text-[10px] text-slate-500">Pending & active consultations</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">New Action Needed</div>
                <div className="text-2xl font-black text-amber-600">
                  {firestoreLeads.filter((b) => b.status === 'New' && !b.isArchived).length}
                </div>
                <p className="text-[10px] text-slate-500">Uncontacted incoming leads</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Archived Leads</div>
                <div className="text-2xl font-black text-slate-600">
                  {firestoreLeads.filter((b) => b.isArchived).length}
                </div>
                <p className="text-[10px] text-slate-500">Exported or closed cohort</p>
              </div>
            </div>

            {/* Queue Mode Selector & Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                {/* View Mode: Active vs Archived vs All */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => {
                      setLeadViewMode('active');
                      setSelectedLeadIds([]);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      leadViewMode === 'active'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Active Queue ({firestoreLeads.filter((b) => !b.isArchived).length})
                  </button>
                  <button
                    onClick={() => {
                      setLeadViewMode('archived');
                      setSelectedLeadIds([]);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      leadViewMode === 'archived'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Archived ({firestoreLeads.filter((b) => b.isArchived).length})
                  </button>
                  <button
                    onClick={() => {
                      setLeadViewMode('all');
                      setSelectedLeadIds([]);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      leadViewMode === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Leads ({firestoreLeads.length})
                  </button>
                </div>

                {/* Bulk Actions when selected */}
                {selectedLeadIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
                    <span className="text-xs font-bold text-orange-900">
                      {selectedLeadIds.length} selected
                    </span>
                    {leadViewMode !== 'archived' && (
                      <button
                        onClick={handleBulkArchiveSelected}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Archive className="w-3.5 h-3.5" /> Archive Selected
                      </button>
                    )}
                    {leadViewMode === 'archived' && (
                      <button
                        onClick={async () => {
                          for (const id of selectedLeadIds) {
                            await updateLeadArchiveInFirestore(id, false);
                          }
                          setFirestoreLeads((prev) =>
                            prev.map((b) =>
                              selectedLeadIds.includes(b.id)
                                ? { ...b, isArchived: false, status: 'New' }
                                : b
                            )
                          );
                          setSelectedLeadIds([]);
                          showNotify(`Restored ${selectedLeadIds.length} leads to active queue.`);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
                      >
                        <ArchiveRestore className="w-3.5 h-3.5" /> Restore to Active
                      </button>
                    )}
                    <button
                      onClick={handleBulkDeleteSelected}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <button
                      onClick={() => setSelectedLeadIds([])}
                      className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-bold"
                    >
                      Deselect
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-medium">
                    Select rows below for bulk archive or cleanup
                  </div>
                )}
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone, program, country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Status:
                  </span>
                  {['All', 'New', 'Contacted', 'In Consultation', 'Converted', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setBookingStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        bookingStatusFilter === status
                          ? 'bg-[#EA580C] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}

                  {/* CSV Export Button */}
                  <button
                    onClick={() => {
                      const leadsToExport = firestoreLeads.filter((b) => {
                        const matchesViewMode =
                          leadViewMode === 'all'
                            ? true
                            : leadViewMode === 'archived'
                            ? Boolean(b.isArchived)
                            : !b.isArchived;
                        const matchesFilter =
                          bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
                        const matchesSearch =
                          b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.degree && b.degree.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.intake && b.intake.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.prefilledDetails && b.prefilledDetails.toLowerCase().includes(searchTerm.toLowerCase()));
                        return matchesViewMode && matchesFilter && matchesSearch;
                      });

                      if (leadsToExport.length === 0) {
                        showNotify('No matching leads found to export.');
                        return;
                      }

                      const headers = [
                        'Lead ID',
                        'Student Full Name',
                        'Email Address',
                        'Phone Number',
                        'Target Program / Degree',
                        'Target Intake',
                        'Destination Country',
                        'Requested Slot',
                        'Lead Status',
                        'Is Archived',
                        'Submission Date / Time',
                        'Additional Context & Notes'
                      ];

                      const sanitize = (val: any) =>
                        `"${String(val ?? '').replace(/"/g, '""')}"`;

                      const rows = leadsToExport.map((b) => [
                        sanitize(b.id),
                        sanitize(b.fullName),
                        sanitize(b.email),
                        sanitize(b.phone),
                        sanitize(b.degree),
                        sanitize(b.intake),
                        sanitize(b.targetCountry || 'Dubai / Global'),
                        sanitize(b.selectedSlot),
                        sanitize(b.status),
                        sanitize(b.isArchived ? 'Yes' : 'No'),
                        sanitize(b.createdAt),
                        sanitize(b.prefilledDetails || '')
                      ]);

                      const csvContent =
                        '\uFEFF' +
                        [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.setAttribute('href', url);
                      link.setAttribute(
                        'download',
                        `PrimiPassi_Leads_${leadViewMode}_${leadsToExport.length}_${new Date().toISOString().split('T')[0]}.csv`
                      );
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);

                      showNotify(`Exported ${leadsToExport.length} leads to CSV.`);

                      // If exported active leads, prompt to archive
                      if (leadViewMode === 'active' || leadViewMode === 'all') {
                        const activeExportedIds = leadsToExport
                          .filter((b) => !b.isArchived)
                          .map((b) => b.id);
                        if (activeExportedIds.length > 0) {
                          setExportedLeadIdsForArchive(activeExportedIds);
                          setArchiveModalOpen(true);
                        }
                      }
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm ml-auto lg:ml-2"
                    title="Export currently filtered leads as CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="p-4 w-10 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[#EA580C] focus:ring-[#EA580C]"
                          checked={
                            firestoreLeads.length > 0 &&
                            firestoreLeads.every((b) => selectedLeadIds.includes(b.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeadIds(firestoreLeads.map((b) => b.id));
                            } else {
                              setSelectedLeadIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-4">Student & Contact Info</th>
                      <th className="p-4">Program & Target Intake</th>
                      <th className="p-4">Slot & Timestamp</th>
                      <th className="p-4">Lead Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {firestoreLeads
                      .filter((booking) => {
                        const matchesViewMode =
                          leadViewMode === 'all'
                            ? true
                            : leadViewMode === 'archived'
                            ? Boolean(booking.isArchived)
                            : !booking.isArchived;
                        const matchesFilter =
                          bookingStatusFilter === 'All' || booking.status === bookingStatusFilter;
                        const matchesSearch =
                          booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (booking.degree && booking.degree.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (booking.intake && booking.intake.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (booking.prefilledDetails && booking.prefilledDetails.toLowerCase().includes(searchTerm.toLowerCase()));
                        return matchesViewMode && matchesFilter && matchesSearch;
                      })
                      .map((booking) => {
                        const isSelected = selectedLeadIds.includes(booking.id);
                        return (
                          <tr
                            key={booking.id}
                            className={`transition-colors ${
                              isSelected ? 'bg-orange-50/50' : 'hover:bg-slate-50/80'
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 text-[#EA580C] focus:ring-[#EA580C]"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeadIds((prev) => [...prev, booking.id]);
                                  } else {
                                    setSelectedLeadIds((prev) =>
                                      prev.filter((id) => id !== booking.id)
                                    );
                                  }
                                }}
                              />
                            </td>

                            <td className="p-4">
                              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#EA580C]" />
                                {booking.fullName}
                                {booking.isArchived && (
                                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded">
                                    Archived
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-1 flex flex-col gap-0.5">
                                <a
                                  href={`mailto:${booking.email}`}
                                  className="flex items-center gap-1 text-slate-600 hover:text-[#EA580C] transition-colors"
                                >
                                  <Mail className="w-3 h-3 text-slate-400" /> {booking.email}
                                </a>
                                <a
                                  href={`tel:${booking.phone}`}
                                  className="flex items-center gap-1 text-slate-600 hover:text-[#EA580C] transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" /> {booking.phone}
                                </a>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="font-bold text-slate-800">{booking.degree || 'General Consultation'}</div>
                              <div className="text-[11px] text-orange-600 font-semibold mt-0.5">
                                {booking.intake || 'Flexible Intake'}
                              </div>
                              {booking.prefilledDetails && (
                                <div
                                  className="text-[10px] text-slate-500 truncate max-w-[220px] mt-0.5"
                                  title={booking.prefilledDetails}
                                >
                                  {booking.prefilledDetails}
                                </div>
                              )}
                            </td>

                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-800 font-bold text-[11px] rounded-lg border border-orange-200">
                                <Clock className="w-3 h-3 text-orange-600" /> {booking.selectedSlot}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                {booking.createdAt || 'Recent'}
                              </div>
                            </td>

                            <td className="p-4">
                              <select
                                value={booking.status}
                                onChange={(e) =>
                                  handleUpdateFirestoreLeadStatus(
                                    booking.id,
                                    e.target.value as CounsellingBooking['status']
                                  )
                                }
                                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border focus:outline-none transition-colors ${
                                  booking.status === 'New'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : booking.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : booking.status === 'In Consultation'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : booking.status === 'Converted'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : booking.status === 'Archived'
                                    ? 'bg-slate-200 text-slate-800 border-slate-400'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="New">New Lead</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Consultation">In Consultation</option>
                                <option value="Converted">Converted Student</option>
                                <option value="Closed">Closed</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedBookingForModal(booking)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                                  title="View full lead record"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                                  <span className="hidden sm:inline">Details</span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleArchiveLead(booking.id, !booking.isArchived)
                                  }
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    booking.isArchived
                                      ? 'text-emerald-600 hover:bg-emerald-50'
                                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                  }`}
                                  title={booking.isArchived ? 'Restore to Active' : 'Archive Lead'}
                                >
                                  {booking.isArchived ? (
                                    <ArchiveRestore className="w-4 h-4" />
                                  ) : (
                                    <Archive className="w-4 h-4" />
                                  )}
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteFirestoreLead(booking.id, booking.fullName)
                                  }
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Lead from Firestore"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                    {firestoreLeads.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-16 space-y-2">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                            <Inbox className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-700">No leads found in Firestore</p>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            When students book free counselling or submit admission forms on the site, their submissions will automatically appear here in real time.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODAL FOR VIEWING FULL STUDENT LEAD RECORD */}
            {selectedBookingForModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-200">
                  <button
                    onClick={() => setSelectedBookingForModal(null)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 text-[#EA580C] rounded-2xl flex items-center justify-center font-bold">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {selectedBookingForModal.fullName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Firestore Lead ID:{' '}
                        <span className="font-mono text-slate-700 font-bold">
                          {selectedBookingForModal.id}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Email Address</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          <a
                            href={`mailto:${selectedBookingForModal.email}`}
                            className="text-[#EA580C] hover:underline"
                          >
                            {selectedBookingForModal.email}
                          </a>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Phone Number</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          <a
                            href={`tel:${selectedBookingForModal.phone}`}
                            className="text-[#EA580C] hover:underline"
                          >
                            {selectedBookingForModal.phone}
                          </a>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Degree / Program</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {selectedBookingForModal.degree || 'General Consultation'}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Target Intake</span>
                        <div className="font-bold text-orange-600 mt-0.5">
                          {selectedBookingForModal.intake || 'Not Specified'}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Requested Consultation Slot</span>
                        <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          {selectedBookingForModal.selectedSlot}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px]">Submitted Date / Time</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {selectedBookingForModal.createdAt || 'Recent'}
                        </div>
                      </div>
                    </div>

                    {selectedBookingForModal.prefilledDetails && (
                      <div className="border-t border-slate-200 pt-3">
                        <span className="font-bold text-slate-400 uppercase text-[10px]">
                          Context / Notes / Course Page Source
                        </span>
                        <p className="text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                          {selectedBookingForModal.prefilledDetails}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                          Update Lead Status
                        </span>
                        <select
                          value={selectedBookingForModal.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as CounsellingBooking['status'];
                            handleUpdateFirestoreLeadStatus(selectedBookingForModal.id, newStatus);
                            setSelectedBookingForModal({
                              ...selectedBookingForModal,
                              status: newStatus
                            });
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#EA580C]"
                        >
                          <option value="New">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Consultation">In Consultation</option>
                          <option value="Converted">Converted Student</option>
                          <option value="Closed">Closed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const shouldArchive = !selectedBookingForModal.isArchived;
                            handleToggleArchiveLead(selectedBookingForModal.id, shouldArchive);
                            setSelectedBookingForModal({
                              ...selectedBookingForModal,
                              isArchived: shouldArchive,
                              status: shouldArchive ? 'Archived' : 'New'
                            });
                          }}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          {selectedBookingForModal.isArchived ? (
                            <>
                              <ArchiveRestore className="w-3.5 h-3.5" /> Restore to Active
                            </>
                          ) : (
                            <>
                              <Archive className="w-3.5 h-3.5" /> Archive Lead
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            handleDeleteFirestoreLead(
                              selectedBookingForModal.id,
                              selectedBookingForModal.fullName
                            );
                            setSelectedBookingForModal(null);
                          }}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={() => setSelectedBookingForModal(null)}
                      className="px-6 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: POST-EXPORT ARCHIVE CONFIRMATION */}
            {archiveModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold mx-auto">
                    <Archive className="w-6 h-6" />
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-black text-slate-900">
                      Archive {exportedLeadIdsForArchive.length} Exported Leads?
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      You just exported {exportedLeadIdsForArchive.length} leads to CSV. Would you like to move them to the <strong>Archive</strong> in Firestore to keep your Active Queue clean for new incoming students?
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Note:</p>
                    <p className="text-[11px] mt-0.5">
                      Archived leads are never deleted and can be viewed or restored anytime from the "Archived" tab.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setArchiveModalOpen(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Keep Active
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await bulkArchiveLeadsInFirestore(exportedLeadIdsForArchive);
                          setFirestoreLeads((prev) =>
                            prev.map((b) =>
                              exportedLeadIdsForArchive.includes(b.id)
                                ? { ...b, isArchived: true, status: 'Archived' }
                                : b
                            )
                          );
                          showNotify(`Archived ${exportedLeadIdsForArchive.length} leads.`);
                        } catch (err: any) {
                          console.error('Bulk archive error:', err);
                        } finally {
                          setArchiveModalOpen(false);
                          setExportedLeadIdsForArchive([]);
                        }
                      }}
                      className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow transition-colors"
                    >
                      Archive Leads
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: CONSULTATION FORM & DROPDOWN MANAGEMENT */}
        {activeAdminTab === 'formConfig' && (
          <div className="space-y-6">
            {/* Header Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-orange-100 text-[#EA580C] rounded-xl">
                    <Sliders className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-black text-slate-900">Consultation Form & Dropdown Console</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Full administrative control to add, edit, reorder, or remove options from the <span className="font-bold text-slate-800">Degree Level</span>, <span className="font-bold text-slate-800">Target Intake</span>, and <span className="font-bold text-slate-800">Callback Slot</span> dropdowns. Any changes take effect immediately across all student modals and booking forms.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleResetFormDropdowns}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  title="Reset all dropdown choices to standard defaults"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Dropdowns</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveConfig(e)}
                  className="px-5 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>

            {/* FORM METADATA & COPY CARD */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#EA580C]" /> Form Header & CTA Button Customization
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize titles, badges, and button labels on the student consultation booking popup.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Form Main Title</label>
                  <input
                    type="text"
                    value={configForm.bookingFormTitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfigForm({ ...configForm, bookingFormTitle: val });
                      updateSiteConfig({ ...siteConfig, bookingFormTitle: val });
                    }}
                    placeholder="Book Free Admissions Consultation"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Eyebrow Badge Text</label>
                  <input
                    type="text"
                    value={configForm.bookingFormBadge || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfigForm({ ...configForm, bookingFormBadge: val });
                      updateSiteConfig({ ...siteConfig, bookingFormBadge: val });
                    }}
                    placeholder="Free 1-on-1 Mentorship"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Form Subtitle / Promise</label>
                  <input
                    type="text"
                    value={configForm.bookingFormSubtitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfigForm({ ...configForm, bookingFormSubtitle: val });
                      updateSiteConfig({ ...siteConfig, bookingFormSubtitle: val });
                    }}
                    placeholder="Connect with our senior study abroad & domestic advisors..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Submit CTA Button Label</label>
                  <input
                    type="text"
                    value={configForm.bookingFormCtaText || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfigForm({ ...configForm, bookingFormCtaText: val });
                      updateSiteConfig({ ...siteConfig, bookingFormCtaText: val });
                    }}
                    placeholder="Confirm 100% Free Consultation"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>
              </div>
            </div>

            {/* 3-COLUMN GRID OF DROPDOWN EDITORS */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* DROPDOWN 1: DEGREE LEVEL OPTIONS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-[#EA580C]" /> Degree Level Options
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Controls options in the "Degree Level" dropdown
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-100 text-[#EA580C] text-[11px] font-bold rounded-full">
                      {(configForm.bookingFormDegreeOptions || []).length} items
                    </span>
                  </div>

                  {/* Add New Degree Option */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddDegreeOption(newDegreeInput);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newDegreeInput}
                      onChange={(e) => setNewDegreeInput(e.target.value)}
                      placeholder="e.g. Executive MBA / PhD"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    />
                    <button
                      type="submit"
                      disabled={!newDegreeInput.trim()}
                      className="px-3 py-2 bg-[#EA580C] hover:bg-[#C2410C] disabled:bg-slate-200 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>

                  {/* List of Degrees */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {(configForm.bookingFormDegreeOptions || [
                      'Undergraduate (Bachelors)',
                      'Masters / Post-Graduate',
                      'MBA / Executive Management',
                      'PhD / Doctorate'
                    ]).map((deg, idx, arr) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 hover:bg-orange-50/50 border border-slate-200/80 rounded-xl transition-colors group"
                      >
                        {editingDegreeIdx === idx ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingDegreeText}
                              onChange={(e) => setEditingDegreeText(e.target.value)}
                              className="flex-1 px-2 py-1 bg-white border border-orange-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveDegreeEdit(idx)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                              title="Save Edit"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDegreeIdx(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded-md"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate" title={deg}>
                                {deg}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveDegreeOption(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => handleMoveDegreeOption(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDegreeIdx(idx);
                                  setEditingDegreeText(deg);
                                }}
                                className="p-1 text-slate-400 hover:text-[#EA580C] rounded hover:bg-orange-50 transition-colors"
                                title="Edit Item"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDegreeOption(idx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DROPDOWN 2: TARGET INTAKE SEASONS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" /> Target Intake Options
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Controls options in the "Target Intake" dropdown
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
                      {(configForm.bookingFormIntakeOptions || []).length} items
                    </span>
                  </div>

                  {/* Add New Intake Option */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddIntakeOption(newIntakeInput);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newIntakeInput}
                      onChange={(e) => setNewIntakeInput(e.target.value)}
                      placeholder="e.g. Spring / Jan 2028"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!newIntakeInput.trim()}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>

                  {/* List of Intakes */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {(configForm.bookingFormIntakeOptions || [
                      'September 2026',
                      'January 2027',
                      'May 2027',
                      'September 2027',
                      'Immediate 2026 Admissions'
                    ]).map((intk, idx, arr) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 rounded-xl transition-colors group"
                      >
                        {editingIntakeIdx === idx ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingIntakeText}
                              onChange={(e) => setEditingIntakeText(e.target.value)}
                              className="flex-1 px-2 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveIntakeEdit(idx)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                              title="Save Edit"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingIntakeIdx(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded-md"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate" title={intk}>
                                {intk}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveIntakeOption(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => handleMoveIntakeOption(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingIntakeIdx(idx);
                                  setEditingIntakeText(intk);
                                }}
                                className="p-1 text-slate-400 hover:text-amber-600 rounded hover:bg-amber-50 transition-colors"
                                title="Edit Item"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveIntakeOption(idx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DROPDOWN 3: CALLBACK TIME SLOTS */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-600" /> Callback Time Slots
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Controls options in the "Preferred Time" dropdown
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                      {(configForm.bookingFormSlotOptions || []).length} items
                    </span>
                  </div>

                  {/* Add New Slot Option */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddSlotOption(newSlotInput);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newSlotInput}
                      onChange={(e) => setNewSlotInput(e.target.value)}
                      placeholder="e.g. 9:00 PM IST (Night)"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!newSlotInput.trim()}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>

                  {/* List of Slots */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {(configForm.bookingFormSlotOptions || [
                      '11:00 AM IST (Morning)',
                      '2:00 PM IST (Afternoon)',
                      '4:00 PM IST (Evening)',
                      '7:30 PM IST (Late Evening)',
                      'Immediate (Next 15 Mins)'
                    ]).map((slot, idx, arr) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-xl transition-colors group"
                      >
                        {editingSlotIdx === idx ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingSlotText}
                              onChange={(e) => setEditingSlotText(e.target.value)}
                              className="flex-1 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveSlotEdit(idx)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                              title="Save Edit"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSlotIdx(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded-md"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate" title={slot}>
                                {slot}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveSlotOption(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => handleMoveSlotOption(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition-colors"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSlotIdx(idx);
                                  setEditingSlotText(slot);
                                }}
                                className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                                title="Edit Item"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSlotOption(idx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE INTERACTIVE FORM PREVIEW / SANDBOX */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Real-time Interactive Sandbox
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">Live Student Consultation Modal Preview</h3>
                  <p className="text-xs text-slate-400">
                    Interact directly with this form to see how your dropdown changes appear to students.
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-mono text-emerald-400 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sync Status: Live Active</span>
                </div>
              </div>

              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl max-w-xl mx-auto shadow-2xl space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {configForm.bookingFormBadge || 'Free 1-on-1 Mentorship'}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">
                    {configForm.bookingFormTitle || 'Book Free Admissions Consultation'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {configForm.bookingFormSubtitle || 'Connect with our senior study abroad & domestic advisors for course selection, 100% scholarships, and visa filing.'}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value="John Doe (Sample Student)"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">Degree Level (Live Dropdown)</label>
                      <select
                        className="w-full bg-orange-50/70 border border-orange-300 rounded-xl px-3 py-2 text-xs font-bold text-orange-950 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                      >
                        {(configForm.bookingFormDegreeOptions || [
                          'Undergraduate (Bachelors)',
                          'Masters / Post-Graduate',
                          'MBA / Executive Management',
                          'PhD / Doctorate'
                        ]).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">Target Intake (Live Dropdown)</label>
                      <select
                        className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {(configForm.bookingFormIntakeOptions || [
                          'September 2026',
                          'January 2027',
                          'May 2027',
                          'September 2027'
                        ]).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Preferred Callback Slot (Live Dropdown)</label>
                    <select
                      className="w-full bg-emerald-50/70 border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {(configForm.bookingFormSlotOptions || [
                        '11:00 AM IST (Morning)',
                        '2:00 PM IST (Afternoon)',
                        '4:00 PM IST (Evening)',
                        '7:30 PM IST (Late Evening)'
                      ]).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showNotify('Preview verified: Live Consultation Form reflects all your customized dropdown items!');
                    }}
                    className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-3"
                  >
                    <span>{configForm.bookingFormCtaText || 'Confirm 100% Free Consultation'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SITE CONFIG & HERO EDITING */}
        {activeAdminTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-[#EA580C]">Edit Main Banner & Site Copy</h2>
              <p className="text-xs text-slate-500">Changes here update the homepage Hero, Header Ticker, and Footer immediately.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hero Title Line 1</label>
                <input
                  type="text"
                  value={configForm.heroTitle}
                  onChange={(e) => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hero Highlight Text (Gold)</label>
                <input
                  type="text"
                  value={configForm.heroHighlightText}
                  onChange={(e) => setConfigForm({ ...configForm, heroHighlightText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={configForm.heroSubtitle}
                  onChange={(e) => setConfigForm({ ...configForm, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Eyebrow Badge Text</label>
                <input
                  type="text"
                  value={configForm.eyebrowBadge}
                  onChange={(e) => setConfigForm({ ...configForm, eyebrowBadge: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Header Announcement Ticker</label>
                <input
                  type="text"
                  value={configForm.announcementTicker}
                  onChange={(e) => setConfigForm({ ...configForm, announcementTicker: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Visa Success Metric</label>
                <input
                  type="text"
                  value={configForm.visaSuccessRate}
                  onChange={(e) => setConfigForm({ ...configForm, visaSuccessRate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Partner Universities Count</label>
                <input
                  type="text"
                  value={configForm.partnerUniCount}
                  onChange={(e) => setConfigForm({ ...configForm, partnerUniCount: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Average Starting Salary</label>
                <input
                  type="text"
                  value={configForm.avgStartingSalary}
                  onChange={(e) => setConfigForm({ ...configForm, avgStartingSalary: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Toll-Free Phone</label>
                <input
                  type="text"
                  value={configForm.tollFreePhone}
                  onChange={(e) => setConfigForm({ ...configForm, tollFreePhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Support Email</label>
                <input
                  type="text"
                  value={configForm.supportEmail}
                  onChange={(e) => setConfigForm({ ...configForm, supportEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Office Locations Copy</label>
                <input
                  type="text"
                  value={configForm.officesText}
                  onChange={(e) => setConfigForm({ ...configForm, officesText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* DEDICATED COUNSELLING ALERT EMAIL SETTING */}
              <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-amber-50/50 p-5 rounded-2xl border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#EA580C]">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span>Authorized Administrator Contact Email</span>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                    Direct Firestore Storage
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Student counselling requests and leads submitted across the website are recorded directly in Firebase Firestore and managed securely in the <strong>Bookings & Leads</strong> console.
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={configForm.counsellingNotificationEmail || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfigForm({ ...configForm, counsellingNotificationEmail: val });
                        updateSiteConfig({ ...siteConfig, counsellingNotificationEmail: val });
                      }}
                      placeholder="swati.soam@primipassi.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow hover:bg-[#C2410C] transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#C5A059]" /> Save Site Configuration
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: PDF DOCUMENTS MANAGEMENT */}
        {activeAdminTab === 'pdfs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search PDF title, category, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingPdf({
                    title: '',
                    category: 'Brochure',
                    description: '',
                    universityName: 'All Partner Universities',
                    fileSize: '2.1 MB',
                    uploadDate: new Date().toISOString().split('T')[0],
                    fileUrl: ''
                  });
                  setIsNewPdf(true);
                }}
                className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow hover:bg-[#C2410C] transition-all flex items-center gap-2 shrink-0"
              >
                <FileUp className="w-4 h-4 text-[#C5A059]" /> Upload New PDF Prospectus
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfDocuments
                .filter(pdf => 
                  pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  pdf.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (pdf.description && pdf.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((pdf) => (
                  <div key={pdf.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-[#EA580C] text-[10px] font-bold rounded-full uppercase border border-blue-100">
                          {pdf.category}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {pdf.fileSize} • {pdf.uploadDate}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 pt-1">
                        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">{pdf.title}</h4>
                          {pdf.universityName && (
                            <p className="text-xs text-[#EA580C] font-semibold mt-0.5">{pdf.universityName}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 pt-1">{pdf.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingPdf(pdf)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <a
                          href={pdf.fileUrl && pdf.fileUrl !== '#' ? pdf.fileUrl : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#EA580C] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingPdf({ ...pdf });
                            setIsNewPdf(false);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${pdf.title}"?`)) {
                              deletePdfDocument(pdf.id);
                              showNotify('PDF document deleted');
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: UNIVERSITIES MANAGEMENT */}
        {activeAdminTab === 'universities' && (
          <div className="space-y-4">
            {/* Header, Search & Add College */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search college by name, country, city, location, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminUniGroupByCountry(!adminUniGroupByCountry)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${
                    adminUniGroupByCountry
                      ? 'bg-orange-50 text-[#EA580C] border-orange-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Toggle Group by Country Category view"
                >
                  {adminUniGroupByCountry ? '✓ Grouped by Country' : 'Flat Table View'}
                </button>

                <button
                  onClick={() => {
                    setEditingUni({
                      countryCode: 'india',
                      country: 'India',
                      countryCategory: 'domestic',
                      degreesOffered: ['Bachelor', 'Master', 'PhD'],
                      popularCourses: ['Computer Science & AI', 'Electronics & Robotics', 'Management & MBA'],
                      undergradFeesDisplay: '₹4.8 Lakhs / yr',
                      mastersFeesDisplay: '₹5.2 Lakhs / yr',
                      scholarshipsMaxPct: 40,
                      acceptanceRate: 75,
                      placementRate: 94,
                      avgStartingSalaryDisplay: '₹14 LPA Median'
                    });
                    setIsNewUni(true);
                  }}
                  className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 hover:bg-[#C2410C] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New College
                </button>
              </div>
            </div>

            {/* Country Category & Country Quick Filter Tabs */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category Scope:</span>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200">
                    <button
                      onClick={() => setAdminUniCategoryFilter('all')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        adminUniCategoryFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({universities.length})
                    </button>
                    <button
                      onClick={() => setAdminUniCategoryFilter('domestic')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        adminUniCategoryFilter === 'domestic'
                          ? 'bg-[#EA580C] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🇮🇳 Domestic ({universities.filter(u => u.countryCategory === 'domestic' || u.countryCode === 'india').length})
                    </button>
                    <button
                      onClick={() => setAdminUniCategoryFilter('overseas')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        adminUniCategoryFilter === 'overseas'
                          ? 'bg-[#EA580C] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🌐 Overseas ({universities.filter(u => u.countryCategory === 'overseas' || (u.countryCode && u.countryCode !== 'india')).length})
                    </button>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  Select a country tab below to filter or manage institutions for that specific country
                </span>
              </div>

              {/* Country Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                <button
                  onClick={() => setAdminUniCountryFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    adminUniCountryFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Countries ({universities.length})
                </button>
                {countries.map((c) => {
                  const count = universities.filter(u => u.countryCode === c.id || u.country.toLowerCase().includes(c.name.toLowerCase())).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setAdminUniCountryFilter(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                        adminUniCountryFilter === c.id
                          ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        adminUniCountryFilter === c.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* University Table or Grouped View */}
            {(() => {
              const filteredList = universities.filter((u) => {
                const matchesSearch =
                  !searchTerm ||
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (u.city && u.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (u.popularCourses && u.popularCourses.some(pc => pc.toLowerCase().includes(searchTerm.toLowerCase())));

                const matchesCountry =
                  adminUniCountryFilter === 'all' ||
                  u.countryCode === adminUniCountryFilter ||
                  u.country.toLowerCase().includes((countries.find(c => c.id === adminUniCountryFilter)?.name || '').toLowerCase());

                const matchesCategory =
                  adminUniCategoryFilter === 'all' ||
                  (adminUniCategoryFilter === 'domestic' && (u.countryCategory === 'domestic' || u.countryCode === 'india')) ||
                  (adminUniCategoryFilter === 'overseas' && (u.countryCategory === 'overseas' || (u.countryCode && u.countryCode !== 'india')));

                return matchesSearch && matchesCountry && matchesCategory;
              });

              if (filteredList.length === 0) {
                return (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">No Colleges Found in This Filter</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      There are no colleges matching your search query or selected country category. Click below to add one or reset filters.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          setAdminUniCountryFilter('all');
                          setAdminUniCategoryFilter('all');
                          setSearchTerm('');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        Reset Filters
                      </button>
                      <button
                        onClick={() => {
                          setEditingUni({
                            countryCode: adminUniCountryFilter !== 'all' ? adminUniCountryFilter : 'india',
                            country: countries.find(c => c.id === adminUniCountryFilter)?.name || 'India',
                            countryCategory: adminUniCountryFilter === 'india' ? 'domestic' : 'overseas'
                          });
                          setIsNewUni(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        + Add College For {countries.find(c => c.id === adminUniCountryFilter)?.name || 'Country'}
                      </button>
                    </div>
                  </div>
                );
              }

              // Grouped by Country View
              if (adminUniGroupByCountry && adminUniCountryFilter === 'all') {
                // Group colleges by country
                const groupedMap = new Map<string, { country: any; list: University[] }>();
                
                countries.forEach(c => {
                  groupedMap.set(c.id, { country: c, list: [] });
                });

                filteredList.forEach(u => {
                  const cId = u.countryCode || (u.country.toLowerCase().includes('india') ? 'india' : 'dubai');
                  if (!groupedMap.has(cId)) {
                    const fallbackCountry = countries.find(c => c.id === cId) || {
                      id: cId,
                      name: u.country,
                      flag: '🌐',
                      category: u.countryCategory || 'overseas'
                    };
                    groupedMap.set(cId, { country: fallbackCountry, list: [] });
                  }
                  groupedMap.get(cId)!.list.push(u);
                });

                return (
                  <div className="space-y-6">
                    {Array.from(groupedMap.entries())
                      .filter(([_, data]) => data.list.length > 0)
                      .map(([countryId, { country, list }]) => (
                        <div key={countryId} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                          {/* Country Group Header */}
                          <div className="bg-gradient-to-r from-slate-50 to-orange-50/40 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{country.flag}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-sm text-slate-900">{country.name}</h3>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                    country.category === 'domestic'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}>
                                    {country.category === 'domestic' ? 'Domestic' : 'Overseas'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500">{country.highlight || `${list.length} Partner Institutions`}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-700">
                                {list.length} {list.length === 1 ? 'College' : 'Colleges'}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingUni({
                                    countryCode: country.id as CountryCode,
                                    country: country.name,
                                    countryCategory: country.category || (country.id === 'india' ? 'domestic' : 'overseas'),
                                    location: `${country.name} Campus`
                                  });
                                  setIsNewUni(true);
                                }}
                                className="px-2.5 py-1 bg-[#EA580C] hover:bg-[#C2410C] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add College in {country.name}
                              </button>
                            </div>
                          </div>

                          {/* Country Universities Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                  <th className="p-3.5 pl-5">College / Institution</th>
                                  <th className="p-3.5">City & Ranking</th>
                                  <th className="p-3.5">Tuition & Grant</th>
                                  <th className="p-3.5">Brochure PDF</th>
                                  <th className="p-3.5 pr-5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {list.map((uni) => (
                                  <tr key={uni.id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="p-3.5 pl-5">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'}
                                          alt={uni.name}
                                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div>
                                          <h4 className="font-bold text-slate-900 leading-snug">{uni.name}</h4>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="px-1.5 py-0.2 bg-orange-50 text-[#EA580C] text-[10px] font-bold rounded border border-orange-100">
                                              {uni.shortName}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                              {uni.campusType || 'Accredited Campus'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3.5">
                                      <p className="font-bold text-slate-800">{uni.rankingGlobal || uni.rankingNational || 'Top Rated'}</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5">{uni.city || uni.location}</p>
                                    </td>
                                    <td className="p-3.5">
                                      <p className="font-bold text-slate-900">{uni.mastersFeesDisplay || uni.undergradFeesDisplay || `AED ${uni.undergradFeesAED?.toLocaleString()}/yr`}</p>
                                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                        {uni.scholarshipsMaxPct === 100 ? '100% Grant / DSU' : `Up to ${uni.scholarshipsMaxPct}% Scholarship`}
                                      </p>
                                    </td>
                                    <td className="p-3.5">
                                      {uni.brochureUrl ? (
                                        <div className="flex items-center gap-1.5">
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-[11px] font-bold rounded-lg border border-red-100">
                                            <FileText className="w-3 h-3 text-red-600" /> PDF Ready
                                          </span>
                                          <button
                                            onClick={() => setViewingPdf({
                                              id: uni.id,
                                              title: `${uni.name} Prospectus`,
                                              category: 'Brochure',
                                              fileSize: 'Official PDF',
                                              uploadDate: 'Verified',
                                              fileUrl: uni.brochureUrl!,
                                              description: `Official campus catalog & program brochure for ${uni.name}.`
                                            })}
                                            className="p-1 text-slate-500 hover:text-[#EA580C] hover:bg-slate-100 rounded-lg transition-colors"
                                            title="Preview Brochure PDF"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setEditingUni({ ...uni });
                                            setIsNewUni(false);
                                          }}
                                          className="text-[11px] text-amber-700 font-bold hover:underline"
                                        >
                                          + Add PDF
                                        </button>
                                      )}
                                    </td>
                                    <td className="p-3.5 pr-5 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() => {
                                            setEditingUni({ ...uni });
                                            setIsNewUni(false);
                                          }}
                                          className="p-1.5 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-[#EA580C] rounded-lg transition-colors"
                                          title="Edit College Details"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${uni.name}?`)) {
                                              deleteUniversity(uni.id);
                                              showNotify(`Deleted ${uni.name}`);
                                            }
                                          }}
                                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                          title="Delete College"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              }

              // Standard Unified Table View
              return (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-4">College / University</th>
                          <th className="p-4">Country & Category</th>
                          <th className="p-4">Location & Ranking</th>
                          <th className="p-4">Tuition & Grant</th>
                          <th className="p-4">Brochure PDF</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredList.map((uni) => (
                          <tr key={uni.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'}
                                  alt={uni.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <h4 className="font-bold text-slate-900 leading-snug">{uni.name}</h4>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="px-1.5 py-0.5 bg-blue-50 text-[#EA580C] text-[10px] font-bold rounded">
                                      {uni.shortName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      {uni.campusType}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">{getCountryFlag(uni.countryCode)}</span>
                                <div>
                                  <p className="font-bold text-slate-800">{uni.country}</p>
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                                    uni.countryCategory === 'domestic' || uni.countryCode === 'india'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {uni.countryCategory === 'domestic' || uni.countryCode === 'india' ? 'Domestic' : 'Overseas'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-700">{uni.rankingGlobal || uni.rankingNational || 'Top Rated'}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{uni.city || uni.location}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-800">{uni.mastersFeesDisplay || uni.undergradFeesDisplay || `AED ${uni.undergradFeesAED?.toLocaleString()}/yr`}</p>
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-100">
                                {uni.scholarshipsMaxPct === 100 ? '100% DSU / Grant' : `Up to ${uni.scholarshipsMaxPct}%`}
                              </span>
                            </td>
                            <td className="p-4">
                              {uni.brochureUrl ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-[11px] font-bold rounded-lg border border-red-100">
                                    <FileText className="w-3 h-3 text-red-600" /> PDF Ready
                                  </span>
                                  <button
                                    onClick={() => setViewingPdf({
                                      id: uni.id,
                                      title: `${uni.name} Prospectus`,
                                      category: 'Brochure',
                                      fileSize: 'Official PDF',
                                      uploadDate: 'Verified',
                                      fileUrl: uni.brochureUrl!,
                                      description: `Official campus catalog & program brochure for ${uni.name}.`
                                    })}
                                    className="p-1 text-slate-500 hover:text-[#EA580C] hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Preview Brochure PDF"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingUni({ ...uni });
                                    setIsNewUni(false);
                                  }}
                                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold rounded-lg inline-flex items-center gap-1 transition-colors"
                                >
                                  <FileUp className="w-3 h-3 text-amber-600" /> + Add Brochure PDF
                                </button>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingUni({ ...uni });
                                    setIsNewUni(false);
                                  }}
                                  className="p-1.5 bg-blue-50 text-[#EA580C] hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit College Details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${uni.name}?`)) {
                                      deleteUniversity(uni.id);
                                      showNotify(`Deleted ${uni.name}`);
                                    }
                                  }}
                                  className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete College"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 4: COURSES MANAGEMENT */}
        {activeAdminTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-bold text-[#EA580C]">Manage Popular Course Directories</h2>
              <button
                onClick={() => {
                  setEditingCourse({});
                  setIsNewCourse(true);
                }}
                className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Add Course Category
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#EA580C]">{c.title}</h3>
                    <p className="text-xs text-emerald-600 font-bold">Avg Starting Salary: AED {c.avgSalaryAED.toLocaleString()}/mo</p>
                    <p className="text-[11px] text-slate-500">Duration: {c.duration} • Careers: {c.topCareers.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCourse({ ...c });
                        setIsNewCourse(false);
                      }}
                      className="p-1.5 bg-blue-50 text-[#EA580C] rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${c.title}?`)) deleteCourse(c.id);
                      }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SCHOLARSHIPS MANAGEMENT */}
        {activeAdminTab === 'scholarships' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 gap-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#EA580C]" />
                  <h2 className="text-base font-bold text-[#1A202C]">Manage Scholarships & Grant Allowances</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Add, edit, feature or delete government grants, DSU stipends, university fee waivers, and merit scholarships.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingScholarship({
                      name: '',
                      university: '',
                      amount: '',
                      discountPct: 50,
                      eligibility: '',
                      minGPAOrPct: '70%+',
                      deadline: 'Rolling Admissions',
                      category: 'Merit',
                      countryCode: undefined,
                      featured: false,
                      description: ''
                    });
                    setIsNewScholarship(true);
                  }}
                  className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Scholarship Grant
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by scholarship title, university or country..."
                    value={scholarshipSearchTerm}
                    onChange={(e) => setScholarshipSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <select
                    value={scholarshipCategoryFilter}
                    onChange={(e) => setScholarshipCategoryFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="all">All Scholarship Types</option>
                    <option value="Government / Regional">Government / Regional Grant</option>
                    <option value="Merit">Merit-Based</option>
                    <option value="Need-based">Need-based</option>
                    <option value="Early Bird">Early Bird Waiver</option>
                    <option value="Women in Tech">Women in Tech</option>
                    <option value="Sports">Sports Fellowship</option>
                  </select>
                </div>

                <div>
                  <select
                    value={scholarshipCountryFilter}
                    onChange={(e) => setScholarshipCountryFilter(e.target.value as CountryCode | 'all')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="all">All Country Scopes (Global)</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span>
                  Showing {scholarships.filter((s) => {
                    const q = scholarshipSearchTerm.toLowerCase();
                    const matchesSearch = !scholarshipSearchTerm || s.name.toLowerCase().includes(q) || s.university.toLowerCase().includes(q) || (s.country && s.country.toLowerCase().includes(q));
                    const matchesCat = scholarshipCategoryFilter === 'all' || s.category === scholarshipCategoryFilter;
                    const matchesCountry = scholarshipCountryFilter === 'all' || s.countryCode === scholarshipCountryFilter;
                    return matchesSearch && matchesCat && matchesCountry;
                  }).length} of {scholarships.length} Scholarship Grants
                </span>

                {(scholarshipSearchTerm || scholarshipCategoryFilter !== 'all' || scholarshipCountryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setScholarshipSearchTerm('');
                      setScholarshipCategoryFilter('all');
                      setScholarshipCountryFilter('all');
                    }}
                    className="text-[#EA580C] font-semibold hover:underline text-xs"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Scholarships List */}
            {(() => {
              const filteredScholarships = scholarships.filter((s) => {
                const q = scholarshipSearchTerm.toLowerCase();
                const matchesSearch = !scholarshipSearchTerm || s.name.toLowerCase().includes(q) || s.university.toLowerCase().includes(q) || (s.country && s.country.toLowerCase().includes(q));
                const matchesCat = scholarshipCategoryFilter === 'all' || s.category === scholarshipCategoryFilter;
                const matchesCountry = scholarshipCountryFilter === 'all' || s.countryCode === scholarshipCountryFilter;
                return matchesSearch && matchesCat && matchesCountry;
              });

              if (filteredScholarships.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-700 text-sm">No Scholarships Found</h3>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or click below to add a new scholarship grant.</p>
                    <button
                      onClick={() => {
                        setEditingScholarship({
                          name: '',
                          university: '',
                          amount: '',
                          discountPct: 50,
                          eligibility: '',
                          minGPAOrPct: '70%+',
                          deadline: 'Rolling Admissions',
                          category: 'Merit',
                          countryCode: undefined,
                          featured: false,
                          description: ''
                        });
                        setIsNewScholarship(true);
                      }}
                      className="mt-4 px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Scholarship Grant
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredScholarships.map((s, idx) => {
                    const countryObj = s.countryCode ? countries.find(c => c.id === s.countryCode) : null;

                    return (
                      <div
                        key={s.id || idx}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-200 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                      >
                        {s.featured && (
                          <div className="absolute top-0 right-0 bg-[#EA580C] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-bl-lg">
                            FEATURED
                          </div>
                        )}

                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200">
                              {s.category}
                            </span>
                            {countryObj ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                                <span>{countryObj.flag}</span>
                                <span>{countryObj.name}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 flex items-center gap-1">
                                <Globe className="w-3 h-3 text-slate-400" />
                                <span>{s.country || 'Global'}</span>
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {s.discountPct === 100 ? '100% Full Grant' : `Up to ${s.discountPct}% Waiver`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
                            <span>{s.university}</span>
                          </div>

                          <h3 className="font-bold text-sm text-[#1A202C] leading-snug">
                            {s.name}
                          </h3>

                          <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100/80">
                            <span className="text-[10px] uppercase font-bold text-orange-700 block">Grant Amount / Coverage</span>
                            <span className="text-xs font-extrabold text-[#EA580C]">{s.amount}</span>
                          </div>

                          <div className="space-y-1 text-xs text-slate-600">
                            <p><span className="font-semibold text-slate-800">Eligibility:</span> {s.eligibility}</p>
                            <p className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="w-3 h-3 text-[#EA580C]" /> Deadline: <span className="font-bold text-slate-700">{s.deadline}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setEditingScholarship({ ...s });
                              setIsNewScholarship(false);
                            }}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                            title="Edit this scholarship"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete this scholarship grant:\n"${s.name}"?`)) {
                                deleteScholarship(s.id);
                                showNotify('Scholarship deleted successfully');
                              }
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                            title="Delete this scholarship"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 6: FAQS MANAGEMENT */}
        {activeAdminTab === 'faqs' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 gap-4 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#EA580C]" />
                  <h2 className="text-base font-bold text-[#1A202C]">Manage Frequently Asked Questions</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Add, edit, re-categorize or delete questions and answers shown on the public FAQ section.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingFaq({
                      question: '',
                      answer: '',
                      category: 'Admissions',
                      countryCode: undefined
                    });
                    setIsNewFaq(true);
                  }}
                  className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add FAQ Question
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search question, keyword or answer..."
                    value={faqSearchTerm}
                    onChange={(e) => setFaqSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <select
                    value={faqCategoryFilter}
                    onChange={(e) => setFaqCategoryFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="all">All Categories</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Scholarships">Scholarships & Grants</option>
                    <option value="Work & Visas">Work & Visas</option>
                    <option value="Finance & Loans">Finance & Loans</option>
                    <option value="Accommodation">Accommodation & Living</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <select
                    value={faqCountryFilter}
                    onChange={(e) => setFaqCountryFilter(e.target.value as CountryCode | 'all')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="all">All Country Scopes (Global)</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span>
                  Showing {faqs.filter((f) => {
                    const matchesSearch = !faqSearchTerm || f.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) || f.answer.toLowerCase().includes(faqSearchTerm.toLowerCase());
                    const matchesCat = faqCategoryFilter === 'all' || f.category.toLowerCase() === faqCategoryFilter.toLowerCase();
                    const matchesCountry = faqCountryFilter === 'all' || f.countryCode === faqCountryFilter;
                    return matchesSearch && matchesCat && matchesCountry;
                  }).length} of {faqs.length} FAQ questions
                </span>

                {(faqSearchTerm || faqCategoryFilter !== 'all' || faqCountryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setFaqSearchTerm('');
                      setFaqCategoryFilter('all');
                      setFaqCountryFilter('all');
                    }}
                    className="text-[#EA580C] font-semibold hover:underline text-xs"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* FAQs List */}
            {(() => {
              const filteredFaqs = faqs.filter((f) => {
                const matchesSearch = !faqSearchTerm || f.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) || f.answer.toLowerCase().includes(faqSearchTerm.toLowerCase());
                const matchesCat = faqCategoryFilter === 'all' || f.category.toLowerCase() === faqCategoryFilter.toLowerCase();
                const matchesCountry = faqCountryFilter === 'all' || f.countryCode === faqCountryFilter;
                return matchesSearch && matchesCat && matchesCountry;
              });

              if (filteredFaqs.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-700 text-sm">No FAQ Questions Found</h3>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click below to add a new question.</p>
                    <button
                      onClick={() => {
                        setEditingFaq({
                          question: '',
                          answer: '',
                          category: 'Admissions',
                          countryCode: undefined
                        });
                        setIsNewFaq(true);
                      }}
                      className="mt-4 px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add FAQ Question
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {filteredFaqs.map((f, idx) => {
                    const countryObj = f.countryCode ? countries.find(c => c.id === f.countryCode) : null;

                    return (
                      <div key={f.id || idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-orange-200 transition-all flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200">
                              {f.category}
                            </span>
                            {countryObj ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                                <span>{countryObj.flag}</span>
                                <span>{countryObj.name}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 flex items-center gap-1">
                                <Globe className="w-3 h-3 text-slate-400" />
                                <span>All Destinations</span>
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm text-[#1A202C] leading-snug">
                            {f.question}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            {f.answer}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                          <button
                            onClick={() => {
                              setEditingFaq({ ...f });
                              setIsNewFaq(false);
                            }}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                            title="Edit this FAQ question"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete this FAQ question:\n"${f.question}"?`)) {
                                deleteFaq(f.id);
                                showNotify('FAQ deleted successfully');
                              }
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                            title="Delete this FAQ question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 7: TESTIMONIALS MANAGEMENT */}
        {activeAdminTab === 'testimonials' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-bold text-[#EA580C]">Manage Student Success Testimonials</h2>
              <button
                onClick={() => {
                  setEditingTestimonial({});
                  setIsNewTestimonial(true);
                }}
                className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Add Testimonial
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#EA580C]">{t.studentName} ({t.hometown})</h3>
                    <p className="text-xs text-slate-700 font-semibold">{t.university} • {t.course}</p>
                    <p className="text-xs text-emerald-600 font-bold">{t.currentRole} • {t.currentSalaryLPA}</p>
                    <p className="text-xs text-slate-500 italic">"{t.quote}"</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingTestimonial({ ...t });
                        setIsNewTestimonial(false);
                      }}
                      className="p-1.5 bg-blue-50 text-[#EA580C] rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete testimonial?`)) deleteTestimonial(t.id);
                      }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: LOANS MANAGEMENT */}
        {activeAdminTab === 'loans' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-bold text-[#EA580C]">Manage Education Loan Partner Banks</h2>
              <button
                onClick={() => {
                  setEditingLoan({});
                  setIsNewLoan(true);
                }}
                className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Add Loan Provider
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {loanProviders.map((lp) => (
                <div key={lp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#EA580C]">{lp.bankName}</h3>
                    <p className="text-xs font-bold text-emerald-600">Interest Rate: {lp.interestRate}</p>
                    <p className="text-[11px] text-slate-500">Max Sanction: ₹{(lp.maxAmountINR / 100000).toFixed(1)} Lakhs • Processing: {lp.processingTimeDays} Days</p>
                    <p className="text-[11px] text-slate-400">Collateral Required: {lp.collateralRequired ? 'Yes' : 'No Collateral'} • Moratorium: {lp.moratoriumPeriodYears} Yr</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingLoan({ ...lp });
                        setIsNewLoan(false);
                      }}
                      className="p-1.5 bg-blue-50 text-[#EA580C] rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Loan Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete loan provider ${lp.bankName}?`)) deleteLoanProvider(lp.id);
                      }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Loan Provider"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: HOUSING MANAGEMENT */}
        {activeAdminTab === 'accommodations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-bold text-[#EA580C]">Manage Student Accommodations & Housing</h2>
              <button
                onClick={() => {
                  setEditingAccommodation({});
                  setIsNewAccommodation(true);
                }}
                className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Add Housing Property
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {accommodations.map((acc) => (
                <div key={acc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{acc.type}</span>
                    <h3 className="font-bold text-sm text-[#EA580C]">{acc.name}</h3>
                    <p className="text-xs font-bold text-emerald-600">Rent: AED {acc.monthlyRentAED}/mo</p>
                    <p className="text-[11px] text-slate-500">{acc.location} • {acc.distanceKm} km from campus</p>
                    <p className="text-[11px] text-slate-400">Amenities: {acc.amenities.slice(0, 3).join(', ')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingAccommodation({ ...acc });
                        setIsNewAccommodation(false);
                      }}
                      className="p-1.5 bg-blue-50 text-[#EA580C] rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Housing Property"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete property ${acc.name}?`)) deleteAccommodation(acc.id);
                      }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Housing Property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: WEBINARS MANAGEMENT */}
        {activeAdminTab === 'webinars' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-bold text-[#EA580C]">Manage Live Webinars & Masterclasses</h2>
              <button
                onClick={() => {
                  setEditingWebinar({});
                  setIsNewWebinar(true);
                }}
                className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Schedule Webinar
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {webinars.map((w) => (
                <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#EA580C]">{w.title}</h3>
                    <p className="text-xs text-slate-700 font-semibold">{w.speaker} ({w.role})</p>
                    <p className="text-xs font-bold text-amber-600">{w.date} • {w.time}</p>
                    <p className="text-[11px] text-slate-500">Seats Left: {w.seatsLeft} • Tags: {w.tags.join(', ')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingWebinar({ ...w });
                        setIsNewWebinar(false);
                      }}
                      className="p-1.5 bg-blue-50 text-[#EA580C] rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Webinar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete webinar ${w.title}?`)) deleteWebinar(w.id);
                      }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Webinar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: BLOGS MANAGEMENT */}
        {activeAdminTab === 'blogs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
              <h2 className="text-sm font-bold text-[#EA580C]">Manage Articles & Blogs</h2>
              <button
                onClick={() => {
                  setEditingBlog({});
                  setIsNewBlog(true);
                }}
                className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#C5A059]" /> Create Blog Article
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {blogPosts.map((bp) => (
                <div key={bp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{bp.category}</span>
                    <h3 className="font-bold text-sm text-[#EA580C]">{bp.title}</h3>
                    <p className="text-xs text-slate-500">By {bp.author} • {bp.readTime}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{bp.snippet}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingBlog({ ...bp });
                        setIsNewBlog(false);
                      }}
                      className="p-1.5 bg-blue-50 text-[#EA580C] rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Article"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete article ${bp.title}?`)) deleteBlogPost(bp.id);
                      }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: EDIT UNIVERSITY */}
        {editingUni && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="font-bold text-lg text-[#EA580C]">{isNewUni ? 'Add New College / University' : 'Edit College Details & Brochure'}</h3>
                </div>
                <button onClick={() => setEditingUni(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUni} className="space-y-4">
                {/* COUNTRY & CATEGORY DESTINATION SELECTOR */}
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#EA580C] flex items-center gap-1.5 uppercase tracking-wider">
                      <Globe className="w-4 h-4 text-[#EA580C]" /> Destination Country & Category *
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Controls which country and tab this college appears under
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Country *</label>
                      <select
                        value={editingUni.countryCode || 'india'}
                        onChange={(e) => {
                          const code = e.target.value as CountryCode;
                          const countryObj = countries.find((c) => c.id === code);
                          const isDomestic = code === 'india';
                          setEditingUni({
                            ...editingUni,
                            countryCode: code,
                            country: countryObj ? countryObj.name : 'India',
                            countryCategory: isDomestic ? 'domestic' : 'overseas',
                            city: editingUni.city || (countryObj ? countryObj.name : ''),
                            location: editingUni.location || (countryObj ? `${countryObj.name} Campus` : 'Main Campus'),
                            undergradFeesDisplay: editingUni.undergradFeesDisplay || (isDomestic ? '₹4.8 Lakhs / yr' : code === 'italy' ? '€3,800 / yr (0€ with DSU)' : '€4,000 / yr'),
                            mastersFeesDisplay: editingUni.mastersFeesDisplay || (isDomestic ? '₹5.2 Lakhs / yr' : code === 'italy' ? '€3,900 / yr (0€ with DSU)' : '€4,500 / yr')
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                      >
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.flag} {c.name} ({c.category === 'domestic' ? 'Domestic' : 'Overseas'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Country Classification</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingUni({ ...editingUni, countryCategory: 'domestic' })}
                          className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                            editingUni.countryCategory === 'domestic' || (!editingUni.countryCategory && editingUni.countryCode === 'india')
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          🇮🇳 Domestic
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUni({ ...editingUni, countryCategory: 'overseas' })}
                          className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                            editingUni.countryCategory === 'overseas' || (!editingUni.countryCategory && editingUni.countryCode !== 'india')
                              ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          🌐 Overseas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">University Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Politecnico di Milano or University of Oxford"
                    value={editingUni.name || ''}
                    onChange={(e) => setEditingUni({ ...editingUni, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Short Name / Code</label>
                    <input
                      type="text"
                      placeholder="e.g. POLIMI"
                      value={editingUni.shortName || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, shortName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Milan, London, Munich"
                      value={editingUni.city || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Campus Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Piazza Leonardo da Vinci, Milan, Italy"
                      value={editingUni.location || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Global QS Ranking</label>
                    <input
                      type="text"
                      placeholder="e.g. #111 QS World Top 150"
                      value={editingUni.rankingGlobal || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, rankingGlobal: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">National / Country Ranking</label>
                    <input
                      type="text"
                      placeholder="e.g. #1 Technical University in Italy"
                      value={editingUni.rankingNational || editingUni.rankingUae || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, rankingNational: e.target.value, rankingUae: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Undergrad Tuition Display</label>
                    <input
                      type="text"
                      placeholder="e.g. €3,800 / yr (0€ with DSU) or ₹4.8 Lakhs / yr"
                      value={editingUni.undergradFeesDisplay || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, undergradFeesDisplay: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Masters Tuition Display</label>
                    <input
                      type="text"
                      placeholder="e.g. €3,900 / yr or ₹5.2 Lakhs / yr"
                      value={editingUni.mastersFeesDisplay || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, mastersFeesDisplay: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Max Scholarship %</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={editingUni.scholarshipsMaxPct ?? 50}
                      onChange={(e) => setEditingUni({ ...editingUni, scholarshipsMaxPct: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Acceptance Rate %</label>
                    <input
                      type="number"
                      placeholder="75"
                      value={editingUni.acceptanceRate ?? 75}
                      onChange={(e) => setEditingUni({ ...editingUni, acceptanceRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Placement Rate %</label>
                    <input
                      type="number"
                      placeholder="94"
                      value={editingUni.placementRate ?? 94}
                      onChange={(e) => setEditingUni({ ...editingUni, placementRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Overview Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description about the university campus, degrees, rankings, and international student facilities..."
                    value={editingUni.description || ''}
                    onChange={(e) => setEditingUni({ ...editingUni, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* BROCHURE PDF PROSPECTUS SECTION */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#EA580C] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#C5A059]" /> College Brochure / Prospectus PDF
                    </label>
                    {editingUni.brochureUrl && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ PDF Attached
                      </span>
                    )}
                  </div>

                  {editingUni.brochureUrl && (
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="truncate text-slate-700 font-semibold">
                          {editingUni.brochureUrl.startsWith('data:') ? 'Custom Uploaded PDF Document' : editingUni.brochureUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setViewingPdf({
                            id: 'preview',
                            title: `${editingUni.name || 'College'} Prospectus`,
                            category: 'Brochure',
                            fileSize: 'PDF',
                            uploadDate: 'Current',
                            fileUrl: editingUni.brochureUrl!,
                            description: `Official campus catalog & program brochure for ${editingUni.name}.`
                          })}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUni({ ...editingUni, brochureUrl: '' })}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-white border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-[#EA580C] transition-colors relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            setEditingUni({ ...editingUni, brochureUrl: result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileUp className="w-5 h-5 text-[#EA580C] mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-800">
                      {editingUni.brochureUrl ? 'Click or drop file to Replace Brochure PDF' : 'Upload College Prospectus (.pdf)'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF documents up to 25MB</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Or enter PDF Web Link:</label>
                    <input
                      type="text"
                      placeholder="https://example.com/university-prospectus.pdf"
                      value={editingUni.brochureUrl || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, brochureUrl: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Campus Image URL</label>
                    <input
                      type="text"
                      value={editingUni.image || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, image: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">University Logo URL</label>
                    <input
                      type="text"
                      value={editingUni.logo || ''}
                      onChange={(e) => setEditingUni({ ...editingUni, logo: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingUni(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" /> Save College Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / ADD SCHOLARSHIP */}
        {editingScholarship && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A202C]">
                      {isNewScholarship ? 'Add New Scholarship / Grant' : 'Edit Scholarship Grant'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Changes will be published immediately on the public Scholarship Grants section
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingScholarship(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveScholarship} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Scholarship Grant Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Italy DSU Regional Government Scholarship (100% Waiver + Cash Stipend)"
                    value={editingScholarship.name || ''}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Awarding University / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Politecnico di Milano & All Italian Public Universities"
                      value={editingScholarship.university || ''}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Country Scope / Destination *
                    </label>
                    <select
                      value={editingScholarship.countryCode || ''}
                      onChange={(e) => {
                        const val = e.target.value as CountryCode;
                        const countryObj = countries.find(c => c.id === val);
                        setEditingScholarship({
                          ...editingScholarship,
                          countryCode: val || undefined,
                          country: countryObj ? countryObj.name : 'Global'
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="">🌐 All Destinations (Global)</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.name} ({c.category === 'domestic' ? 'Domestic' : 'Overseas'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Grant Amount / Benefit Display *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 100% Tuition Waiver + Free Canteen + €7,500/yr Stipend"
                      value={editingScholarship.amount || ''}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, amount: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Waiver Pct (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="100"
                      value={editingScholarship.discountPct ?? 50}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, discountPct: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Category Type *
                    </label>
                    <select
                      value={editingScholarship.category || 'Merit'}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="Government / Regional">Government / Regional</option>
                      <option value="Merit">Merit</option>
                      <option value="Need-based">Need-based</option>
                      <option value="Early Bird">Early Bird</option>
                      <option value="Women in Tech">Women in Tech</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Application Deadline *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 31st August 2026 or Rolling"
                      value={editingScholarship.deadline || ''}
                      onChange={(e) => setEditingScholarship({ ...editingScholarship, deadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Eligibility Criteria *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Indian students with family income under €25,000/yr (ISEE Parificato) or 75%+ in 12th/Bachelor"
                    value={editingScholarship.eligibility || ''}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, eligibility: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#EA580C]" />
                    <div>
                      <span className="text-xs font-bold text-[#1A202C] block">Highlight as Top Recommendation</span>
                      <span className="text-[11px] text-slate-500">Show TOP RECOMMENDATION badge on public cards</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingScholarship.featured)}
                    onChange={(e) => setEditingScholarship({ ...editingScholarship, featured: e.target.checked })}
                    className="w-4 h-4 text-[#EA580C] rounded border-slate-300 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingScholarship(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isNewScholarship ? 'Publish Scholarship' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / ADD FAQ */}
        {editingFaq && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A202C]">
                      {isNewFaq ? 'Add New FAQ Question' : 'Edit FAQ Question'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Changes will be published immediately on the public FAQ section
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingFaq(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Can I get a full scholarship for European universities?"
                    value={editingFaq.question || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      FAQ Category *
                    </label>
                    <select
                      value={editingFaq.category || 'Admissions'}
                      onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="Admissions">Admissions</option>
                      <option value="Scholarships">Scholarships & Grants</option>
                      <option value="Work & Visas">Work & Visas</option>
                      <option value="Finance & Loans">Finance & Loans</option>
                      <option value="Accommodation">Accommodation & Living</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Country Scope
                    </label>
                    <select
                      value={editingFaq.countryCode || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingFaq({
                          ...editingFaq,
                          countryCode: val ? (val as CountryCode) : undefined
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="">🌐 All Destinations (Global)</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.name} ({c.category === 'domestic' ? 'Domestic' : 'Overseas'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Answer Details *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Markdown & line breaks supported
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide a comprehensive and helpful answer for prospective students and parents..."
                    value={editingFaq.answer || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal leading-relaxed focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isNewFaq ? 'Publish FAQ' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / ADD TESTIMONIAL */}
        {editingTestimonial && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A202C]">
                      {isNewTestimonial ? 'Add Student Review' : 'Edit Student Story'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Alumni review cards displayed on the public Success Stories section
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Mehta"
                      value={editingTestimonial.studentName || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Hometown / Indian City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmedabad, Gujarat"
                      value={editingTestimonial.hometown || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, hometown: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      University / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Politecnico di Milano"
                      value={editingTestimonial.university || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, university: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Course / Degree Program *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MSc Mechanical Engineering"
                      value={editingTestimonial.course || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, course: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Scholarship Received
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 100% DSU Regional Grant (€7,200/yr Stipend)"
                      value={editingTestimonial.scholarshipReceived || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, scholarshipReceived: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Current Placement / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aerodynamics Engineer at Ferrari Italy"
                      value={editingTestimonial.currentRole || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, currentRole: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Salary / Package Display
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹40 LPA (€44,000/yr)"
                      value={editingTestimonial.currentSalaryLPA || editingTestimonial.currentSalaryDisplay || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, currentSalaryLPA: e.target.value, currentSalaryDisplay: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Student Photo URL (Indian Student Portrait)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={editingTestimonial.avatar || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {editingTestimonial.avatar && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <img
                      src={editingTestimonial.avatar}
                      alt="Student Preview"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-orange-300 shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs text-slate-600">
                      <p className="font-bold text-slate-900">Active Avatar Preview</p>
                      <p className="text-[11px] text-slate-400">Authentic Indian student portrait</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Student Quote / Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="PrimiPassi handled my entire application, scholarship evaluation, and visa filing..."
                    value={editingTestimonial.quote || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal leading-relaxed focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isNewTestimonial ? 'Publish Student Story' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / UPLOAD PDF */}
        {editingPdf && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="font-bold text-lg text-[#EA580C]">{isNewPdf ? 'Upload PDF Prospectus' : 'Edit PDF Document'}</h3>
                </div>
                <button onClick={() => setEditingPdf(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePdf} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heriot-Watt Dubai Admission Catalog 2026"
                    value={editingPdf.title || ''}
                    onChange={(e) => setEditingPdf({ ...editingPdf, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={editingPdf.category || 'Brochure'}
                      onChange={(e) => setEditingPdf({ ...editingPdf, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="Brochure">Brochure</option>
                      <option value="Fee Structure">Fee Structure</option>
                      <option value="Visa Guide">Visa Guide</option>
                      <option value="Scholarship Form">Scholarship Form</option>
                      <option value="Admission Guide">Admission Guide</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">University / Scope</label>
                    <input
                      type="text"
                      placeholder="e.g. University of Birmingham"
                      value={editingPdf.universityName || ''}
                      onChange={(e) => setEditingPdf({ ...editingPdf, universityName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of what students will find in this PDF..."
                    value={editingPdf.description || ''}
                    onChange={(e) => setEditingPdf({ ...editingPdf, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select PDF File (.pdf)</label>
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-[#EA580C] transition-colors relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            setEditingPdf(prev => ({
                              ...prev,
                              fileUrl: result,
                              fileSize: sizeMB,
                              title: prev?.title || file.name.replace('.pdf', '')
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileUp className="w-6 h-6 text-[#EA580C] mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-800">
                      {editingPdf.fileSize ? `Selected file: (${editingPdf.fileSize})` : 'Click to select or drop a PDF file'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports standard .pdf documents up to 25MB</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingPdf(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" /> Save PDF Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: VIEW PDF PREVIEW */}
        {viewingPdf && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white max-w-3xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{viewingPdf.title}</h3>
                    <p className="text-xs text-slate-500">{viewingPdf.category} • {viewingPdf.fileSize}</p>
                  </div>
                </div>
                <button onClick={() => setViewingPdf(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center min-h-[350px]">
                <FileText className="w-16 h-16 text-slate-400 mb-3" />
                <h4 className="text-sm font-bold text-slate-800 text-center max-w-md">{viewingPdf.title}</h4>
                <p className="text-xs text-slate-500 text-center max-w-md mt-1 mb-4">{viewingPdf.description}</p>
                <a
                  href={viewingPdf.fileUrl && viewingPdf.fileUrl !== '#' ? viewingPdf.fileUrl : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-[#C5A059]" /> Open PDF Full Window
                </a>
              </div>

              <div className="pt-2 flex justify-end shrink-0">
                <button onClick={() => setViewingPdf(null)} className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT LOAN PROVIDER */}
        {editingLoan && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="font-bold text-lg text-[#EA580C]">{isNewLoan ? 'Add Loan Provider' : 'Edit Loan Provider'}</h3>
                </div>
                <button onClick={() => setEditingLoan(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLoan} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bank / Institution Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Credila Education Loans"
                    value={editingLoan.bankName || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Interest Rate Display</label>
                    <input
                      type="text"
                      placeholder="e.g. 8.55% - 10.25% p.a."
                      value={editingLoan.interestRate || ''}
                      onChange={(e) => setEditingLoan({ ...editingLoan, interestRate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Max Sanction (INR)</label>
                    <input
                      type="number"
                      placeholder="7500000"
                      value={editingLoan.maxAmountINR || 5000000}
                      onChange={(e) => setEditingLoan({ ...editingLoan, maxAmountINR: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Processing Time (Days)</label>
                    <input
                      type="number"
                      value={editingLoan.processingTimeDays || 7}
                      onChange={(e) => setEditingLoan({ ...editingLoan, processingTimeDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Moratorium Period (Years)</label>
                    <input
                      type="number"
                      value={editingLoan.moratoriumPeriodYears || 1}
                      onChange={(e) => setEditingLoan({ ...editingLoan, moratoriumPeriodYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Collateral Required?</label>
                  <select
                    value={editingLoan.collateralRequired ? 'yes' : 'no'}
                    onChange={(e) => setEditingLoan({ ...editingLoan, collateralRequired: e.target.value === 'yes' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="no">No Collateral Required (Non-collateral)</option>
                    <option value="yes">Collateral Required</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Features (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Pre-visa disbursal, 100% tuition coverage, Flexible EMI"
                    value={Array.isArray(editingLoan.features) ? editingLoan.features.join(', ') : editingLoan.features || ''}
                    onChange={(e) => setEditingLoan({ ...editingLoan, features: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingLoan(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" /> Save Loan Provider
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT ACCOMMODATION */}
        {editingAccommodation && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="font-bold text-lg text-[#EA580C]">{isNewAccommodation ? 'Add Student Housing' : 'Edit Housing Details'}</h3>
                </div>
                <button onClick={() => setEditingAccommodation(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAccommodation} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Residence Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uninest Student Residence Dubai"
                    value={editingAccommodation.name || ''}
                    onChange={(e) => setEditingAccommodation({ ...editingAccommodation, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Property Type</label>
                    <select
                      value={editingAccommodation.type || 'Hostel'}
                      onChange={(e) => setEditingAccommodation({ ...editingAccommodation, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="Hostel">Hostel</option>
                      <option value="Co-Living">Co-Living</option>
                      <option value="Private Apartment">Private Apartment</option>
                      <option value="PG">PG</option>
                      <option value="Student Residence">Student Residence</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Monthly Rent (AED)</label>
                    <input
                      type="number"
                      value={editingAccommodation.monthlyRentAED || 2500}
                      onChange={(e) => setEditingAccommodation({ ...editingAccommodation, monthlyRentAED: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Location Zone</label>
                    <input
                      type="text"
                      placeholder="Dubai Academic City"
                      value={editingAccommodation.location || ''}
                      onChange={(e) => setEditingAccommodation({ ...editingAccommodation, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Distance to Campus (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingAccommodation.distanceKm || 1.2}
                      onChange={(e) => setEditingAccommodation({ ...editingAccommodation, distanceKm: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Amenities (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Gym, High-Speed WiFi, Shuttle Bus, All Bills Included"
                    value={Array.isArray(editingAccommodation.amenities) ? editingAccommodation.amenities.join(', ') : editingAccommodation.amenities || ''}
                    onChange={(e) => setEditingAccommodation({ ...editingAccommodation, amenities: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingAccommodation(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" /> Save Residence
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT WEBINAR */}
        {editingWebinar && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="font-bold text-lg text-[#EA580C]">{isNewWebinar ? 'Schedule Live Webinar' : 'Edit Webinar Details'}</h3>
                </div>
                <button onClick={() => setEditingWebinar(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWebinar} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Webinar Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to Secure 100% Dubai University Scholarships"
                    value={editingWebinar.title || ''}
                    onChange={(e) => setEditingWebinar({ ...editingWebinar, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Speaker Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Rajesh Sharma"
                      value={editingWebinar.speaker || ''}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, speaker: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Speaker Role / Designation</label>
                    <input
                      type="text"
                      placeholder="Former Dean & Admissions Director"
                      value={editingWebinar.role || ''}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Date String</label>
                    <input
                      type="text"
                      placeholder="Aug 25, 2026"
                      value={editingWebinar.date || ''}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Time String</label>
                    <input
                      type="text"
                      placeholder="6:00 PM IST"
                      value={editingWebinar.time || ''}
                      onChange={(e) => setEditingWebinar({ ...editingWebinar, time: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingWebinar(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" /> Save Webinar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT BLOG POST */}
        {editingBlog && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#EA580C]" />
                  <h3 className="font-bold text-lg text-[#EA580C]">{isNewBlog ? 'Create Blog Article' : 'Edit Blog Article'}</h3>
                </div>
                <button onClick={() => setEditingBlog(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Guide to 10-Year UAE Golden Visas for Students"
                    value={editingBlog.title || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="Visas & Stay"
                      value={editingBlog.category || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Author Name</label>
                    <input
                      type="text"
                      placeholder="PrimiPassi Editorial Team"
                      value={editingBlog.author || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Short Snippet / Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Brief summary displayed in article cards..."
                    value={editingBlog.snippet || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, snippet: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" /> Save Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / ADD STUDY DESTINATION COUNTRY */}
        {editingCountry && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-3xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {isNewCountry ? 'Add New Study Destination' : `Edit Destination: ${editingCountry.name}`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Changes here propagate globally across navbar links, filter matrices, lead forms, and footer portals.
                    </p>
                  </div>
                </div>
                <button onClick={() => setEditingCountry(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCountry} className="space-y-4">
                {/* Basic Identity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Country Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Germany"
                      value={editingCountry.name || ''}
                      onChange={(e) => {
                        const nameVal = e.target.value;
                        const autoSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingCountry({
                          ...editingCountry,
                          name: nameVal,
                          id: isNewCountry ? autoSlug : (editingCountry.id || autoSlug)
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">ISO / Country Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DE, SG, US, UK"
                      value={editingCountry.code || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Flag Emoji *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🇩🇪, 🇸🇬, 🇨🇦"
                      value={editingCountry.flag || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, flag: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Slug and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Destination ID (URL Slug) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. germany, singapore, uk"
                      value={editingCountry.id || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-[#EA580C]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Unique identifier used for links & filters</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={editingCountry.category || 'overseas'}
                      onChange={(e) => setEditingCountry({ ...editingCountry, category: e.target.value as CountryCategory })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="overseas">Overseas Destination (Global Study Abroad)</option>
                      <option value="domestic">Domestic Admissions (Direct Indian Colleges)</option>
                    </select>
                  </div>
                </div>

                {/* Country Visibility Toggle Field in Modal */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${editingCountry.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <p className="text-xs font-bold text-slate-900">
                        Public Website Visibility: <span className={editingCountry.isActive !== false ? 'text-emerald-600' : 'text-rose-600'}>{editingCountry.isActive !== false ? 'ON (Visible to Public)' : 'OFF (Hidden from Public)'}</span>
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      When turned OFF, this destination, its colleges, courses, and scholarships are hidden from all website visitors.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={editingCountry.isActive !== false}
                    onClick={() => setEditingCountry({ ...editingCountry, isActive: editingCountry.isActive === false ? true : false })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2 ${
                      editingCountry.isActive !== false ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className="sr-only">Toggle country visibility</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        editingCountry.isActive !== false ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Tagline & Overview */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tagline / Catchphrase</label>
                  <input
                    type="text"
                    placeholder="e.g. Europe's Top Tech & Engineering Hub with Free Tuition"
                    value={editingCountry.tagline || ''}
                    onChange={(e) => setEditingCountry({ ...editingCountry, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hero Description / Overview</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed introduction of studying in this destination..."
                    value={editingCountry.heroDescription || ''}
                    onChange={(e) => setEditingCountry({ ...editingCountry, heroDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingCountry.coverImage || ''}
                    onChange={(e) => setEditingCountry({ ...editingCountry, coverImage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                  {editingCountry.coverImage && (
                    <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200">
                      <img src={editingCountry.coverImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Financials and Visa Rights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Avg Tuition Fee Display</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹8L – ₹22L / yr or €0 – €3,000 / yr"
                      value={editingCountry.avgTuitionDisplay || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, avgTuitionDisplay: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Avg Living Cost Display</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹50,000 – ₹90,000 / mo"
                      value={editingCountry.avgLivingCostDisplay || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, avgLivingCostDisplay: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Post-Study Work Visa Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 18 Months Job Seeking Visa / 2-3 Years PSW"
                      value={editingCountry.postStudyWorkVisa || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, postStudyWorkVisa: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Student Work Rights (During Studies)</label>
                    <input
                      type="text"
                      placeholder="e.g. 20 hrs/week during term, 40 hrs in vacations"
                      value={editingCountry.workRights || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, workRights: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Counts & Intakes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Universities Count Label</label>
                    <input
                      type="text"
                      placeholder="e.g. 20+ Partner Colleges"
                      value={editingCountry.universitiesCount || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, universitiesCount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Programs Count Label</label>
                    <input
                      type="text"
                      placeholder="e.g. 150+ Programs"
                      value={editingCountry.coursesCount || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, coursesCount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Top Intakes (comma separated)</label>
                    <input
                      type="text"
                      placeholder="September, January, May"
                      value={Array.isArray(editingCountry.topIntakes) ? editingCountry.topIntakes.join(', ') : (editingCountry.topIntakes || '')}
                      onChange={(e) => setEditingCountry({ ...editingCountry, topIntakes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Popular Degrees & Popular Cities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Popular Degrees (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Computer Science, MBA, Data Analytics, Engineering"
                      value={Array.isArray(editingCountry.popularDegrees) ? editingCountry.popularDegrees.join(', ') : (editingCountry.popularDegrees || '')}
                      onChange={(e) => setEditingCountry({ ...editingCountry, popularDegrees: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Popular Cities (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Munich, Berlin, Frankfurt, Hamburg"
                      value={Array.isArray(editingCountry.popularCities) ? editingCountry.popularCities.join(', ') : (editingCountry.popularCities || '')}
                      onChange={(e) => setEditingCountry({ ...editingCountry, popularCities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Tests & Scholarships */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Test Requirements</label>
                    <input
                      type="text"
                      placeholder="e.g. IELTS 6.5 / TOEFL 90+ / Medium of Instruction Waiver"
                      value={editingCountry.testRequirements || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, testRequirements: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Scholarship & Grants Highlight</label>
                    <input
                      type="text"
                      placeholder="e.g. Up to 100% Tuition Waivers & Merit Bursaries"
                      value={editingCountry.scholarshipHighlight || ''}
                      onChange={(e) => setEditingCountry({ ...editingCountry, scholarshipHighlight: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {/* Key Highlights (one per line) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Key Highlights (one point per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Internationally ranked institutions&#10;Direct admission with scholarship evaluation&#10;Post-study career pathway"
                    value={Array.isArray(editingCountry.keyHighlights) ? editingCountry.keyHighlights.join('\n') : (editingCountry.keyHighlights || '')}
                    onChange={(e) => setEditingCountry({ ...editingCountry, keyHighlights: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCountry(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4 text-[#C5A059]" />
                    {isNewCountry ? 'Save & Add Destination' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
