import React from 'react';
import { Moment, Person, MomentPhoto } from '../types';
import { MapPin, Expand, Heart } from 'lucide-react';

interface PhotoWallProps {
  moments: Moment[];
  peopleMap: Record<string, Person>;
  onPhotoClick: (photo: MomentPhoto, allPhotos: MomentPhoto[], index: number) => void;
}

export const PhotoWall: React.FC<PhotoWallProps> = ({
  moments,
  peopleMap,
  onPhotoClick,
}) => {
  // Collect all photos with parent moment reference
  const allPhotoItems: { photo: MomentPhoto; moment: Moment; author?: Person }[] = [];

  moments.forEach((moment) => {
    const author = peopleMap[moment.personId];
    moment.photos.forEach((photo) => {
      allPhotoItems.push({ photo, moment, author });
    });
  });

  const photoList = allPhotoItems.map((item) => item.photo);

  if (allPhotoItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-6">
        <p className="text-stone-500 text-sm">No photos found for the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allPhotoItems.map((item, index) => {
          const { photo, moment, author } = item;
          return (
            <div
              key={`${moment.id}-${photo.id || index}`}
              id={`photo-wall-item-${index}`}
              onClick={() => onPhotoClick(photo, photoList, index)}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer aspect-4/5 flex flex-col justify-end"
            >
              <img
                src={photo.url}
                alt={photo.caption || moment.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Top Week & Mood Badge */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-black/50 text-white backdrop-blur-xs">
                  Week {moment.weekNumber}
                </span>
                {moment.mood && (
                  <span className="text-sm px-1.5 py-0.5 rounded-full bg-white/80 backdrop-blur-xs">
                    {moment.mood.emoji}
                  </span>
                )}
              </div>

              {/* Bottom Details */}
              <div className="relative p-3.5 z-10 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={author?.name || 'Author'}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white/60"
                  />
                  <span className="text-xs font-semibold text-white/90 truncate">
                    {author?.name || 'Contributor'}
                  </span>
                </div>

                <p className="text-xs font-medium line-clamp-2 text-white/95 leading-snug">
                  {photo.caption || moment.title}
                </p>

                {moment.location?.name && (
                  <p className="text-[11px] text-white/75 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {moment.location.name}
                  </p>
                )}
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg backdrop-blur-xs">
                  <Expand className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
