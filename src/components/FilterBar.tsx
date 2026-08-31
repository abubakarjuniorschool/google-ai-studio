import React from 'react';
import { FilterState, Person, Mood } from '../types';
import { MOODS } from '../data/mockData';
import { X, Search, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  people: Person[];
  availableWeeks: number[];
  onClose: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  people,
  availableWeeks,
  onClose,
}) => {
  const sortedWeeks = [...availableWeeks].sort((a, b) => b - a);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 mb-6 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900">Explore & Filter Moments</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
            Keywords & Locations
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search coffee, mountains..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Person Selector */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
            Contributor
          </label>
          <select
            value={filters.selectedPersonId}
            onChange={(e) => onFilterChange({ selectedPersonId: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-stone-800"
          >
            <option value="all">All People</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.username})
              </option>
            ))}
          </select>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
            Mood & Atmosphere
          </label>
          <select
            value={filters.selectedMood}
            onChange={(e) => onFilterChange({ selectedMood: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-stone-800"
          >
            <option value="all">All Moods</option>
            {MOODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Highlights Only Toggle */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.onlyHighlights}
              onChange={(e) => onFilterChange({ onlyHighlights: e.target.checked })}
              className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500 border-stone-300"
            />
            <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Weekly Highlights Only</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
