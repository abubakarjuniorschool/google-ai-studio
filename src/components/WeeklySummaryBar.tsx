import React from 'react';
import { Moment, Person } from '../types';
import { Sparkles, Camera, Film, Flame, Users, Calendar } from 'lucide-react';
import { getWeekRangeLabel } from '../utils/dateUtils';

interface WeeklySummaryBarProps {
  activeWeek: number | 'all';
  moments: Moment[];
  people: Person[];
  onOpenRecap: () => void;
}

export const WeeklySummaryBar: React.FC<WeeklySummaryBarProps> = ({
  activeWeek,
  moments,
  people,
  onOpenRecap,
}) => {
  const filteredMoments = moments.filter((m) =>
    activeWeek === 'all' ? true : m.weekNumber === activeWeek
  );

  const totalPhotos = filteredMoments.reduce((acc, m) => acc + (m.photos?.length || 0), 0);
  const activeAuthorsCount = new Set(filteredMoments.map((m) => m.personId)).size;

  // Find most frequent mood
  const moodCounts: Record<string, { count: number; emoji: string; label: string }> = {};
  filteredMoments.forEach((m) => {
    if (m.mood) {
      if (!moodCounts[m.mood.id]) {
        moodCounts[m.mood.id] = { count: 0, emoji: m.mood.emoji, label: m.mood.label };
      }
      moodCounts[m.mood.id].count++;
    }
  });

  const topMood = Object.values(moodCounts).sort((a, b) => b.count - a.count)[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white p-5 sm:p-6 mb-6 shadow-sm border border-stone-800">
      {/* Decorative Subtle Background Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {activeWeek === 'all' ? 'All Time Highlights' : `Weekly Digest`}
            </span>
            <span className="text-xs text-stone-400">
              {activeWeek === 'all' ? 'Archive' : getWeekRangeLabel(activeWeek)}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Newsreader',serif] tracking-tight text-white">
            {activeWeek === 'all'
              ? 'A living visual anthology of candid moments'
              : `Shared memories & moments from Week ${activeWeek}`}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Every week, friends and contributors share their film scans, coffee walks, outdoor escapes, and quiet reflections.
          </p>
        </div>

        {/* Stats & Story Trigger */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10">
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Photos</p>
              <p className="text-base font-bold text-white">{totalPhotos}</p>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Moments</p>
              <p className="text-base font-bold text-white">{filteredMoments.length}</p>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">People</p>
              <p className="text-base font-bold text-white">{activeAuthorsCount}</p>
            </div>
            {topMood && (
              <>
                <div className="w-px h-7 bg-white/10 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Vibe</p>
                  <p className="text-base font-bold text-amber-300">{topMood.emoji}</p>
                </div>
              </>
            )}
          </div>

          <button
            id="btn-summary-play-recap"
            onClick={onOpenRecap}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
          >
            <Film className="w-4 h-4" />
            <span>Play Weekly Reel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
