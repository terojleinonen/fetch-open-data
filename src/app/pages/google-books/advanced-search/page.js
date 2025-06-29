'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdvancedSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('');
  const [filter, setFilter] = useState(''); // e.g., ebooks, free-ebooks
  const [printType, setPrintType] = useState(''); // e.g., books, magazines
  const [orderBy, setOrderBy] = useState(''); // e.g., relevance, newest
  const [inPublisher, setInPublisher] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchTerm.trim()) {
      queryParams.set('adv_searchTerm', searchTerm.trim());
    }
    if (language) {
      queryParams.set('adv_lang', language);
    }
    if (filter) {
      queryParams.set('adv_filter', filter);
    }
    if (printType && printType !== 'all') { // 'all' is default, no need to send
      queryParams.set('adv_printType', printType);
    }
    if (orderBy && orderBy !== 'relevance') { // 'relevance' is default, no need to send for that
      queryParams.set('adv_orderBy', orderBy);
    }
    if (inPublisher.trim()) {
      queryParams.set('adv_inPublisher', inPublisher.trim());
    }

    router.push(`/pages/google-books?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color-dark)] via-[var(--hover-accent-color-dark)] to-[var(--accent-color-dark)] py-2">
          Advanced Search
        </h1>
        <p className="text-center text-neutral-400 text-lg">
          Find Stephen King books with more specific criteria.
        </p>
      </header>

      <main className="max-w-2xl mx-auto bg-neutral-800 bg-opacity-40 p-6 md:p-8 rounded-lg shadow-xl border border-neutral-700">
        <form onSubmit={handleSearch} className="space-y-8">
          {/* Input Row 1: Search Term & Publisher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Search Term (in title)
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., The Shining, IT"
                className="w-full p-3 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md shadow-sm text-base focus:ring-2 focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)] placeholder-neutral-400"
              />
            </div>
            <div>
              <label htmlFor="inPublisher" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Publisher
              </label>
              <input
                type="text"
                id="inPublisher"
                value={inPublisher}
                onChange={(e) => setInPublisher(e.target.value)}
                placeholder="e.g., Viking, Scribner"
                className="w-full p-3 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md shadow-sm text-base focus:ring-2 focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)] placeholder-neutral-400"
              />
            </div>
          </div>

          {/* Input Row 2: Language & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md shadow-sm text-base focus:ring-2 focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)]"
              >
                <option value="">Any Language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Availability / Viewability
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-3 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md shadow-sm text-base focus:ring-2 focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)]"
              >
                <option value="">Any</option>
                <option value="partial">Partial Preview</option>
                <option value="full">Full Preview</option>
                <option value="ebooks">Ebooks (Paid or Free)</option>
                <option value="free-ebooks">Free Ebooks</option>
                <option value="paid-ebooks">Paid Ebooks</option>
              </select>
            </div>
          </div>

          {/* Input Row 3: Print Type & Order By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="printType" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Print Type
              </label>
              <select
                id="printType"
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                className="w-full p-3 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md shadow-sm text-base focus:ring-2 focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)]"
              >
                <option value="all">All Types</option>
                <option value="books">Books</option>
                <option value="magazines">Magazines</option>
              </select>
            </div>
            <div>
              <label htmlFor="orderBy" className="block text-sm font-semibold text-neutral-300 mb-1.5">
                Order By
              </label>
              <select
                id="orderBy"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="w-full p-3 bg-neutral-700 text-neutral-100 border border-neutral-600 rounded-md shadow-sm text-base focus:ring-2 focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)]"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-neutral-700 mt-8">
            <Link href="/pages/google-books" className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-[var(--accent-color-dark)] rounded-md hover:bg-neutral-700 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--accent-color-dark)] text-white font-semibold rounded-md shadow-md hover:bg-[var(--hover-accent-color-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color-dark)] focus:ring-offset-[var(--background-color-dark)]"
            >
              Search
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}