import React from 'react';
import { Moment, Person, MomentPhoto } from '../types';
import { getWeekRangeLabel, formatDatePretty } from '../utils/dateUtils';
import { Calendar, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';

interface TimelineViewProps {
  moments: Moment[];
  peopleMap: Record<string, Person>;
  onPhotoClick: (photo: MomentPhoto, allPhotos: MomentPhoto[], index: number) => void;
  onPersonClick: (personId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  moments,
  peopleMap,
  onPhotoClick,
  onPersonClick,
}) => {
  // Group moments by week
  const groupedByWeek: Record<number, Moment[]> = {};
  moments.forEach((m) => {
    if (!groupedByWeek[m.weekNumber]) {
      groupedByWeek[m.weekNumber] = [];
    }
    groupedByWeek[m.weekNumber].push(m);
  });

  const sortedWeeks = Object.keys(groupedByWeek)
    .map(Number)
    .sort((a, b) => b - a);

  if (sortedWeeks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-6">
        <p className="text-stone-500 text-sm">No moments found for the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mb-12">
      {sortedWeeks.map((weekNo) => {
        const weekMoments = groupedByWeek[weekNo];
        const totalPhotos = weekMoments.reduce((acc, m) => acc + (m.photos?.length || 0), 0);

        return (
          <div key={weekNo} className="relative">
            {/* Week Milestone Header */}
            <div className="sticky top-20 z-20 mb-6 bg-stone-50/95 backdrop-blur-xs py-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  W{weekNo}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-['Newsreader',serif]">
                    {getWeekRangeLabel(weekNo)}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {weekMoments.length} moments shared • {totalPhotos} photos
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Stream with vertical border */}
            <div className="relative pl-6 sm:pl-10 space-y-6 border-l-2 border-amber-200/60 ml-4">
              {weekMoments.map((moment) => {
                const author = peopleMap[moment.personId];
                return (
                  <div
                    key={moment.id}
                    className="relative bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all"
                  >
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-white shadow-xs" />

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => onPersonClick(moment.personId)}
                          className="shrink-0"
                        >
                          <img
                            src={
                              author?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
                            }
                            alt={author?.name || 'Author'}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200"
                          />
                        </button>
                        <div>
                          <button
                            onClick={() => onPersonClick(moment.personId)}
                            className="font-bold text-xs text-stone-900 hover:text-amber-700 text-left"
                          >
                            {author?.name || 'Contributor'}
                          </button>
                          <p className="text-[11px] text-stone-400">
                            {formatDatePretty(moment.date)}
                          </p>
                        </div>
                      </div>

                      {moment.mood && (
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${moment.mood.color}`}
                        >
                          {moment.mood.emoji} {moment.mood.label}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-stone-900 font-['Newsreader',serif]">
                      {moment.title}
                    </h4>

                    {moment.description && (
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">
                        {moment.description}
                      </p>
                    )}

                    {/* Compact Photo Thumbnails */}
                    {moment.photos && moment.photos.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {moment.photos.map((photo, pIdx) => (
                          <div
                            key={photo.id || pIdx}
                            onClick={() => onPhotoClick(photo, moment.photos, pIdx)}
                            className="group relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 cursor-pointer"
                          >
                            <img
                              src={photo.url}
                              alt={photo.caption || 'Thumbnail'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {photo.caption && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1.5 truncate">
                                {photo.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {moment.location?.name && (
                      <div className="mt-2.5 text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {moment.location.name}
                        {moment.location.city ? `, ${moment.location.city}` : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
