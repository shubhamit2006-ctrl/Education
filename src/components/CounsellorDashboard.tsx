import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  PhoneCall,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  GraduationCap,
  Award,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  X,
  FileSpreadsheet,
  Check,
  AlertCircle,
  MapPin
} from 'lucide-react';
import {
  StudentLead,
  generate1000StudentLeads,
  exportLeadsToCSV
} from '../data/leadsData';

export const CounsellorDashboard: React.FC = () => {
  // Initialize from LocalStorage or generate 1000 leads
  const [leads, setLeads] = useState<StudentLead[]>(() => {
    const saved = localStorage.getItem('primipassi_counsellor_leads_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }
    return generate1000StudentLeads();
  });

  // Save to localStorage whenever leads change
  useEffect(() => {
    try {
      localStorage.setItem('primipassi_counsellor_leads_v2', JSON.stringify(leads));
    } catch (e) {
      console.warn('LocalStorage limit exceeded or storage unavailable', e);
    }
  }, [leads]);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [universityFilter, setUniversityFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [minAiScore, setMinAiScore] = useState<number>(0);
  
  // Sorting State
  const [sortField, setSortField] = useState<'studentName' | 'aiScore' | 'createdAt' | 'percentage'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Selection State for Bulk Actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // Modal / Drawer State
  const [selectedLead, setSelectedLead] = useState<StudentLead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState<Partial<StudentLead>>({
    studentName: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    percentage: '85% (12th CBSE)',
    targetUniversity: 'University of Birmingham Dubai',
    preferredCourse: 'MSc Computer Science & Artificial Intelligence',
    budgetLakhs: '₹22.0 - ₹28.0 Lakhs',
    intake: 'Sep 2026',
    status: 'Lead New',
    aiScore: 88,
    counselorAssigned: 'Priya Sengupta (Senior Lead)',
    notes: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Get distinct list of universities and cities for filter dropdowns
  const uniqueUniversities = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => set.add(l.targetUniversity));
    return Array.from(set).sort();
  }, [leads]);

  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => set.add(l.city));
    return Array.from(set).sort();
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            lead.studentName.toLowerCase().includes(q) ||
            lead.email.toLowerCase().includes(q) ||
            lead.phone.toLowerCase().includes(q) ||
            lead.city.toLowerCase().includes(q) ||
            lead.targetUniversity.toLowerCase().includes(q) ||
            lead.preferredCourse.toLowerCase().includes(q) ||
            lead.id.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Status Filter
        if (statusFilter !== 'All' && lead.status !== statusFilter) {
          return false;
        }

        // University Filter
        if (universityFilter !== 'All' && lead.targetUniversity !== universityFilter) {
          return false;
        }

        // City Filter
        if (cityFilter !== 'All' && lead.city !== cityFilter) {
          return false;
        }

        // AI Score Filter
        if (minAiScore > 0 && lead.aiScore < minAiScore) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        return 0;
      });
  }, [leads, searchQuery, statusFilter, universityFilter, cityFilter, minAiScore, sortField, sortDirection]);

  // Reset current page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, universityFilter, cityFilter, minAiScore, pageSize]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  
  // Paginated slice
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const highPotential = leads.filter((l) => l.aiScore >= 90).length;
    const offersOrApproved = leads.filter(
      (l) => l.status === 'Offer Issued' || l.status === 'Scholarship Approved' || l.status === 'Enrolled'
    ).length;
    const newLeads = leads.filter((l) => l.status === 'Lead New').length;

    return { total, highPotential, offersOrApproved, newLeads };
  }, [leads]);

  // Handle Sort Toggle
  const handleSort = (field: 'studentName' | 'aiScore' | 'createdAt' | 'percentage') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // CSV Export Handlers
  const handleExportAll = () => {
    exportLeadsToCSV(leads, `PrimiPassi_All_${leads.length}_Student_Leads.csv`);
    showToast(`Exported all ${leads.length} student leads in CSV format!`);
  };

  const handleExportFiltered = () => {
    if (filteredLeads.length === 0) {
      showToast('No leads match the current filter criteria to export.');
      return;
    }
    exportLeadsToCSV(filteredLeads, `PrimiPassi_Filtered_${filteredLeads.length}_Leads.csv`);
    showToast(`Exported ${filteredLeads.length} filtered leads to CSV!`);
  };

  const handleExportSelected = () => {
    const selected = leads.filter((l) => selectedLeadIds.has(l.id));
    if (selected.length === 0) {
      showToast('Please select one or more leads to export.');
      return;
    }
    exportLeadsToCSV(selected, `PrimiPassi_Selected_${selected.length}_Leads.csv`);
    showToast(`Exported ${selected.length} selected leads to CSV!`);
  };

  // Selection handlers
  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSet = new Set(selectedLeadIds);
    if (e.target.checked) {
      paginatedLeads.forEach((l) => newSet.add(l.id));
    } else {
      paginatedLeads.forEach((l) => newSet.delete(l.id));
    }
    setSelectedLeadIds(newSet);
  };

  const handleSelectAllFiltered = () => {
    const newSet = new Set<string>();
    filteredLeads.forEach((l) => newSet.add(l.id));
    setSelectedLeadIds(newSet);
    showToast(`Selected all ${filteredLeads.length} matching leads!`);
  };

  const handleClearSelection = () => {
    setSelectedLeadIds(new Set());
  };

  const toggleSelectLead = (id: string) => {
    const newSet = new Set(selectedLeadIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedLeadIds(newSet);
  };

  // Status Change Handler
  const handleStatusChange = (leadId: string, newStatus: StudentLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    showToast(`Status updated to "${newStatus}" for ${leadId}`);
  };

  // Add Lead Handler
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.studentName || !newLeadForm.email || !newLeadForm.phone) {
      alert('Please fill in Student Name, Email, and Phone number.');
      return;
    }

    const created: StudentLead = {
      id: `LEAD-${1000 + leads.length + 1}`,
      studentName: newLeadForm.studentName || 'Student',
      email: newLeadForm.email || '',
      phone: newLeadForm.phone || '',
      city: newLeadForm.city || 'Mumbai',
      percentage: newLeadForm.percentage || '85% (12th CBSE)',
      targetUniversity: newLeadForm.targetUniversity || 'University of Birmingham Dubai',
      preferredCourse: newLeadForm.preferredCourse || 'MSc Computer Science & AI',
      budgetLakhs: newLeadForm.budgetLakhs || '₹25.0 Lakhs',
      intake: newLeadForm.intake || 'Sep 2026',
      status: (newLeadForm.status as StudentLead['status']) || 'Lead New',
      aiScore: Number(newLeadForm.aiScore) || 85,
      counselorAssigned: newLeadForm.counselorAssigned || 'Priya Sengupta (Senior Lead)',
      createdAt: new Date().toISOString().split('T')[0],
      notes: newLeadForm.notes || ''
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
    showToast(`New student lead ${created.studentName} added successfully!`);
    setNewLeadForm({
      studentName: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      percentage: '85% (12th CBSE)',
      targetUniversity: 'University of Birmingham Dubai',
      preferredCourse: 'MSc Computer Science & Artificial Intelligence',
      budgetLakhs: '₹22.0 - ₹28.0 Lakhs',
      intake: 'Sep 2026',
      status: 'Lead New',
      aiScore: 88,
      counselorAssigned: 'Priya Sengupta (Senior Lead)',
      notes: ''
    });
  };

  // Reset to default 1000 leads
  const handleResetTo1000 = () => {
    if (confirm('Reset database with 1,000 fresh student application leads for September 2026 intake?')) {
      const fresh1000 = generate1000StudentLeads();
      setLeads(fresh1000);
      setSelectedLeadIds(new Set());
      showToast('Successfully refreshed database with 1,000 student leads!');
    }
  };

  // Helper for Status Badge Styling
  const getStatusBadge = (status: StudentLead['status']) => {
    switch (status) {
      case 'Offer Issued':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Scholarship Approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Visa Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Enrolled':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'Docs Submitted':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Contacted':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'Follow Up Needed':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const isAllOnPageSelected =
    paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.has(l.id));

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900 transition-colors min-h-screen text-slate-900 dark:text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Console */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#EA580C] text-[11px] font-extrabold uppercase tracking-wider rounded-full">
                Senior Counselor CRM
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI-Powered Admissions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Student Admissions Pipeline ({leads.length.toLocaleString()} Leads)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Comprehensive applicant database for Indian students applying to Dubai Universities for 2026/2027 intakes. View, filter, manage, and export lead records with live CSV generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportAll}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all"
              title="Download full 1000 leads in CSV"
            >
              <Download className="w-4 h-4" />
              <span>Download Leads (CSV)</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>

            <button
              onClick={handleResetTo1000}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700"
              title="Reload 1,000 Sample Leads"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Lead Capacity</span>
              <Users className="w-4 h-4 text-[#EA580C]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.total.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">100% active in database</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center justify-between">
              <span>High AI Match (90%+)</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {metrics.highPotential.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">Tier-1 scholarship eligible</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider flex items-center justify-between">
              <span>Offers & Grants</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.offersOrApproved.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">Offer / Scholarship / Enrolled</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wider flex items-center justify-between">
              <span>New Action Needed</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {metrics.newLeads.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">Awaiting counselor callback</div>
          </div>
        </div>

        {/* Main Tabular Leads Table Container (Selected element) */}
        <div
          id="counsellor-leads-section"
          className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-md space-y-5"
        >
          {/* Controls Bar: Search & Quick Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[260px] max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 1,000 leads (Name, City, Course, Uni, ID)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              >
                <option value="All">All Statuses ({leads.length})</option>
                <option value="Lead New">Lead New</option>
                <option value="Contacted">Contacted</option>
                <option value="Docs Submitted">Docs Submitted</option>
                <option value="Offer Issued">Offer Issued</option>
                <option value="Scholarship Approved">Scholarship Approved</option>
                <option value="Visa Processing">Visa Processing</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Follow Up Needed">Follow Up Needed</option>
              </select>

              {/* University Filter */}
              <select
                value={universityFilter}
                onChange={(e) => setUniversityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#EA580C] max-w-[200px] truncate"
              >
                <option value="All">All Universities</option>
                {uniqueUniversities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              >
                <option value="All">All Indian Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions & CSV Export Controls */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Export Filtered CSV */}
              <button
                onClick={handleExportFiltered}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
                title="Export filtered records to CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export CSV ({filteredLeads.length})</span>
              </button>

              {/* Bulk Selected Export */}
              {selectedLeadIds.size > 0 && (
                <button
                  onClick={handleExportSelected}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Selected ({selectedLeadIds.size})</span>
                </button>
              )}
            </div>
          </div>

          {/* Batch Selection Banner */}
          {selectedLeadIds.size > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                <Check className="w-4 h-4 text-[#EA580C]" />
                <span>{selectedLeadIds.size} student leads selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllFiltered}
                  className="text-[11px] font-extrabold text-[#EA580C] hover:underline"
                >
                  Select all {filteredLeads.length} matching leads
                </button>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <button
                  onClick={handleClearSelection}
                  className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Tabular Leads Presentation */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 max-h-[640px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllOnPageSelected}
                      onChange={handleSelectAllOnPage}
                      className="rounded border-slate-300 text-[#EA580C] focus:ring-[#EA580C] w-4 h-4 cursor-pointer"
                      title="Select all on this page"
                    />
                  </th>
                  <th className="p-3.5">Lead ID</th>
                  <th
                    onClick={() => handleSort('studentName')}
                    className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Student & Location</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('percentage')}
                    className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Academic Background</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Target Campus & Program</th>
                  <th
                    onClick={() => handleSort('aiScore')}
                    className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>AI Score</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Intake & Budget</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No student leads found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search keywords or active filters.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('All');
                          setUniversityFilter('All');
                          setCityFilter('All');
                        }}
                        className="mt-3 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const isSelected = selectedLeadIds.has(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-amber-50/70 dark:bg-amber-950/20'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectLead(lead.id)}
                            className="rounded border-slate-300 text-[#EA580C] focus:ring-[#EA580C] w-4 h-4 cursor-pointer"
                          />
                        </td>

                        {/* ID */}
                        <td className="p-3.5 font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400">
                          {lead.id}
                        </td>

                        {/* Student & City */}
                        <td className="p-3.5">
                          <div className="font-extrabold text-slate-900 dark:text-white text-xs hover:text-[#EA580C] cursor-pointer" onClick={() => setSelectedLead(lead)}>
                            {lead.studentName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#EA580C] shrink-0" />
                            <span>{lead.city}, India</span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            {lead.phone}
                          </div>
                        </td>

                        {/* Academics */}
                        <td className="p-3.5">
                          <span className="inline-block font-semibold text-slate-800 dark:text-slate-200 text-xs">
                            {lead.percentage}
                          </span>
                        </td>

                        {/* Campus & Course */}
                        <td className="p-3.5 max-w-[220px]">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate" title={lead.targetUniversity}>
                            {lead.targetUniversity}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={lead.preferredCourse}>
                            {lead.preferredCourse}
                          </div>
                        </td>

                        {/* AI Score */}
                        <td className="p-3.5">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{lead.aiScore}%</span>
                          </div>
                        </td>

                        {/* Status (Editable Dropdown directly in row) */}
                        <td className="p-3.5">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as StudentLead['status'])
                            }
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(
                              lead.status
                            )}`}
                          >
                            <option value="Lead New">Lead New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Docs Submitted">Docs Submitted</option>
                            <option value="Offer Issued">Offer Issued</option>
                            <option value="Scholarship Approved">Scholarship Approved</option>
                            <option value="Visa Processing">Visa Processing</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Follow Up Needed">Follow Up Needed</option>
                          </select>
                        </td>

                        {/* Intake & Budget */}
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                            {lead.intake}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {lead.budgetLakhs}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg transition-colors"
                              title="View Full Lead Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                            </button>
                            <a
                              href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                              className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-600 rounded-lg transition-colors"
                              title={`Call ${lead.studentName}`}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.studentName)},%20this%20is%20PrimiPassi%20Dubai%20Admissions.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-600 rounded-lg transition-colors"
                              title="WhatsApp Student"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span>
                Showing{' '}
                <strong className="text-slate-900 dark:text-white">
                  {filteredLeads.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </strong>{' '}
                to{' '}
                <strong className="text-slate-900 dark:text-white">
                  {Math.min(currentPage * pageSize, filteredLeads.length)}
                </strong>{' '}
                of <strong className="text-[#EA580C]">{filteredLeads.length.toLocaleString()}</strong> filtered leads
                {filteredLeads.length !== leads.length && ` (from ${leads.length.toLocaleString()} total)`}
              </span>

              {/* Rows per page selection */}
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-[11px]">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Details Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                  {selectedLead.id} &bull; Created {selectedLead.createdAt}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedLead.studentName}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedLead.city}, India &bull; {selectedLead.percentage}
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target University</span>
                <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedLead.targetUniversity}</p>
                <p className="text-[11px] text-[#EA580C] font-semibold">{selectedLead.preferredCourse}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Intake & Budget</span>
                <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedLead.intake}</p>
                <p className="text-[11px] text-slate-500">{selectedLead.budgetLakhs}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Information</span>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200">{selectedLead.email}</p>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200">{selectedLead.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">AI Admissions Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-amber-500">{selectedLead.aiScore}%</span>
                  <span className="text-[11px] text-slate-500">Tier-1 Qualified</span>
                </div>
                <p className="text-[10px] text-slate-400">Assigned: {selectedLead.counselorAssigned}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Counselor Notes & Actions</label>
              <textarea
                rows={3}
                defaultValue={selectedLead.notes}
                onChange={(e) => {
                  const updatedNotes = e.target.value;
                  setLeads((prev) =>
                    prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l))
                  );
                }}
                placeholder="Add conversation notes, next steps, scholarship eligibility notes..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedLead.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Student
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLead.studentName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp
                </a>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateLead}
            className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#EA580C]" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Student Lead</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Verma"
                  value={newLeadForm.studentName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">City / State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={newLeadForm.city}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@gmail.com"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98200 12345"
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Academic Score</label>
                <input
                  type="text"
                  placeholder="e.g. 88% (12th CBSE) or 8.5 CGPA"
                  value={newLeadForm.percentage}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, percentage: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Target University</label>
                <select
                  value={newLeadForm.targetUniversity}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, targetUniversity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                >
                  {uniqueUniversities.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Preferred Course</label>
                <input
                  type="text"
                  placeholder="e.g. MSc Data Science & Artificial Intelligence"
                  value={newLeadForm.preferredCourse}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, preferredCourse: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow"
              >
                Create Lead Record
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
