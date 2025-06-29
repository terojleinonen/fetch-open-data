'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdvancedSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    // Construct a query string that the Google Books page can parse
    // We'll use `adv_searchTerm` to distinguish it from the regular search
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) {
      queryParams.set('adv_searchTerm', searchTerm.trim());
    }
    // Potentially add more advanced search parameters here in the future

    router.push(`/pages/google-books?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color-dark)] via-[var(--hover-accent-color-dark)] to-[var(--accent-color-dark)] py-2">
          Advanced Search for Stephen King Books
        </h1>
      </header>

      <main className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-neutral-300 mb-1">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., The Stand, IT, Carrie"
              className="w-full p-3 bg-[var(--background-color-dark)] text-[var(--text-color-dark)] border border-[var(--shadow-color-dark)] rounded-md shadow-sm text-base focus:ring-[var(--accent-color-dark)] focus:border-[var(--accent-color-dark)] placeholder-gray-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Link href="/pages/google-books" className="text-sm text-[var(--accent-color-dark)] hover:text-[var(--hover-accent-color-dark)]">
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
