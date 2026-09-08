import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  FileText,
  Check,
  X,
  Send,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import {
  ItalyEligibilityLead,
  PreliminaryEligibilityStatus,
  CounsellorLeadStatus
} from '../types';
import {
  fetchItalyEligibilityLeadsFromFirestore,
  updateItalyEligibilityLeadInFirestore,
  deleteItalyEligibilityLeadFromFirestore,
  subscribeToItalyEligibilityLeads
} from '../lib/firebase';

interface ItalyEligibilityAdminPanelProps {
  onNotify: (msg: string) => void;
}

export const ItalyEligibilityAdminPanel: React.FC<ItalyEligibilityAdminPanelProps> = ({
  onNotify
}) => {
  const [leads, setLeads] = useState<ItalyEligibilityLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ItalyEligibilityLead | null>(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('all');
  const [counsellorStatusFilter, setCounsellorStatusFilter] = useState<string>('all');
  const [studyLevelFilter, setStudyLevelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // Edit lead modal state
  const [editStatus, setEditStatus] = useState<CounsellorLeadStatus>('New');
  const [editNotes, setEditNotes] = useState('');
  const [editAssignedCounsellor, setEditAssignedCounsellor] = useState('');
  const [editCounsellorOverride, setEditCounsellorOverride] = useState('');

  // Load leads
  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await fetchItalyEligibilityLeadsFromFirestore();
      setLeads(data);
    } catch (err: any) {
      console.error('Failed to fetch Italy leads:', err);
      onNotify('Failed to load Italy eligibility leads from Firestore: ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Realtime listener
    const unsubscribe = subscribeToItalyEligibilityLeads(
      (updatedLeads) => {
        setLeads(updatedLeads);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Fallback loading leads manually:', error);
        loadLeads();
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Set modal fields when lead opened
  useEffect(() => {
    if (selectedLead) {
      setEditStatus(selectedLead.counsellorStatus || 'New');
      setEditNotes(selectedLead.counsellorNotes || '');
      setEditAssignedCounsellor(selectedLead.assignedCounsellor || '');
      setEditCounsellorOverride(selectedLead.counsellorEligibilityStatus || '');
    }
  }, [selectedLead]);

  // Handle saving counsellor updates
  const handleSaveLeadUpdates = async () => {
    if (!selectedLead) return;
    setIsSavingDetails(true);
    try {
      const now = new Date();
      const timestampStr = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const updates: Partial<ItalyEligibilityLead> = {
        counsellorStatus: editStatus,
        counsellorNotes: editNotes,
        assignedCounsellor: editAssignedCounsellor,
        counsellorEligibilityStatus: editCounsellorOverride,
        lastContactedAt: editStatus === 'Contacted' ? timestampStr : selectedLead.lastContactedAt
      };

      await updateItalyEligibilityLeadInFirestore(selectedLead.id, updates);

      // Update local state
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, ...updates } : l))
      );
      setSelectedLead((prev) => (prev ? { ...prev, ...updates } : null));
      onNotify('Lead details updated successfully in Firestore!');
    } catch (err: any) {
      console.error('Error updating lead:', err);
      onNotify('Failed to update lead: ' + (err.message || ''));
    } finally {
      setIsSavingDetails(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this Italy eligibility assessment lead?')) {
      return;
    }

    try {
      await deleteItalyEligibilityLeadFromFirestore(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      onNotify('Lead deleted successfully from Firestore.');
    } catch (err: any) {
      console.error('Delete error:', err);
      onNotify('Failed to delete lead: ' + (err.message || ''));
    }
  };

  // Quick inline update status
  const handleQuickStatusChange = async (leadId: string, newStatus: CounsellorLeadStatus) => {
    try {
      await updateItalyEligibilityLeadInFirestore(leadId, { counsellorStatus: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, counsellorStatus: newStatus } : l))
      );
      onNotify(`Status updated to "${newStatus}"!`);
    } catch (err: any) {
      console.error('Quick status change error:', err);
      onNotify('Failed to update status');
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const nowMs = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return leads.filter((lead) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = lead.fullName?.toLowerCase().includes(query);
        const matchEmail = lead.email?.toLowerCase().includes(query);
        const matchPhone = lead.phone?.toLowerCase().includes(query);
        const matchField = lead.intendedField?.toLowerCase().includes(query);
        const matchCourse = lead.bachelorsDegreeName?.toLowerCase().includes(query);
        const matchId = lead.id?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchPhone && !matchField && !matchCourse && !matchId) {
          return false;
        }
      }

      // Eligibility Status
      if (eligibilityFilter !== 'all' && lead.preliminaryEligibilityStatus !== eligibilityFilter) {
        return false;
      }

      // Counsellor Status
      if (counsellorStatusFilter !== 'all' && lead.counsellorStatus !== counsellorStatusFilter) {
        return false;
      }

      // Study Level
      if (studyLevelFilter !== 'all' && lead.studyLevel !== studyLevelFilter) {
        return false;
      }

      // Date
      if (dateFilter !== 'all') {
        const leadTime = lead.createdAtMs || 0;
        if (dateFilter === 'today' && nowMs - leadTime > oneDayMs) return false;
        if (dateFilter === '7days' && nowMs - leadTime > 7 * oneDayMs) return false;
        if (dateFilter === '30days' && nowMs - leadTime > 30 * oneDayMs) return false;
      }

      return true;
    });
  }, [leads, searchTerm, eligibilityFilter, counsellorStatusFilter, studyLevelFilter, dateFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const eligible = leads.filter((l) => l.preliminaryEligibilityStatus === 'ELIGIBLE').length;
    const review = leads.filter((l) => l.preliminaryEligibilityStatus === 'PROFILE_REVIEW').length;
    const notEligible = leads.filter((l) => l.preliminaryEligibilityStatus === 'NOT_ELIGIBLE').length;
    const newLeads = leads.filter((l) => l.counsellorStatus === 'New').length;
    const contacted = leads.filter((l) => l.counsellorStatus === 'Contacted').length;
    return { total, eligible, review, notEligible, newLeads, contacted };
  }, [leads]);

  // Export CSV
  const handleExportCsv = () => {
    if (filteredLeads.length === 0) {
      onNotify('No leads available to export with current filters.');
      return;
    }

    const headers = [
      'Lead ID',
      'Date Created',
      'Student Name',
      'Email',
      'Phone',
      'Study Level',
      'Intended Field',
      'Intake',
      'Academic Score',
      'Score Details',
      'Education Gap (Years)',
      'Gap Reason',
      'Work Experience (Years)',
      'Job Role',
      'Industry',
      'IELTS Status',
      'IELTS Band',
      'MOI Available',
      'Architecture/Design Portfolio',
      'Scholarship Interest',
      'Family Income',
      'Application Timeline',
      'Preliminary Status',
      'Preliminary Reasons',
      'Preliminary Flags',
      'Counsellor Status',
      'Assigned Counsellor',
      'Counsellor Override',
      'Counsellor Notes'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = filteredLeads.map((l) => {
      const academicScore =
        l.studyLevel === "Bachelor's"
          ? l.applyingDiplomaRoute === 'Yes'
            ? `Diploma: ${l.diplomaPercentage}%`
            : `Class 12: ${l.class12Percentage}%`
          : l.scoreType === 'CGPA'
          ? `CGPA ${l.bachelorsCgpa}/${l.cgpaScale}`
          : `${l.bachelorsPercentage}%`;

      const scoreDetails =
        l.studyLevel === "Bachelor's"
          ? `Completed: ${l.completedClass12 || 'Yes'}`
          : `${l.bachelorsDegreeName || ''} (${l.completedBachelors || 'Yes'})`;

      return [
        escapeCsv(l.id),
        escapeCsv(l.createdAt),
        escapeCsv(l.fullName),
        escapeCsv(l.email),
        escapeCsv(l.phone),
        escapeCsv(l.studyLevel),
        escapeCsv(l.intendedField === 'Other' ? l.intendedFieldOther : l.intendedField),
        escapeCsv(l.intake),
        escapeCsv(academicScore),
        escapeCsv(scoreDetails),
        escapeCsv(l.hasEducationGap === 'Yes' ? l.gapYears : '0'),
        escapeCsv(l.hasEducationGap === 'Yes' ? l.gapReason : 'None'),
        escapeCsv(l.hasWorkExperience === 'Yes' ? l.workExperienceYears : '0'),
        escapeCsv(l.jobRole || 'None'),
        escapeCsv(l.industry || 'None'),
        escapeCsv(l.ieltsStatus),
        escapeCsv(l.ieltsScore || 'N/A'),
        escapeCsv(l.moiAvailable),
        escapeCsv(l.hasPortfolio || 'N/A'),
        escapeCsv(l.scholarshipInterest),
        escapeCsv(l.familyIncomeRange || 'N/A'),
        escapeCsv(l.applicationIntent),
        escapeCsv(l.preliminaryEligibilityStatus),
        escapeCsv(l.eligibilityReasons?.join('; ')),
        escapeCsv(l.eligibilityFlags?.join('; ')),
        escapeCsv(l.counsellorStatus),
        escapeCsv(l.assignedCounsellor || 'Unassigned'),
        escapeCsv(l.counsellorEligibilityStatus || 'None'),
        escapeCsv(l.counsellorNotes || '')
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Italy_Eligibility_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify(`Exported ${filteredLeads.length} Italy eligibility leads to CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🇮🇹</span>
            <h2 className="text-xl font-black text-slate-900">
              Italy Student Eligibility Leads
            </h2>
            <span className="px-2.5 py-0.5 bg-orange-100 text-[#EA580C] text-xs font-black rounded-full">
              {leads.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time submissions from the Italy Preliminary Eligibility Assessment questionnaire.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLeads}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            title="Refresh Leads from Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Submissions</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          <span className="text-[10px] text-slate-500 font-medium">All questionnaire entries</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
            🟢 Preliminarily Eligible
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.eligible}</p>
          <span className="text-[10px] text-slate-500 font-medium">
            {stats.total > 0 ? Math.round((stats.eligible / stats.total) * 100) : 0}% of leads
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-700 flex items-center gap-1">
            🟡 Profile Review
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.review}</p>
          <span className="text-[10px] text-slate-500 font-medium">Requires counsellor check</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-red-700 flex items-center gap-1">
            🔴 Does Not Meet
          </span>
          <p className="text-2xl font-black text-red-600 mt-1">{stats.notEligible}</p>
          <span className="text-[10px] text-slate-500 font-medium">Below standard benchmarks</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-[#EA580C]">New Queue</span>
          <p className="text-2xl font-black text-[#EA580C] mt-1">{stats.newLeads}</p>
          <span className="text-[10px] text-slate-500 font-medium">Awaiting outreach</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-blue-600">Contacted</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{stats.contacted}</p>
          <span className="text-[10px] text-slate-500 font-medium">In counselling process</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, email, phone, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Eligibility Filter */}
          <div>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#EA580C]"
            >
              <option value="all">All Eligibility (All)</option>
              <option value="ELIGIBLE">🟢 Preliminarily Eligible</option>
              <option value="PROFILE_REVIEW">🟡 Profile Review Required</option>
              <option value="NOT_ELIGIBLE">🔴 Does Not Meet Preliminary</option>
            </select>
          </div>

          {/* Counsellor Status */}
          <div>
            <select
              value={counsellorStatusFilter}
              onChange={(e) => setCounsellorStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#EA580C]"
            >
              <option value="all">All Counsellor Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Counselling Scheduled">Counselling Scheduled</option>
              <option value="Application Interested">Application Interested</option>
              <option value="Application Started">Application Started</option>
              <option value="Converted">Converted</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Not Eligible">Not Eligible</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Level & Date filter */}
          <div className="flex gap-2">
            <select
              value={studyLevelFilter}
              onChange={(e) => setStudyLevelFilter(e.target.value)}
              className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">Levels</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || eligibilityFilter !== 'all' || counsellorStatusFilter !== 'all' || studyLevelFilter !== 'all' || dateFilter !== 'all') && (
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span>Filtering showing {filteredLeads.length} of {leads.length} leads:</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setEligibilityFilter('all');
                setCounsellorStatusFilter('all');
                setStudyLevelFilter('all');
                setDateFilter('all');
              }}
              className="text-[#EA580C] font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* LEADS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#EA580C] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading Italy eligibility leads from Firestore...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-[#EA580C] mx-auto flex items-center justify-center font-bold text-lg">
              🇮🇹
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Italy Eligibility Leads Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No submissions match your search or filter criteria. Check the assessment form at{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">/italy-eligibility-assessment</code>.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-4">Student</th>
                  <th className="p-4">Level & Intended Field</th>
                  <th className="p-4">Academic Score</th>
                  <th className="p-4">Language / Gap</th>
                  <th className="p-4">Preliminary Status</th>
                  <th className="p-4">Counsellor Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const academicSummary =
                    lead.studyLevel === "Bachelor's"
                      ? lead.applyingDiplomaRoute === 'Yes'
                        ? `Diploma: ${lead.diplomaPercentage}%`
                        : `12th: ${lead.class12Percentage}%`
                      : lead.scoreType === 'CGPA'
                      ? `CGPA: ${lead.bachelorsCgpa}/${lead.cgpaScale}`
                      : `${lead.bachelorsPercentage}%`;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Student Info */}
                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{lead.fullName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>

                      {/* Level & Field */}
                      <td className="p-4 space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                          {lead.studyLevel}
                        </span>
                        <p className="font-bold text-slate-800 line-clamp-1">
                          {lead.intendedField === 'Other' ? lead.intendedFieldOther : lead.intendedField}
                        </p>
                        <p className="text-[10px] text-slate-400">{lead.intake}</p>
                      </td>

                      {/* Academic Score */}
                      <td className="p-4 space-y-0.5">
                        <span className="font-black text-slate-900 text-sm">{academicSummary}</span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {lead.studyLevel === "Bachelor's"
                            ? lead.completedClass12 || 'Completed'
                            : lead.bachelorsDegreeName || 'Bachelor Degree'}
                        </p>
                      </td>

                      {/* Language / Gap */}
                      <td className="p-4 space-y-1">
                        <div className="text-[11px] text-slate-700">
                          <strong>IELTS:</strong> {lead.ieltsStatus === 'Yes' ? `${lead.ieltsScore} Band` : lead.ieltsStatus}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <strong>Gap:</strong> {lead.hasEducationGap === 'Yes' ? `${lead.gapYears} yrs` : 'None'}
                        </div>
                      </td>

                      {/* Preliminary Status Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            lead.preliminaryEligibilityStatus === 'ELIGIBLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lead.preliminaryEligibilityStatus === 'PROFILE_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {lead.preliminaryEligibilityStatus === 'ELIGIBLE' && '🟢 Preliminarily Eligible'}
                          {lead.preliminaryEligibilityStatus === 'PROFILE_REVIEW' && '🟡 Profile Review'}
                          {lead.preliminaryEligibilityStatus === 'NOT_ELIGIBLE' && '🔴 Does Not Meet'}
                        </span>
                      </td>

                      {/* Counsellor Status */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.counsellorStatus || 'New'}
                          onChange={(e) => handleQuickStatusChange(lead.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white focus:outline-none focus:border-[#EA580C]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up Required">Follow-up Required</option>
                          <option value="Counselling Scheduled">Counselling Scheduled</option>
                          <option value="Application Interested">Application Interested</option>
                          <option value="Application Started">Application Started</option>
                          <option value="Converted">Converted</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Not Eligible">Not Eligible</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {lead.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                            title="View Full Application & Assessment"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                              lead.fullName
                            )},%20I%20am%20calling%20from%20PrimiPassi%20Education%20Advisors%20regarding%20your%20Italy%20Eligibility%20Assessment%20for%20${encodeURIComponent(
                              lead.intendedField
                            )}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED LEAD MODAL / DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇮🇹</span>
                  <h3 className="text-lg font-black text-slate-900">{selectedLead.fullName}</h3>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {selectedLead.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted on {selectedLead.createdAt} • Source: {selectedLead.leadSource || 'Assessment Page'}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center gap-1.5 text-slate-700 font-bold hover:text-[#EA580C]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#EA580C]" /> {selectedLead.phone}
                </a>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center gap-1.5 text-slate-700 font-bold hover:text-[#EA580C]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#EA580C]" /> {selectedLead.email}
                </a>
              </div>

              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                  selectedLead.fullName
                )},%20I%20am%20from%20PrimiPassi%20Education%20Advisors%20following%20up%20on%20your%20Italy%20Eligibility%20Assessment.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Candidate</span>
              </a>
            </div>

            {/* Automated Assessment Engine Evaluation Card */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                selectedLead.preliminaryEligibilityStatus === 'ELIGIBLE'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : selectedLead.preliminaryEligibilityStatus === 'PROFILE_REVIEW'
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                  : 'bg-red-50/70 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase opacity-70">
                    Automated Preliminary Classification
                  </span>
                  <h4 className="text-base font-black">
                    {selectedLead.preliminaryEligibilityStatus === 'ELIGIBLE' && '🟢 PRELIMINARILY ELIGIBLE'}
                    {selectedLead.preliminaryEligibilityStatus === 'PROFILE_REVIEW' && '🟡 PROFILE REVIEW REQUIRED'}
                    {selectedLead.preliminaryEligibilityStatus === 'NOT_ELIGIBLE' && '🔴 DOES NOT MEET PRELIMINARY CRITERIA'}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white/80 rounded-lg">
                  {selectedLead.questionnaireVersion}
                </span>
              </div>

              {selectedLead.eligibilityReasons && selectedLead.eligibilityReasons.length > 0 && (
                <div className="space-y-1 text-xs pt-1 border-t border-black/10">
                  <span className="font-bold text-[11px] uppercase opacity-80">Assessment Positives & Met Criteria:</span>
                  <ul className="space-y-0.5 opacity-90 pl-1">
                    {selectedLead.eligibilityReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLead.eligibilityFlags && selectedLead.eligibilityFlags.length > 0 && (
                <div className="space-y-1 text-xs pt-2 border-t border-black/10 text-amber-900 font-medium">
                  <span className="font-bold text-[11px] uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Flags Requiring Counsellor Review:
                  </span>
                  <ul className="space-y-0.5 pl-1">
                    {selectedLead.eligibilityFlags.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Study & Degree */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 text-[#EA580C]" /> Intended Study in Italy
                </h5>
                <p>
                  <strong>Level:</strong> {selectedLead.studyLevel}
                </p>
                <p>
                  <strong>Course/Field:</strong> {selectedLead.intendedField}
                  {selectedLead.intendedFieldOther ? ` (${selectedLead.intendedFieldOther})` : ''}
                </p>
                <p>
                  <strong>Target Intake:</strong> {selectedLead.intake}
                </p>
                <p>
                  <strong>Application Intent:</strong> {selectedLead.applicationIntent}
                </p>
              </div>

              {/* Academic Qualification */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" /> Academic Background
                </h5>
                {selectedLead.studyLevel === "Bachelor's" ? (
                  <>
                    <p>
                      <strong>Class 12 %:</strong> {selectedLead.class12Percentage}% ({selectedLead.completedClass12})
                    </p>
                    {selectedLead.applyingDiplomaRoute === 'Yes' && (
                      <p>
                        <strong>10th + Diploma:</strong> {selectedLead.diplomaPercentage}%
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Degree:</strong> {selectedLead.bachelorsDegreeName}{' '}
                      {selectedLead.bachelorsSpecialisation ? `(${selectedLead.bachelorsSpecialisation})` : ''}
                    </p>
                    <p>
                      <strong>Score:</strong>{' '}
                      {selectedLead.scoreType === 'CGPA'
                        ? `${selectedLead.bachelorsCgpa} CGPA (scale ${selectedLead.cgpaScale})`
                        : `${selectedLead.bachelorsPercentage}%`}
                    </p>
                    <p>
                      <strong>Degree Status:</strong> {selectedLead.completedBachelors}
                    </p>
                    {selectedLead.completedBachelors === 'No, currently pursuing' && (
                      <p className="text-slate-500">
                        Latest Sem: {selectedLead.latestSemesterPercentage}% | Predicted:{' '}
                        {selectedLead.predictedFinalPercentage}%
                      </p>
                    )}
                    {selectedLead.specificItDegree && (
                      <p className="text-[#EA580C] font-semibold">IT Category: {selectedLead.specificItDegree}</p>
                    )}
                  </>
                )}
              </div>

              {/* Gap & Work Experience */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-[#EA580C]" /> Education Gap & Work
                </h5>
                <p>
                  <strong>Education Gap:</strong>{' '}
                  {selectedLead.hasEducationGap === 'Yes'
                    ? `${selectedLead.gapYears} years (${selectedLead.gapReason}${
                        selectedLead.gapReasonOther ? `: ${selectedLead.gapReasonOther}` : ''
                      })`
                    : 'No Gap'}
                </p>
                <p>
                  <strong>Work Experience:</strong>{' '}
                  {selectedLead.hasWorkExperience === 'Yes'
                    ? `${selectedLead.workExperienceYears} years as ${selectedLead.jobRole} in ${selectedLead.industry}`
                    : 'None'}
                </p>
              </div>

              {/* Language & Portfolio */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  <Award className="w-3.5 h-3.5 text-[#EA580C]" /> Language & Requirements
                </h5>
                <p>
                  <strong>IELTS:</strong>{' '}
                  {selectedLead.ieltsStatus === 'Yes'
                    ? `Band ${selectedLead.ieltsScore}`
                    : selectedLead.ieltsStatus}
                </p>
                <p>
                  <strong>MOI Letter:</strong> {selectedLead.moiAvailable}
                </p>
                <p>
                  <strong>Architecture / Design:</strong> {selectedLead.isArchitectureDesign}
                </p>
                {selectedLead.isArchitectureDesign === 'Yes' && (
                  <p>
                    <strong>Creative Portfolio:</strong> {selectedLead.hasPortfolio}
                  </p>
                )}
              </div>

              {/* Scholarship & Documents */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 sm:col-span-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-[#EA580C]" /> Documents & Scholarship
                </h5>
                <p>
                  <strong>Scholarship Interest:</strong> {selectedLead.scholarshipInterest} |{' '}
                  <strong>Family Income:</strong> {selectedLead.familyIncomeRange || 'Not specified'} |{' '}
                  <strong>Financial Docs Ready:</strong> {selectedLead.canProvideFinancialDocs || 'Not sure'}
                </p>
                <div>
                  <span className="font-bold">Available Documents ({selectedLead.availableDocuments?.length || 0}):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedLead.availableDocuments?.map((doc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700"
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedLead.documentsToArrange && (
                  <p className="text-slate-500">
                    <strong>Pending to arrange:</strong> {selectedLead.documentsToArrange}
                  </p>
                )}
              </div>
            </div>

            {/* Counsellor Workflow Management */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#EA580C]" /> Counsellor Actions & Assignment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Counsellor Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Counselling Scheduled">Counselling Scheduled</option>
                    <option value="Application Interested">Application Interested</option>
                    <option value="Application Started">Application Started</option>
                    <option value="Converted">Converted</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Not Eligible">Not Eligible</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Assigned Counsellor</label>
                  <input
                    type="text"
                    placeholder="e.g. Swati Soam, Shubham"
                    value={editAssignedCounsellor}
                    onChange={(e) => setEditAssignedCounsellor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Counsellor Assessment Override</label>
                  <input
                    type="text"
                    placeholder="e.g. Approved for PoliMi; IELTS waiver confirmed"
                    value={editCounsellorOverride}
                    onChange={(e) => setEditCounsellorOverride(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Counsellor Call Notes & Strategy</label>
                <textarea
                  rows={3}
                  placeholder="Record discussions with student, university recommendations, document collection status..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {selectedLead.lastContactedAt ? `Last contacted: ${selectedLead.lastContactedAt}` : 'Not yet contacted'}
                </span>

                <button
                  onClick={handleSaveLeadUpdates}
                  disabled={isSavingDetails}
                  className="px-6 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingDetails ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Updates to Firestore</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
