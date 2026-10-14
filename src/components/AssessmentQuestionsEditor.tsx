import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe2,
  GraduationCap,
  Briefcase,
  FileCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Check,
  X,
  Sliders,
  ExternalLink,
  Edit2,
  Info,
  User
} from 'lucide-react';
import {
  AssessmentConfig,
  AssessmentCategoryConfig,
  AssessmentQuestionConfig,
  AssessmentQuestionOption
} from '../types';
import { useContent } from '../context/ContentContext';

interface AssessmentQuestionsEditorProps {
  onNotify: (msg: string) => void;
  onPreviewAssessment?: () => void;
}

export const AssessmentQuestionsEditor: React.FC<AssessmentQuestionsEditorProps> = ({
  onNotify,
  onPreviewAssessment
}) => {
  const {
    assessmentConfig,
    updateAssessmentConfig,
    resetAssessmentConfigToDefaults
  } = useContent();

  // Local draft state so admins can edit multiple items before saving to cloud
  const [draftConfig, setDraftConfig] = useState<AssessmentConfig>(() =>
    JSON.parse(JSON.stringify(assessmentConfig))
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string>('personal_study');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // New option inline input state per question ID
  const [newOptionDrafts, setNewOptionDrafts] = useState<
    Record<string, { label: string; value: string; description?: string }>
  >({});

  // Adding custom question state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionCategory, setNewQuestionCategory] = useState('personal_study');
  const [newQuestionForm, setNewQuestionForm] = useState({
    title: '',
    subtitle: '',
    type: 'select-grid' as AssessmentQuestionConfig['type'],
    required: false,
    allowOther: false,
    otherPlaceholder: 'Enter custom details...',
    targetDegreeLevel: 'all' as 'all' | 'bachelors' | 'masters',
    initialOptionsStr: 'Option 1\nOption 2\nOption 3'
  });

  // Track changes
  const markDirty = () => {
    setHasUnsavedChanges(true);
  };

  // Switch category
  const activeCategory = draftConfig.categories.find((c) => c.id === activeCategoryId);

  // Save changes to Firestore and context
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateAssessmentConfig(draftConfig);
      setHasUnsavedChanges(false);
      onNotify('Assessment questions and options saved successfully to Firestore!');
    } catch (err: any) {
      console.error('Failed to save assessment questions:', err);
      onNotify('Error saving assessment questions: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Are you sure you want to revert all assessment questions, categories, and options to default configuration?\n\nThis will overwrite all custom questions and option edits.'
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      await resetAssessmentConfigToDefaults();
      // Reload draft from context
      setDraftConfig(JSON.parse(JSON.stringify(assessmentConfig)));
      setHasUnsavedChanges(false);
      onNotify('Assessment questions reset to standard default configuration.');
    } catch (err: any) {
      console.error('Error resetting:', err);
      onNotify('Failed to reset defaults');
    } finally {
      setIsSaving(false);
    }
  };

  // Update question properties
  const handleUpdateQuestion = (
    catId: string,
    qId: string,
    updates: Partial<AssessmentQuestionConfig>
  ) => {
    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          questions: cat.questions.map((q) => {
            if (q.id !== qId) return q;
            return { ...q, ...updates };
          })
        };
      });
      return { ...prev, categories: nextCategories };
    });
    markDirty();
  };

  // Update an option inside a question
  const handleUpdateOption = (
    catId: string,
    qId: string,
    optId: string,
    updates: Partial<AssessmentQuestionOption>
  ) => {
    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          questions: cat.questions.map((q) => {
            if (q.id !== qId) return q;
            const nextOptions = (q.options || []).map((opt) => {
              if (opt.id !== optId) return opt;
              return { ...opt, ...updates };
            });
            return { ...q, options: nextOptions };
          })
        };
      });
      return { ...prev, categories: nextCategories };
    });
    markDirty();
  };

  // Delete an option
  const handleDeleteOption = (catId: string, qId: string, optId: string) => {
    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          questions: cat.questions.map((q) => {
            if (q.id !== qId) return q;
            return {
              ...q,
              options: (q.options || []).filter((opt) => opt.id !== optId)
            };
          })
        };
      });
      return { ...prev, categories: nextCategories };
    });
    markDirty();
  };

  // Reorder option
  const handleMoveOption = (
    catId: string,
    qId: string,
    index: number,
    direction: 'up' | 'down'
  ) => {
    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          questions: cat.questions.map((q) => {
            if (q.id !== qId) return q;
            const options = [...(q.options || [])];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= options.length) return q;
            const temp = options[index];
            options[index] = options[targetIndex];
            options[targetIndex] = temp;
            return { ...q, options };
          })
        };
      });
      return { ...prev, categories: nextCategories };
    });
    markDirty();
  };

  // Add new option to question
  const handleAddOption = (catId: string, qId: string) => {
    const draft = newOptionDrafts[qId];
    if (!draft || !draft.label.trim()) {
      onNotify('Please enter a valid option title');
      return;
    }

    const newOpt: AssessmentQuestionOption = {
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      label: draft.label.trim(),
      value: draft.value.trim() || draft.label.trim(),
      description: draft.description?.trim() || undefined
    };

    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          questions: cat.questions.map((q) => {
            if (q.id !== qId) return q;
            return {
              ...q,
              options: [...(q.options || []), newOpt]
            };
          })
        };
      });
      return { ...prev, categories: nextCategories };
    });

    // Clear draft input
    setNewOptionDrafts((prev) => ({
      ...prev,
      [qId]: { label: '', value: '', description: '' }
    }));
    markDirty();
    onNotify(`Option "${newOpt.label}" added.`);
  };

  // Delete question
  const handleDeleteQuestion = (catId: string, qId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove question: "${title}"?`)) {
      return;
    }

    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          questions: cat.questions.filter((q) => q.id !== qId)
        };
      });
      return { ...prev, categories: nextCategories };
    });
    markDirty();
    onNotify(`Question removed.`);
  };

  // Create new custom question
  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionForm.title.trim()) {
      onNotify('Please provide a question title');
      return;
    }

    const optionsList: AssessmentQuestionOption[] = newQuestionForm.initialOptionsStr
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((label, idx) => ({
        id: `opt-custom-${Date.now()}-${idx}`,
        label,
        value: label
      }));

    const newQ: AssessmentQuestionConfig = {
      id: `custom_q_${Date.now()}`,
      step: activeCategory?.stepNumber || 1,
      category: newQuestionCategory,
      questionNumberLabel: `Custom`,
      title: newQuestionForm.title.trim(),
      subtitle: newQuestionForm.subtitle.trim() || undefined,
      type: newQuestionForm.type,
      required: newQuestionForm.required,
      allowOther: newQuestionForm.allowOther,
      otherPlaceholder: newQuestionForm.otherPlaceholder,
      targetDegreeLevel: newQuestionForm.targetDegreeLevel,
      isCustom: true,
      options: optionsList.length > 0 ? optionsList : undefined
    };

    setDraftConfig((prev) => {
      const nextCategories = prev.categories.map((cat) => {
        if (cat.id !== newQuestionCategory) return cat;
        return {
          ...cat,
          questions: [...cat.questions, newQ]
        };
      });
      return { ...prev, categories: nextCategories };
    });

    setIsAddingQuestion(false);
    setNewQuestionForm({
      title: '',
      subtitle: '',
      type: 'select-grid',
      required: false,
      allowOther: false,
      otherPlaceholder: 'Enter custom details...',
      targetDegreeLevel: 'all',
      initialOptionsStr: 'Option 1\nOption 2\nOption 3'
    });
    markDirty();
    onNotify(`New custom question added to ${newQuestionCategory}!`);
  };

  // General Portal Settings updates
  const handleUpdateGeneralSettings = (field: keyof AssessmentConfig, val: string) => {
    setDraftConfig((prev) => ({
      ...prev,
      [field]: val
    }));
    markDirty();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-100 text-[#EA580C] border border-orange-200">
              Interactive Assessment Manager
            </span>
            {hasUnsavedChanges && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Unsaved Changes
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Assessment Questionnaire & Options Editor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
            Configure every question prompt, description, and selectable option in the Student Eligibility Assessment.
            Changes save to cloud Firestore and instantly update the live applicant questionnaire.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowPreviewModal(!showPreviewModal)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            title="Preview how current questions look"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>{showPreviewModal ? 'Hide Preview' : 'Live Preview'}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Reset questions and options to default"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-2 ${
              hasUnsavedChanges
                ? 'bg-[#EA580C] hover:bg-[#C2410C] shadow-orange-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            } disabled:opacity-50`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Cloud...' : 'Save Assessment Changes'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap gap-1.5">
        {draftConfig.categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setIsAddingQuestion(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive
                  ? 'bg-[#EA580C] text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.id === 'personal_study' && <User className="w-3.5 h-3.5" />}
              {cat.id === 'academic_background' && <GraduationCap className="w-3.5 h-3.5" />}
              {cat.id === 'gap_work_exp' && <Briefcase className="w-3.5 h-3.5" />}
              {cat.id === 'language_requirements' && <Globe2 className="w-3.5 h-3.5" />}
              {cat.id === 'documents_scholarship' && <FileCheck className="w-3.5 h-3.5" />}
              <span>{cat.title.split(':')[1] || cat.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cat.questions.length}
              </span>
            </button>
          );
        })}

        {/* General Portal Settings Tab */}
        <button
          onClick={() => {
            setActiveCategoryId('portal_settings');
            setIsAddingQuestion(false);
          }}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeCategoryId === 'portal_settings'
              ? 'bg-[#EA580C] text-white shadow-sm shadow-orange-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>General Portal Details</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeCategoryId === 'portal_settings' ? (
        /* PORTAL BRANDING & GENERAL SETTINGS */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">
              General Assessment Portal Branding & Copy
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Update titles, descriptions, badges, and disclaimer statements displayed on the public assessment portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Assessment Portal Title</label>
              <input
                type="text"
                value={draftConfig.portalTitle}
                onChange={(e) => handleUpdateGeneralSettings('portalTitle', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Hero Badge Text</label>
              <input
                type="text"
                value={draftConfig.badgeText}
                onChange={(e) => handleUpdateGeneralSettings('badgeText', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Portal Subtitle / Description</label>
              <textarea
                rows={2}
                value={draftConfig.portalSubtitle}
                onChange={(e) => handleUpdateGeneralSettings('portalSubtitle', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Important Disclaimer Notice</label>
              <textarea
                rows={2}
                value={draftConfig.disclaimerText}
                onChange={(e) => handleUpdateGeneralSettings('disclaimerText', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Estimated Completion Time</label>
              <input
                type="text"
                value={draftConfig.estimatedTime}
                onChange={(e) => handleUpdateGeneralSettings('estimatedTime', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] outline-none"
              />
            </div>
          </div>
        </div>
      ) : activeCategory ? (
        /* CATEGORY QUESTION LIST */
        <div className="space-y-6">
          {/* Category Summary Header */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50/40 rounded-2xl border border-orange-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#EA580C]">
                  {activeCategory.title}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeCategory.questions.length} Questions Configured
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                {activeCategory.description}
              </p>
            </div>

            <button
              onClick={() => {
                setNewQuestionCategory(activeCategory.id);
                setIsAddingQuestion(!isAddingQuestion);
              }}
              className="px-3 py-2 text-xs font-bold text-[#EA580C] hover:text-white bg-white hover:bg-[#EA580C] border border-orange-300 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingQuestion ? 'Cancel New Question' : 'Add Question to Category'}</span>
            </button>
          </div>

          {/* Add Question Form Modal / Inline Box */}
          {isAddingQuestion && (
            <form
              onSubmit={handleCreateQuestionSubmit}
              className="bg-white rounded-2xl border-2 border-orange-400 p-5 space-y-4 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Add New Custom Question to {activeCategory.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Question Title / Prompt *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Which scholarship program are you applying for?"
                    value={newQuestionForm.title}
                    onChange={(e) =>
                      setNewQuestionForm({ ...newQuestionForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Question Help Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Select the scholarship authority matching your domicile"
                    value={newQuestionForm.subtitle}
                    onChange={(e) =>
                      setNewQuestionForm({ ...newQuestionForm, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Input Type</label>
                  <select
                    value={newQuestionForm.type}
                    onChange={(e) =>
                      setNewQuestionForm({
                        ...newQuestionForm,
                        type: e.target.value as AssessmentQuestionConfig['type']
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                  >
                    <option value="select-grid">Selection Grid (Buttons / Cards)</option>
                    <option value="radio">Radio Buttons</option>
                    <option value="dropdown">Dropdown Menu</option>
                    <option value="multi-select">Multi-Select Checklist</option>
                    <option value="text">Single-line Text</option>
                    <option value="number">Numeric Input</option>
                    <option value="textarea">Multi-line Paragraph</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Degree Level</label>
                  <select
                    value={newQuestionForm.targetDegreeLevel}
                    onChange={(e) =>
                      setNewQuestionForm({
                        ...newQuestionForm,
                        targetDegreeLevel: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                  >
                    <option value="all">All Applicants (Bachelor & Master)</option>
                    <option value="bachelors">Bachelor Applicants Only</option>
                    <option value="masters">Master Applicants Only</option>
                  </select>
                </div>

                {['select-grid', 'radio', 'dropdown', 'multi-select'].includes(
                  newQuestionForm.type
                ) && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      Initial Options (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={newQuestionForm.initialOptionsStr}
                      onChange={(e) =>
                        setNewQuestionForm({
                          ...newQuestionForm,
                          initialOptionsStr: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newQuestionForm.allowOther}
                      onChange={(e) =>
                        setNewQuestionForm({
                          ...newQuestionForm,
                          allowOther: e.target.checked
                        })
                      }
                      className="rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Allow "Other" free-form text input option</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-xl shadow-xs"
                >
                  Add Question
                </button>
              </div>
            </form>
          )}

          {/* List of Questions in this Category */}
          <div className="space-y-6">
            {activeCategory.questions.map((question, qIdx) => {
              const qDraft = newOptionDrafts[question.id] || {
                label: '',
                value: '',
                description: ''
              };

              return (
                <div
                  key={question.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 sm:p-6 space-y-4"
                >
                  {/* Question Header & Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-orange-100 text-[#EA580C]">
                        {question.questionNumberLabel || `Q${qIdx + 1}`}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Field: <code className="text-[#EA580C] bg-orange-50 px-1 py-0.5 rounded">{question.id}</code>
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Type: {question.type}
                      </span>
                      {question.targetDegreeLevel && question.targetDegreeLevel !== 'all' && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {question.targetDegreeLevel === 'bachelors'
                            ? "Bachelor's Only"
                            : "Master's Only"}
                        </span>
                      )}
                      {question.isCustom && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase bg-purple-100 text-purple-700">
                          Custom Question
                        </span>
                      )}
                    </div>

                    {question.isCustom && (
                      <button
                        onClick={() =>
                          handleDeleteQuestion(activeCategory.id, question.id, question.title)
                        }
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 self-start sm:self-auto hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Question</span>
                      </button>
                    )}
                  </div>

                  {/* Question Prompt Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>Question Title / Prompt</span>
                        <Info className="w-3 h-3 text-slate-400" />
                      </label>
                      <input
                        type="text"
                        value={question.title}
                        onChange={(e) =>
                          handleUpdateQuestion(activeCategory.id, question.id, {
                            title: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>Help Text / Subtitle</span>
                      </label>
                      <input
                        type="text"
                        value={question.subtitle || ''}
                        placeholder="Guidance or context for the student..."
                        onChange={(e) =>
                          handleUpdateQuestion(activeCategory.id, question.id, {
                            subtitle: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#EA580C] outline-none"
                      />
                    </div>
                  </div>

                  {/* Placeholder / Other settings for Text/Number/Dropdown */}
                  {['text', 'number', 'textarea'].includes(question.type) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Input Placeholder</label>
                        <input
                          type="text"
                          value={question.placeholder || ''}
                          onChange={(e) =>
                            handleUpdateQuestion(activeCategory.id, question.id, {
                              placeholder: e.target.value
                            })
                          }
                          className="w-full px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#EA580C] outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Options Section (If question has selectable options) */}
                  {question.options && question.options.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-[#EA580C]" />
                          <h5 className="text-xs font-black uppercase tracking-wider text-slate-700">
                            Answer Options ({question.options.length})
                          </h5>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Click to edit text, reorder, or delete
                        </span>
                      </div>

                      {/* Options Table / List */}
                      <div className="space-y-2">
                        {question.options.map((opt, optIdx) => (
                          <div
                            key={opt.id}
                            className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-2 grow">
                              <span className="text-[11px] font-black text-slate-400 w-5 shrink-0 text-center">
                                {optIdx + 1}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 grow">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                    Option Label
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) =>
                                      handleUpdateOption(activeCategory.id, question.id, opt.id, {
                                        label: e.target.value,
                                        value: opt.value === opt.label ? e.target.value : opt.value
                                      })
                                    }
                                    className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:border-[#EA580C] outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                    Stored Value
                                  </label>
                                  <input
                                    type="text"
                                    value={opt.value}
                                    onChange={(e) =>
                                      handleUpdateOption(activeCategory.id, question.id, opt.id, {
                                        value: e.target.value
                                      })
                                    }
                                    className="w-full px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:border-[#EA580C] outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">
                                    Subtitle / Highlight (optional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 100% Scholarship"
                                    value={opt.description || ''}
                                    onChange={(e) =>
                                      handleUpdateOption(activeCategory.id, question.id, opt.id, {
                                        description: e.target.value
                                      })
                                    }
                                    className="w-full px-2.5 py-1 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg focus:border-[#EA580C] outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Option Row Controls */}
                            <div className="flex items-center gap-1 shrink-0 self-end md:self-center">
                              <button
                                type="button"
                                disabled={optIdx === 0}
                                onClick={() =>
                                  handleMoveOption(activeCategory.id, question.id, optIdx, 'up')
                                }
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-30"
                                title="Move option up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={optIdx === question.options.length - 1}
                                onClick={() =>
                                  handleMoveOption(activeCategory.id, question.id, optIdx, 'down')
                                }
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-30"
                                title="Move option down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteOption(activeCategory.id, question.id, opt.id)
                                }
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Option Bar */}
                      <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/80 flex flex-col md:flex-row items-center gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 grow w-full">
                          <input
                            type="text"
                            placeholder="New option label (e.g. Ireland)..."
                            value={qDraft.label}
                            onChange={(e) =>
                              setNewOptionDrafts({
                                ...newOptionDrafts,
                                [question.id]: {
                                  ...qDraft,
                                  label: e.target.value,
                                  value: qDraft.value || e.target.value
                                }
                              })
                            }
                            className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-orange-200 rounded-lg focus:border-[#EA580C] outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Value (or leave same)..."
                            value={qDraft.value}
                            onChange={(e) =>
                              setNewOptionDrafts({
                                ...newOptionDrafts,
                                [question.id]: {
                                  ...qDraft,
                                  value: e.target.value
                                }
                              })
                            }
                            className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-orange-200 rounded-lg focus:border-[#EA580C] outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Optional description / highlight..."
                            value={qDraft.description || ''}
                            onChange={(e) =>
                              setNewOptionDrafts({
                                ...newOptionDrafts,
                                [question.id]: {
                                  ...qDraft,
                                  description: e.target.value
                                }
                              })
                            }
                            className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-orange-200 rounded-lg focus:border-[#EA580C] outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddOption(activeCategory.id, question.id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Option</span>
                        </button>
                      </div>

                      {/* Allow Other Option Checkbox */}
                      <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={question.allowOther === true}
                            onChange={(e) =>
                              handleUpdateQuestion(activeCategory.id, question.id, {
                                allowOther: e.target.checked
                              })
                            }
                            className="rounded text-[#EA580C] focus:ring-[#EA580C]"
                          />
                          <span>Allow candidate to choose "Other" with custom text input</span>
                        </label>
                        {question.allowOther && (
                          <input
                            type="text"
                            value={question.otherPlaceholder || ''}
                            placeholder="Other input placeholder..."
                            onChange={(e) =>
                              handleUpdateQuestion(activeCategory.id, question.id, {
                                otherPlaceholder: e.target.value
                              })
                            }
                            className="px-2.5 py-1 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Floating Save Footer when Dirty */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 animate-bounce-subtle">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold">You have unsaved questionnaire modifications</span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save to Firestore'}</span>
          </button>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#EA580C]" /> Live Preview: {activeCategory?.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Simulated appearance in prospective student evaluation flow
              </p>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            {activeCategory?.questions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-[#EA580C]">{q.questionNumberLabel || `Q${idx + 1}`}.</span>
                  <span>{q.title}</span>
                </label>
                {q.subtitle && (
                  <p className="text-[11px] text-slate-500 font-medium -mt-1">{q.subtitle}</p>
                )}

                {/* Simulated Options */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-orange-400 cursor-default bg-slate-50"
                      >
                        <div className="text-xs font-bold text-slate-800">{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    ))}
                    {q.allowOther && (
                      <div className="p-2.5 rounded-xl border border-dashed border-slate-300 text-left bg-slate-50/50">
                        <div className="text-xs font-bold text-slate-500">Other (Custom)</div>
                      </div>
                    )}
                  </div>
                )}

                {['text', 'number'].includes(q.type) && (
                  <input
                    type="text"
                    disabled
                    placeholder={q.placeholder || 'Student input field...'}
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
