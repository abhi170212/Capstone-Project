'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
}

export default function SearchBar({ onSearch, onCategoryFilter }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryFilter(category);
  };

  return (
    <div className="bg-[#DCCCAC] rounded-2xl p-6 border border-[#546B41]/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search destinations..."
            className="w-full pl-10 pr-4 py-3 bg-[#FFF8EC] text-black border border-[#546B41] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546B41] transition-all placeholder:text-black/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2">
          {['all', 'eco', 'cultural'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-200 border-2 ${
                selectedCategory === category
                  ? 'bg-[#99AD7A] text-black border-[#546B41]'
                  : 'bg-[#FFF8EC] text-black border-transparent hover:bg-[#99AD7A]/50'
              }`}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-black">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-[#99AD7A] text-black border border-[#546B41] font-bold text-sm rounded-full">
                Search: {searchQuery}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-[#99AD7A] text-black border border-[#546B41] font-bold text-sm rounded-full">
                Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              onSearch('');
              onCategoryFilter('all');
            }}
            className="text-sm font-bold text-black underline decoration-[#546B41] hover:text-[#546B41]"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
