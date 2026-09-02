import React, { useState } from 'react';
import { BookOpen, Search, Clock, ArrowRight, X } from 'lucide-react';
import { BlogPost } from '../types';
import { useContent } from '../context/ContentContext';

export const BlogHub: React.FC = () => {
  const { blogPosts } = useContent();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogSearch, setBlogSearch] = useState('');

  const filtered = blogPosts.filter((b) =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    b.category.toLowerCase().includes(blogSearch.toLowerCase())
  );

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> 100+ SEO Knowledge Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dubai Study Abroad Knowledge Base
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-base max-w-2xl">
              In-depth articles covering costs, visa guidelines, student accommodation, and high-paying jobs in Dubai.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. Visa, Costs)..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={post.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg">
                  {post.category}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime} • {post.date}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                    {post.snippet}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article View Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="bg-indigo-600 text-white font-bold text-xs px-3 py-1 rounded-lg inline-block">
              {selectedPost.category}
            </span>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedPost.title}</h3>

            <p className="text-xs text-slate-400 font-semibold">By {selectedPost.author} • {selectedPost.date}</p>

            <img
              src={selectedPost.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80'}
              alt={selectedPost.title}
              className="w-full h-56 object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />

            <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-4">
              <p>{selectedPost.snippet}</p>
              <p>{selectedPost.content}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
