import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Eye, Sparkles, Filter, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { PdfDocument } from '../types';

export const PdfDownloadsSection: React.FC = () => {
  const { pdfDocuments } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewingPdf, setViewingPdf] = useState<PdfDocument | null>(null);

  const categories = ['All', 'Brochure', 'Visa Guide', 'Scholarship Form', 'Fee Structure', 'Admission Guide'];

  const filteredPdfs = selectedCategory === 'All'
    ? pdfDocuments
    : pdfDocuments.filter(pdf => pdf.category === selectedCategory);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 text-[#EA580C] text-xs font-bold uppercase tracking-wider border border-orange-500/20">
            <FileText className="w-3.5 h-3.5 text-[#EA580C]" /> Official Downloads & Prospectuses
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Official University PDFs & Admission Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Download verified fee structures, campus prospectuses, visa step-by-step guides, and scholarship forms uploaded by our university partners.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All PDFs' : cat}
            </button>
          ))}
        </div>

        {/* PDF Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Accent top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EA580C] to-amber-500" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-orange-50 text-[#EA580C] text-[10px] font-bold rounded-full uppercase border border-orange-100">
                    {pdf.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {pdf.fileSize}
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#EA580C] transition-colors">
                      {pdf.title}
                    </h3>
                    {pdf.universityName && (
                      <p className="text-xs text-[#EA580C] font-semibold mt-0.5">{pdf.universityName}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {pdf.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Uploaded: {pdf.uploadDate}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingPdf(pdf)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> Preview
                  </button>
                  <a
                    href={pdf.fileUrl && pdf.fileUrl !== '#' ? pdf.fileUrl : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-200" /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Public PDF Preview Modal */}
        {viewingPdf && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white max-w-3xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
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

              <div className="flex-1 overflow-hidden bg-slate-100 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[350px]">
                <FileText className="w-20 h-20 text-slate-400 mb-4" />
                <h4 className="text-base font-bold text-slate-800 text-center max-w-md">{viewingPdf.title}</h4>
                <p className="text-xs text-slate-500 text-center max-w-md mt-1 mb-6 leading-relaxed">{viewingPdf.description}</p>
                <a
                  href={viewingPdf.fileUrl && viewingPdf.fileUrl !== '#' ? viewingPdf.fileUrl : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-amber-200" /> View Full PDF Document
                </a>
              </div>

              <div className="pt-2 flex justify-end shrink-0">
                <button onClick={() => setViewingPdf(null)} className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
