import React from 'react';
import { Person, Moment } from '../types';
import { MapPin, Camera, Sparkles, UserPlus } from 'lucide-react';

interface PeopleDirectoryProps {
  people: Person[];
  moments: Moment[];
  onSelectPerson: (personId: string) => void;
  selectedPersonId: string | 'all';
}

export const PeopleDirectory: React.FC<PeopleDirectoryProps> = ({
  people,
  moments,
  onSelectPerson,
  selectedPersonId,
}) => {
  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Newsreader',serif]">
            Contributors & Community
          </h2>
          <p className="text-xs text-stone-500">
            The people sharing their weekly photographs, notes, and highlights.
          </p>
        </div>

        {selectedPersonId !== 'all' && (
          <button
            onClick={() => onSelectPerson('all')}
            className="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-all self-start sm:self-auto"
          >
            Show All People
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {people.map((person) => {
          const personMoments = moments.filter((m) => m.personId === person.id);
          const totalPhotos = personMoments.reduce((acc, m) => acc + (m.photos?.length || 0), 0);
          const isSelected = selectedPersonId === person.id;

          return (
            <div
              key={person.id}
              id={`person-card-${person.id}`}
              className={`bg-white rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'border-stone-200/90 shadow-xs hover:shadow-md'
              }`}
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative shrink-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100"
                    />
                    {person.role === 'Journal Curator' && (
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-amber-600 text-white text-[9px] font-bold">
                        Curator
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 text-base truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium truncate">
                      {person.username}
                    </p>
                    <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      {person.location}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                  {person.bio}
                </p>

                {/* Latest Moment Snippet */}
                {personMoments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                      Recent weekly captures
                    </p>
                    <div className="flex gap-1.5 overflow-hidden rounded-xl">
                      {personMoments
                        .flatMap((m) => m.photos)
                        .slice(0, 3)
                        .map((photo, i) => (
                          <div key={photo.id || i} className="w-1/3 aspect-square bg-stone-100 overflow-hidden">
                            <img
                              src={photo.url}
                              alt="Recent moment"
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats & Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-stone-600">
                  <span className="font-medium">
                    <strong className="text-stone-900 font-bold">{personMoments.length}</strong> moments
                  </span>
                  <span>•</span>
                  <span className="font-medium">
                    <strong className="text-stone-900 font-bold">{totalPhotos}</strong> photos
                  </span>
                </div>

                <button
                  onClick={() => onSelectPerson(person.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
                  }`}
                >
                  {isSelected ? 'Viewing' : 'View Feed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
