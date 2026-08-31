import React, { useEffect, useState } from 'react';
import { MomentPhoto, Person, Moment } from '../types';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, MapPin, Calendar, Heart } from 'lucide-react';
import { formatDatePretty } from '../utils/dateUtils';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: MomentPhoto | null;
  photosList: MomentPhoto[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  moments: Moment[];
  peopleMap: Record<string, Person>;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  photo,
  photosList,
  currentIndex,
  onNavigate,
  moments,
  peopleMap,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Find parent moment
  const parentMoment = moments.find((m) =>
    m.photos.some((p) => p.url === photo?.url || (photo?.id && p.id === photo.id))
  );
  const author = parentMoment ? peopleMap[parentMoment.personId] : undefined;

  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < photosList.length - 1) {
        onNavigate(currentIndex + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photosList.length]);

  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between">
      {/* Top Header */}
      <div className="p-4 sm:px-6 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          {author && (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/50"
            />
          )}
          <div>
            <p className="text-sm font-bold text-white">
              {author?.name || 'Moment Photo'}
            </p>
            <p className="text-xs text-stone-400">
              {parentMoment ? `${parentMoment.weekLabel} • ${formatDatePretty(parentMoment.date)}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs flex items-center gap-1"
            title="Toggle zoom"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            download="moment-photo.jpg"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs flex items-center gap-1"
            title="Open full image in new tab"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden select-none">
        <img
          src={photo.url}
          alt={photo.caption || 'Expanded photo'}
          className={`max-h-[75vh] max-w-full object-contain transition-all duration-300 rounded-lg ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all"
            title="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < photosList.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-all"
            title="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Photo Caption Bar */}
      <div className="p-4 sm:px-6 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {photo.caption && (
              <p className="text-sm sm:text-base font-semibold font-['Newsreader',serif]">
                {photo.caption}
              </p>
            )}
            {parentMoment?.location?.name && (
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {parentMoment.location.name}
                {parentMoment.location.city ? `, ${parentMoment.location.city}` : ''}
              </p>
            )}
          </div>

          <div className="text-xs text-stone-400 font-medium">
            {currentIndex + 1} of {photosList.length}
          </div>
        </div>
      </div>
    </div>
  );
};
