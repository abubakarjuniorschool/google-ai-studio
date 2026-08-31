import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getWeekRangeLabel } from '../utils/dateUtils';

interface WeekSelectorProps {
  availableWeeks: number[];
  selectedWeek: number | 'all';
  onSelectWeek: (week: number | 'all') => void;
  momentCountsByWeek: Record<number, number>;
  photoCountsByWeek: Record<number, number>;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  availableWeeks,
  selectedWeek,
  onSelectWeek,
  momentCountsByWeek,
  photoCountsByWeek,
}) => {
  const sortedWeeks = [...availableWeeks].sort((a, b) => b - a);
  const currentWeek = sortedWeeks[0] || 35;

  const handlePrevWeek = () => {
    if (selectedWeek === 'all') {
      onSelectWeek(currentWeek);
      return;
    }
    const idx = sortedWeeks.indexOf(selectedWeek);
    if (idx < sortedWeeks.length - 1) {
      onSelectWeek(sortedWeeks[idx + 1]);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek === 'all') {
      onSelectWeek(sortedWeeks[sortedWeeks.length - 1]);
      return;
    }
    const idx = sortedWeeks.indexOf(selectedWeek);
    if (idx > 0) {
      onSelectWeek(sortedWeeks[idx - 1]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Week Navigation Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">
                {selectedWeek === 'all'
                  ? 'All Weekly Memories'
                  : getWeekRangeLabel(selectedWeek)}
              </h2>
              {selectedWeek === currentWeek && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" /> Latest
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              {selectedWeek === 'all'
                ? 'Browsing complete timeline across all weeks'
                : `${momentCountsByWeek[selectedWeek] || 0} moments • ${photoCountsByWeek[selectedWeek] || 0} photos captured`}
            </p>
          </div>
        </div>

        {/* Right: Quick Arrows & Week Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            id="btn-prev-week"
            onClick={handlePrevWeek}
            disabled={selectedWeek === sortedWeeks[sortedWeeks.length - 1]}
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none text-stone-700 transition-all shrink-0"
            title="Earlier Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="pill-week-all"
            onClick={() => onSelectWeek('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedWeek === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
            }`}
          >
            All Weeks
          </button>

          {sortedWeeks.map((week) => {
            const isSelected = selectedWeek === week;
            const count = photoCountsByWeek[week] || 0;
            return (
              <button
                key={week}
                id={`pill-week-${week}`}
                onClick={() => onSelectWeek(week)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                <span>Week {week}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            id="btn-next-week"
            onClick={handleNextWeek}
            disabled={selectedWeek === sortedWeeks[0]}
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none text-stone-700 transition-all shrink-0"
            title="Later Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
