import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  FolderOpen,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  Search,
  Filter,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  Info,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { MediaItem, MediaCategory } from '../types';
import { formatBytes } from '../lib/firebase';

interface ImageUploadFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  category?: MediaCategory;
  recommendedDimensions?: string;
  placeholder?: string;
  associatedEntityId?: string;
  associatedEntityTitle?: string;
  className?: string;
  helpText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  id,
  label,
  value,
  onChange,
  category = 'general',
  recommendedDimensions,
  placeholder = 'https://...',
  associatedEntityId,
  associatedEntityTitle,
  className = '',
  helpText
}) => {
  const { uploadMediaItem } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadMediaItem(
        file,
        {
          category,
          associatedEntityId,
          associatedEntityTitle: associatedEntityTitle || label
        },
        (progress) => {
          setUploadProgress(progress);
        }
      );

      onChange(result.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const copyUrlToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasImage = Boolean(value && value.trim().length > 0);

  return (
    <div className={`space-y-1.5 ${className}`} id={id}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>{label}</span>
          {recommendedDimensions && (
            <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {recommendedDimensions}
            </span>
          )}
        </label>
        <div className="flex items-center gap-2">
          {hasImage && (
            <button
              type="button"
              onClick={copyUrlToClipboard}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              title="Copy Image URL"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#EA580C] hover:underline font-medium"
          >
            {showUrlInput ? 'Hide URL' : 'Edit URL'}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Preview & Action Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-3 transition-all ${
          isDragging
            ? 'border-[#EA580C] bg-orange-50/50 scale-[0.99]'
            : hasImage
            ? 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
            : 'border-slate-300 bg-slate-50/40 hover:border-[#EA580C]/60 hover:bg-orange-50/20'
        }`}
      >
        {isUploading ? (
          <div className="py-4 text-center">
            <div className="w-10 h-10 border-3 border-orange-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-2.5" />
            <p className="text-xs font-bold text-slate-800 mb-1">Uploading Image to Cloud Storage...</p>
            <div className="w-48 max-w-full bg-slate-200 rounded-full h-2 mx-auto overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-[#EA580C] h-full transition-all duration-200 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-semibold">{uploadProgress}% complete</p>
          </div>
        ) : hasImage ? (
          <div className="flex items-center gap-3">
            {/* Thumbnail Preview */}
            <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300 shadow-xs group">
              <img
                src={value}
                alt={label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                title="View Full Size Image"
              >
                <Eye className="w-4 h-4" />
              </a>
            </div>

            {/* Image Details & Replacement Controls */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate" title={value}>
                {value.startsWith('http') ? value.split('/').pop()?.split('?')[0] || 'Image' : value}
              </p>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Active Cloud Asset
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#EA580C] hover:text-[#EA580C] text-slate-700 text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                >
                  <UploadCloud className="w-3 h-3" /> Replace from PC
                </button>
                <button
                  type="button"
                  onClick={() => setShowLibraryModal(true)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-[11px] font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                >
                  <FolderOpen className="w-3 h-3" /> Library
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload Dropzone */
          <div className="py-2.5 flex flex-col items-center justify-center text-center">
            <div className="w-9 h-9 rounded-full bg-orange-100/70 text-[#EA580C] flex items-center justify-center mb-1.5 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">
              Drag & drop or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#EA580C] hover:underline font-extrabold cursor-pointer"
              >
                browse desktop
              </button>
            </p>
            <p className="text-[10px] text-slate-500">Supports PNG, JPG, WebP, SVG, AVIF (Max 15MB)</p>

            <div className="flex items-center gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" /> Upload from Desktop
              </button>
              <button
                type="button"
                onClick={() => setShowLibraryModal(true)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-500" /> Choose from Library
              </button>
            </div>
          </div>
        )}

        {/* Feedback Notices */}
        {uploadSuccess && (
          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Image uploaded successfully and linked!</span>
          </div>
        )}

        {uploadError && (
          <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span className="flex-1">{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-rose-500 hover:text-rose-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Direct URL Input (if toggled open) */}
      {showUrlInput && (
        <div className="pt-1 animate-fadeIn">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
          />
          <p className="text-[10px] text-slate-500 mt-0.5">
            Direct Cloud Storage or CDN image URL.
          </p>
        </div>
      )}

      {helpText && <p className="text-[10px] text-slate-500">{helpText}</p>}

      {/* Media Library Selector Modal */}
      {showLibraryModal && (
        <MediaLibraryModal
          category={category}
          selectedUrl={value}
          onSelect={(selectedUrl) => {
            onChange(selectedUrl);
            setShowLibraryModal(false);
          }}
          onClose={() => setShowLibraryModal(false)}
        />
      )}
    </div>
  );
};

interface MediaLibraryModalProps {
  category?: MediaCategory;
  selectedUrl?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  category = 'general',
  selectedUrl,
  onSelect,
  onClose
}) => {
  const { mediaItems, uploadMediaItem } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activePreviewItem, setActivePreviewItem] = useState<MediaItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'universities', label: 'Universities' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'accommodations', label: 'Housing' },
    { id: 'webinars', label: 'Webinars' },
    { id: 'general', label: 'General' }
  ];

  const filteredItems = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.associatedEntityTitle && item.associatedEntityTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = files[0];
      const newItem = await uploadMediaItem(
        file,
        {
          category: selectedCategory === 'all' ? category : (selectedCategory as MediaCategory)
        },
        (progress) => setUploadProgress(progress)
      );
      setActivePreviewItem(newItem);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Select Image from Media Library</h3>
              <p className="text-xs text-slate-500">
                Choose an existing uploaded cloud image or upload a new one directly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#EA580C] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Actions & Search */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-1.5 bg-[#EA580C] hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer flex-shrink-0"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading ({uploadProgress}%)</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload New</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">No media files found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {searchQuery
                  ? `No images match your search query "${searchQuery}".`
                  : 'Upload an image from your computer to start building your persistent cloud media library.'}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs"
              >
                <UploadCloud className="w-4 h-4" /> Upload Image from PC
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredItems.map((item) => {
                const isSelected = activePreviewItem?.id === item.id || selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActivePreviewItem(item)}
                    className={`group relative rounded-xl border-2 overflow-hidden bg-slate-100 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#EA580C] ring-2 ring-orange-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                    }`}
                  >
                    {/* Image Preview Container */}
                    <div className="aspect-video w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.altText || item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="p-2 bg-white">
                      <p className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium">
                        <span>{item.sizeFormatted || 'Cloud image'}</span>
                        <span className="capitalize">{item.category || 'general'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {activePreviewItem ? (
              <span className="font-semibold text-slate-900">
                Selected: <span className="text-[#EA580C]">{activePreviewItem.name}</span>
              </span>
            ) : (
              <span>Click on any image to select</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!activePreviewItem}
              onClick={() => {
                if (activePreviewItem) {
                  onSelect(activePreviewItem.url);
                }
              }}
              className="px-5 py-2 bg-[#EA580C] disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MediaLibraryTab: React.FC = () => {
  const { mediaItems, uploadMediaItem, deleteMediaItem, updateMediaItem } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit metadata modal state
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Images', count: mediaItems.length },
    { id: 'universities', label: 'Universities', count: mediaItems.filter((m) => m.category === 'universities').length },
    { id: 'destinations', label: 'Destinations', count: mediaItems.filter((m) => m.category === 'destinations').length },
    { id: 'blogs', label: 'Blogs & Guides', count: mediaItems.filter((m) => m.category === 'blogs').length },
    { id: 'testimonials', label: 'Testimonials', count: mediaItems.filter((m) => m.category === 'testimonials').length },
    { id: 'accommodations', label: 'Housing', count: mediaItems.filter((m) => m.category === 'accommodations').length },
    { id: 'webinars', label: 'Webinars', count: mediaItems.filter((m) => m.category === 'webinars').length },
    { id: 'general', label: 'General', count: mediaItems.filter((m) => m.category === 'general' || !m.category).length }
  ];

  const filteredItems = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.associatedEntityTitle && item.associatedEntityTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadMediaItem(
          file,
          {
            category: selectedCategory === 'all' ? 'general' : (selectedCategory as MediaCategory)
          },
          (pct) => setUploadProgress(pct)
        );
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image file(s).');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: MediaItem) => {
    setIsDeleting(true);
    try {
      await deleteMediaItem(item);
      setDeleteConfirmId(null);
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    } catch (err: any) {
      alert(`Could not delete image: ${err?.message || 'Please try again'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!editingItem) return;
    try {
      await updateMediaItem(editingItem.id, {
        name: editingItem.name,
        altText: editingItem.altText,
        category: editingItem.category
      });
      setEditingItem(null);
    } catch (err: any) {
      alert(`Could not update metadata: ${err?.message || 'Please try again'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Cloud Storage Active
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                Persistent Database
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Media & Image Library</h2>
            <p className="text-slate-300 text-xs mt-1 max-w-xl leading-relaxed">
              Upload images directly from your desktop. All assets are safely stored in Firebase Cloud Storage and referenced dynamically in Firestore so they persist across code pushes and redeployments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-3 bg-[#EA580C] hover:bg-orange-600 text-white rounded-2xl text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading ({uploadProgress}%)</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload from Desktop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          isDragging
            ? 'border-[#EA580C] bg-orange-50/70 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-[#EA580C]/70 hover:bg-slate-50/50'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          Drag & drop images here or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[#EA580C] underline font-extrabold cursor-pointer"
          >
            browse your desktop
          </button>
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Upload individual images or multiple files simultaneously. Files are processed and stored with high-speed CDN URLs.
        </p>

        {isUploading && (
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Uploading to Firebase Cloud Storage...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-[#EA580C] h-full transition-all duration-200 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-orange-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by file name or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>
      </div>

      {/* Media Grid / Gallery */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No media items in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No images match your search for "${searchQuery}".`
              : 'Upload images from your computer using the upload button above.'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs"
          >
            <UploadCloud className="w-4 h-4" /> Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col group ${
                  isSelected
                    ? 'border-[#EA580C] shadow-lg ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Thumbnail & Quick Actions */}
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.altText || item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Bar on Card */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase rounded-md pointer-events-auto">
                      {item.category || 'general'}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-6 h-6 rounded-md bg-black/60 text-white hover:bg-[#EA580C] flex items-center justify-center transition-colors pointer-events-auto opacity-0 group-hover:opacity-100"
                      title="Open full size"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Hover Overlay with Copy & Select */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="flex-1 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-xs transition-colors"
                        title="Edit Metadata"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg shadow-xs transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Caption / Meta info */}
                <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    {item.altText && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.altText}</p>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.sizeFormatted || 'Cloud image'}</span>
                    <span>{item.uploadedAt?.split(',')[0] || ''}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 text-center mb-1">
              Delete Image Permanently?
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6">
              This will remove the file from Firebase Cloud Storage and delete its database record. Any content currently referencing this URL will need to be updated.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  const target = mediaItems.find((m) => m.id === deleteConfirmId);
                  if (target) handleDelete(target);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-[#EA580C]" /> Edit Image Metadata
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">File Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  placeholder="e.g. University of Oxford Campus Aerial View"
                  value={editingItem.altText || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={editingItem.category || 'general'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#EA580C]"
                >
                  <option value="general">General</option>
                  <option value="universities">Universities</option>
                  <option value="destinations">Destinations</option>
                  <option value="blogs">Blogs & Articles</option>
                  <option value="testimonials">Testimonials</option>
                  <option value="accommodations">Accommodations / Housing</option>
                  <option value="webinars">Webinars</option>
                  <option value="loans">Loan Providers</option>
                  <option value="branding">Branding</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Direct Cloud URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={editingItem.url}
                    className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(editingItem.url, editingItem.id)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    {copiedId === editingItem.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMetadata}
                className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
