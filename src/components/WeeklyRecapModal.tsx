import React, { useState, useEffect, useRef } from 'react';
import { Moment, Person } from '../types';
import { X, ChevronLeft, ChevronRight, Play, Pause, Heart, Sparkles, Volume2, VolumeX, MapPin } from 'lucide-react';
import { getWeekRangeLabel } from '../utils/dateUtils';

interface WeeklyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  moments: Moment[];
  peopleMap: Record<string, Person>;
  activeWeek: number | 'all';
}

export const WeeklyRecapModal: React.FC<WeeklyRecapModalProps> = ({
  isOpen,
  onClose,
  moments,
  peopleMap,
  activeWeek,
}) => {
  // Filter moments for recap reel (highlights first or all available)
  const recapMoments = moments.filter((m) =>
    activeWeek === 'all' ? true : m.weekNumber === activeWeek
  );

  // Flatten into slides (each slide is a highlight photo + moment)
  const slides: {
    photoUrl: string;
    caption?: string;
    moment: Moment;
    author?: Person;
  }[] = [];

  recapMoments.forEach((m) => {
    const author = peopleMap[m.personId];
    m.photos.forEach((p) => {
      slides.push({
        photoUrl: p.url,
        caption: p.caption || m.title,
        moment: m,
        author,
      });
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen, activeWeek]);

  // Slide timer loop
  useEffect(() => {
    if (!isOpen || !isPlaying || slides.length === 0) return;

    timerRef.current = setTimeout(() => {
      if (currentIndex < slides.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // finished reel
        setIsPlaying(false);
      }
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, isPlaying, currentIndex, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, slides.length]);

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
      {/* Background Ambience Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${currentSlide.photoUrl})` }}
      />

      {/* Main Story Container */}
      <div className="relative w-full max-w-md h-full sm:h-[88vh] sm:max-h-[760px] bg-stone-950 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
        {/* Story Progress Indicators */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5 px-1">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all ${
                  idx < currentIndex
                    ? 'w-full'
                    : idx === currentIndex
                    ? isPlaying
                      ? 'w-full transition-all ease-linear'
                      : 'w-1/2'
                    : 'w-0'
                }`}
                style={{
                  transitionDuration:
                    idx === currentIndex && isPlaying ? `${SLIDE_DURATION}ms` : '0ms',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Bar */}
        <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={
                currentSlide.author?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
              }
              alt={currentSlide.author?.name || 'Author'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white shadow-xs">
                  {currentSlide.author?.name || 'Abubakar'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/80 text-white font-bold">
                  Week {currentSlide.moment.weekNumber}
                </span>
              </div>
              <p className="text-[11px] text-white/80">
                {currentSlide.moment.weekLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/70" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-all"
              title="Close Story"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Media Photo View */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={currentSlide.photoUrl}
            alt={currentSlide.caption || 'Weekly moment'}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Left / Right Tap Areas for Navigation */}
          <div
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
          />
          <div
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-2/3 z-20 cursor-pointer"
          />

          {/* Heart Burst Animation */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-xl" />
            </div>
          )}
        </div>

        {/* Bottom Caption & Moment Details */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pt-10">
          <div className="flex items-center gap-2 mb-1.5">
            {currentSlide.moment.mood && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs flex items-center gap-1 text-amber-300">
                <span>{currentSlide.moment.mood.emoji}</span>
                <span>{currentSlide.moment.mood.label}</span>
              </span>
            )}
            {currentSlide.moment.location?.name && (
              <span className="text-xs text-white/80 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-amber-400" />
                {currentSlide.moment.location.name}
              </span>
            )}
          </div>

          <h4 className="text-base font-bold font-['Newsreader',serif] leading-snug">
            {currentSlide.caption}
          </h4>

          {currentSlide.moment.description && (
            <p className="text-xs text-white/80 mt-1 line-clamp-2 leading-relaxed">
              {currentSlide.moment.description}
            </p>
          )}

          {/* Story Reaction Bar */}
          <div className="mt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-white/60">
              {currentIndex + 1} of {slides.length} moments
            </span>

            <button
              onClick={handleHeartClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs text-xs font-semibold transition-all active:scale-125"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Celebrate</span>
            </button>
          </div>
        </div>

        {/* Desktop Side Nav Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={currentIndex === 0}
          className="hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-xs disabled:opacity-20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={currentIndex === slides.length - 1}
          className="hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-xs disabled:opacity-20 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
