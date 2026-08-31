import React, { useState, useEffect, useMemo } from 'react';
import { Moment, Person, MomentPhoto, ViewMode, FilterState } from './types';
import { INITIAL_PEOPLE, INITIAL_MOMENTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { WeekSelector } from './components/WeekSelector';
import { WeeklySummaryBar } from './components/WeeklySummaryBar';
import { MomentCard } from './components/MomentCard';
import { PhotoWall } from './components/PhotoWall';
import { TimelineView } from './components/TimelineView';
import { PeopleDirectory } from './components/PeopleDirectory';
import { WeeklyRecapModal } from './components/WeeklyRecapModal';
import { LightboxModal } from './components/LightboxModal';
import { NewMomentModal } from './components/NewMomentModal';
import { FilterBar } from './components/FilterBar';
import { GoogleSignInScreen } from './components/GoogleSignInScreen';
import { SignUpPage } from './components/SignUpPage';
import { AuthModal } from './components/AuthModal';
import { EmailVerificationModal } from './components/EmailVerificationModal';
import { EmailVerificationNotice } from './components/EmailVerificationNotice';
import { Sparkles, Plus, Image as ImageIcon, Heart, Camera, RotateCcw, Cloud, CloudCheck, Wifi } from 'lucide-react';
import {
  seedInitialFirestoreData,
  subscribeToMoments,
  subscribeToPeople,
  saveMomentToFirestore,
  updateMomentReactionInFirestore,
  addCommentToMomentInFirestore,
  savePersonToFirestore
} from './lib/firestoreService';
import { subscribeToAuth, signOutUser } from './lib/authService';

const STORAGE_KEY_MOMENTS = 'abubakar_weekly_moments_v1';
const STORAGE_KEY_PEOPLE = 'abubakar_people_v1';

export default function App() {
  const [isSyncing, setIsSyncing] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationEmailTarget, setVerificationEmailTarget] = useState<string>('');

  // Load initial moments & people from localStorage fallback
  const [moments, setMoments] = useState<Moment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MOMENTS);
      return saved ? JSON.parse(saved) : INITIAL_MOMENTS;
    } catch {
      return INITIAL_MOMENTS;
    }
  });

  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PEOPLE);
      return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
    } catch {
      return INITIAL_PEOPLE;
    }
  });

  // Setup Firestore Real-time synchronization & Auth listener
  useEffect(() => {
    let unsubscribeMoments: (() => void) | undefined;
    let unsubscribePeople: (() => void) | undefined;
    let unsubscribeAuth: (() => void) | undefined;

    // Firebase Auth listener
    unsubscribeAuth = subscribeToAuth((user) => {
      if (user) {
        const existingPerson = people.find((p) => p.id === user.uid);
        if (existingPerson) {
          setCurrentUser({
            ...existingPerson,
            email: user.email || undefined,
            emailVerified: user.emailVerified,
            avatar: user.photoURL || existingPerson.avatar
          });
        } else {
          const newPerson: Person = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Contributor',
            username: `@${(user.displayName || user.email?.split('@')[0] || 'user').toLowerCase().replace(/\s+/g, '')}`,
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
            bio: 'Weekly journal contributor',
            location: 'Global',
            accentColor: '#d97706',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            role: 'Contributor',
            email: user.email || undefined,
            emailVerified: user.emailVerified
          };
          setCurrentUser(newPerson);
        }
      } else {
        setCurrentUser(null);
      }
    });

    async function initFirestore() {
      try {
        await seedInitialFirestoreData();

        unsubscribeMoments = subscribeToMoments(
          (liveMoments) => {
            if (liveMoments && liveMoments.length > 0) {
              setMoments(liveMoments);
            }
            setIsCloudConnected(true);
            setIsSyncing(false);
          },
          (err) => {
            console.warn('Moments live subscription issue:', err);
            setIsSyncing(false);
          }
        );

        unsubscribePeople = subscribeToPeople(
          (livePeople) => {
            if (livePeople && livePeople.length > 0) {
              setPeople(livePeople);
            }
            setIsCloudConnected(true);
          },
          (err) => {
            console.warn('People live subscription issue:', err);
          }
        );
      } catch (err) {
        console.warn('Firestore init fallback:', err);
        setIsSyncing(false);
      }
    }

    initFirestore();

    return () => {
      if (unsubscribeMoments) unsubscribeMoments();
      if (unsubscribePeople) unsubscribePeople();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Save to localStorage as offline safety on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MOMENTS, JSON.stringify(moments));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [moments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PEOPLE, JSON.stringify(people));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [people]);

  // People dictionary lookup
  const peopleMap = useMemo(() => {
    const map: Record<string, Person> = {};
    people.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [people]);

  // Available unique weeks
  const availableWeeks: number[] = useMemo(() => {
    const weeks = Array.from(new Set(moments.map((m) => m.weekNumber)));
    return (weeks as number[]).sort((a: number, b: number) => b - a);
  }, [moments]);

  const latestWeek = availableWeeks[0] || 35;

  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<ViewMode>('feed');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedWeek: 35, // default to current week 35
    selectedPersonId: 'all',
    selectedMood: 'all',
    onlyHighlights: false,
  });

  // Modals state
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const [isNewMomentOpen, setIsNewMomentOpen] = useState(false);

  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState<MomentPhoto | null>(null);
  const [lightboxPhotosList, setLightboxPhotosList] = useState<MomentPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Moments Calculation
  const filteredMoments = useMemo(() => {
    return moments.filter((moment) => {
      // Week filter
      if (filters.selectedWeek !== 'all' && moment.weekNumber !== filters.selectedWeek) {
        return false;
      }
      // Person filter
      if (filters.selectedPersonId !== 'all' && moment.personId !== filters.selectedPersonId) {
        return false;
      }
      // Mood filter
      if (filters.selectedMood !== 'all' && moment.mood?.id !== filters.selectedMood) {
        return false;
      }
      // Highlights filter
      if (filters.onlyHighlights && !moment.isHighlight) {
        return false;
      }
      // Search query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const author = peopleMap[moment.personId];
        const matchTitle = moment.title.toLowerCase().includes(q);
        const matchDesc = moment.description?.toLowerCase().includes(q);
        const matchAuthor = author?.name.toLowerCase().includes(q) || author?.username.toLowerCase().includes(q);
        const matchLocation = moment.location?.name?.toLowerCase().includes(q) || moment.location?.city?.toLowerCase().includes(q);
        const matchTags = moment.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchAuthor && !matchLocation && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [moments, filters, peopleMap]);

  // Counts per week for tabs
  const momentCountsByWeek = useMemo(() => {
    const counts: Record<number, number> = {};
    moments.forEach((m) => {
      counts[m.weekNumber] = (counts[m.weekNumber] || 0) + 1;
    });
    return counts;
  }, [moments]);

  const photoCountsByWeek = useMemo(() => {
    const counts: Record<number, number> = {};
    moments.forEach((m) => {
      counts[m.weekNumber] = (counts[m.weekNumber] || 0) + (m.photos?.length || 0);
    });
    return counts;
  }, [moments]);

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.selectedPersonId !== 'all' ? 1 : 0) +
    (filters.selectedMood !== 'all' ? 1 : 0) +
    (filters.onlyHighlights ? 1 : 0);

  // Handlers
  const handleToggleReaction = async (momentId: string, emoji: string) => {
    let nextReactions: Record<string, number> = {};
    let nextUserReacted: Record<string, boolean> = {};

    setMoments((prev) =>
      prev.map((m) => {
        if (m.id !== momentId) return m;
        const userReacted = { ...(m.userReacted || {}) };
        const reactions = { ...(m.reactions || {}) };
        const currentlyReacted = !!userReacted[emoji];

        if (currentlyReacted) {
          userReacted[emoji] = false;
          reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
        } else {
          userReacted[emoji] = true;
          reactions[emoji] = (reactions[emoji] || 0) + 1;
        }

        nextReactions = reactions;
        nextUserReacted = userReacted;
        return { ...m, reactions, userReacted };
      })
    );

    try {
      await updateMomentReactionInFirestore(momentId, nextReactions, nextUserReacted);
    } catch (e) {
      console.warn('Firestore reaction sync note:', e);
    }
  };

  const handleAddComment = async (momentId: string, text: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      authorName: 'Guest Contributor',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      text,
      createdAt: new Date().toISOString(),
    };

    let updatedCommentsList: Moment['comments'] = [];

    setMoments((prev) =>
      prev.map((m) => {
        if (m.id !== momentId) return m;
        const nextComments = [...(m.comments || []), newComment];
        updatedCommentsList = nextComments;
        return {
          ...m,
          comments: nextComments,
        };
      })
    );
    showToast('Note added to weekly moment');

    try {
      await addCommentToMomentInFirestore(momentId, updatedCommentsList);
    } catch (e) {
      console.warn('Firestore comment sync note:', e);
    }
  };

  const handleSaveNewMoment = async (newMoment: Moment, newPerson?: Person) => {
    if (newPerson) {
      setPeople((prev) => [newPerson, ...prev]);
      try {
        await savePersonToFirestore(newPerson);
      } catch (e) {
        console.warn('Firestore person save note:', e);
      }
    }
    setMoments((prev) => [newMoment, ...prev]);
    // switch to the moment's week
    setFilters((prev) => ({
      ...prev,
      selectedWeek: newMoment.weekNumber,
    }));
    showToast(`Published moment for Week ${newMoment.weekNumber}!`);

    try {
      await saveMomentToFirestore(newMoment);
    } catch (e) {
      console.warn('Firestore save moment error:', e);
    }
  };

  const handlePhotoClick = (
    photo: MomentPhoto,
    allPhotos: MomentPhoto[],
    index: number
  ) => {
    setLightboxPhoto(photo);
    setLightboxPhotosList(allPhotos);
    setLightboxIndex(index);
  };

  const handlePersonSelect = (personId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedPersonId: personId,
    }));
    setCurrentView('feed');
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      selectedWeek: 'all',
      selectedPersonId: 'all',
      selectedMood: 'all',
      onlyHighlights: false,
    });
  };

  const handleResetSampleData = () => {
    setMoments(INITIAL_MOMENTS);
    setPeople(INITIAL_PEOPLE);
    showToast('Reset to original weekly journal sample data');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-semibold shadow-xl border border-stone-800 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenNewMoment={() => setIsNewMomentOpen(true)}
        onOpenRecap={() => setIsRecapOpen(true)}
        searchQuery={filters.search}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, search: q }))}
        activeFilterCount={activeFilterCount}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        isCloudConnected={isCloudConnected}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenGoogleSignIn={() => setCurrentView('google-signin')}
        onSignOut={async () => {
          await signOutUser();
          setCurrentUser(null);
          showToast('Signed out of Abubakar');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Weekly Highlight Banner */}
        <WeeklySummaryBar
          activeWeek={filters.selectedWeek}
          moments={moments}
          people={people}
          onOpenRecap={() => setIsRecapOpen(true)}
        />

        {/* Filter Drawer (if toggled) */}
        {showFilters && (
          <FilterBar
            filters={filters}
            onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
            onResetFilters={handleResetFilters}
            people={people}
            availableWeeks={availableWeeks}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Week Selector Ribbon */}
        <WeekSelector
          availableWeeks={availableWeeks}
          selectedWeek={filters.selectedWeek}
          onSelectWeek={(w) => setFilters((prev) => ({ ...prev, selectedWeek: w }))}
          momentCountsByWeek={momentCountsByWeek}
          photoCountsByWeek={photoCountsByWeek}
        />

        {/* Filter Badges Bar (if active filters) */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap text-xs">
            <span className="text-stone-500 font-medium">Active filters:</span>
            {filters.search && (
              <span className="px-2.5 py-1 rounded-full bg-stone-200/80 text-stone-800 font-semibold flex items-center gap-1">
                "{filters.search}"
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="hover:text-rose-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.selectedPersonId !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold flex items-center gap-1 border border-amber-300">
                {peopleMap[filters.selectedPersonId]?.name || 'Person'}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, selectedPersonId: 'all' }))}
                  className="hover:text-rose-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.selectedMood !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold flex items-center gap-1 border border-emerald-300">
                Mood: {filters.selectedMood}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, selectedMood: 'all' }))}
                  className="hover:text-rose-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filters.onlyHighlights && (
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-semibold flex items-center gap-1 border border-purple-300">
                ★ Highlights Only
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, onlyHighlights: false }))}
                  className="hover:text-rose-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-stone-500 hover:text-stone-900 underline text-xs ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* View Layouts */}
        {currentView === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Moments Stream */}
            <div className="lg:col-span-2 space-y-6">
              {filteredMoments.length > 0 ? (
                filteredMoments.map((moment) => (
                  <MomentCard
                    key={moment.id}
                    moment={moment}
                    author={peopleMap[moment.personId]}
                    onPhotoClick={handlePhotoClick}
                    onToggleReaction={handleToggleReaction}
                    onAddComment={handleAddComment}
                    onPersonClick={handlePersonSelect}
                  />
                ))
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      No weekly moments found
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      There are no moments matching this filter. Try selecting a different week or contribute a new memory.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewMomentOpen(true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Add First Moment
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              {/* Contributor Spotlight Card */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-900">
                    Weekly Contributors
                  </h3>
                  <button
                    onClick={() => setCurrentView('people')}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {people.slice(0, 4).map((p) => {
                    const count = moments.filter((m) => m.personId === p.id).length;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handlePersonSelect(p.id)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              {p.username}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                          {count} moments
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Journal Prompt Card */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-2xl border border-amber-200/80 p-5">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Curator's Weekly Prompt</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm leading-snug font-['Newsreader',serif]">
                  "What light or shadow caught your eye on your daily walk this week?"
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Capture a photo of the sky, your morning desk, or evening meal and add it to the Abubakar weekly stream.
                </p>
                <button
                  onClick={() => setIsNewMomentOpen(true)}
                  className="mt-3 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Document This Week
                </button>
              </div>

              {/* Data controls */}
              <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
                <span>Journal dataset: {moments.length} entries</span>
                <button
                  onClick={handleResetSampleData}
                  className="text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium underline"
                  title="Reset sample data"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'grid' && (
          <PhotoWall
            moments={filteredMoments}
            peopleMap={peopleMap}
            onPhotoClick={handlePhotoClick}
          />
        )}

        {currentView === 'timeline' && (
          <TimelineView
            moments={filteredMoments}
            peopleMap={peopleMap}
            onPhotoClick={handlePhotoClick}
            onPersonClick={handlePersonSelect}
          />
        )}

        {currentView === 'people' && (
          <PeopleDirectory
            people={people}
            moments={moments}
            onSelectPerson={handlePersonSelect}
            selectedPersonId={filters.selectedPersonId}
          />
        )}

        {currentView === 'google-signin' && (
          <GoogleSignInScreen
            onSuccess={(person) => {
              if (person) {
                setCurrentUser(person);
                showToast(`Welcome back, ${person.name}!`);
              }
              setCurrentView('feed');
            }}
            onBack={() => setCurrentView('feed')}
            onSwitchToEmail={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'auth' && (
          <SignUpPage
            onSuccess={(person) => {
              if (person) {
                setCurrentUser(person);
                showToast(`Welcome, ${person.name}! Please check your email to verify.`);
                if (person.email && !person.emailVerified) {
                  setVerificationEmailTarget(person.email);
                  setIsVerificationModalOpen(true);
                }
              }
              setCurrentView('feed');
            }}
            onBack={() => setCurrentView('feed')}
            onOpenGoogleSignIn={() => setCurrentView('google-signin')}
          />
        )}
      </main>

      {/* Email Verification Banner */}
      {currentUser && currentUser.email && !currentUser.emailVerified && (
        <EmailVerificationNotice
          email={currentUser.email}
          onOpenVerificationModal={() => {
            if (currentUser.email) {
              setVerificationEmailTarget(currentUser.email);
              setIsVerificationModalOpen(true);
            }
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-8 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-['Newsreader',serif] text-base">
              Abubakar
            </span>
            <span>—</span>
            <span>A weekly photo journal celebrating candid life & community.</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>ISO Weeks 33–35</span>
            <span>•</span>
            <span>Curated by Abubakar Al-Mansoor</span>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxPhoto}
        onClose={() => setLightboxPhoto(null)}
        photo={lightboxPhoto}
        photosList={lightboxPhotosList}
        currentIndex={lightboxIndex}
        onNavigate={(idx) => {
          setLightboxIndex(idx);
          setLightboxPhoto(lightboxPhotosList[idx]);
        }}
        moments={moments}
        peopleMap={peopleMap}
      />

      {/* Weekly Recap Story Player Modal */}
      <WeeklyRecapModal
        isOpen={isRecapOpen}
        onClose={() => setIsRecapOpen(false)}
        moments={moments}
        peopleMap={peopleMap}
        activeWeek={filters.selectedWeek}
      />

      {/* New Moment Creation Modal */}
      <NewMomentModal
        isOpen={isNewMomentOpen}
        onClose={() => setIsNewMomentOpen(false)}
        onSaveMoment={handleSaveNewMoment}
        people={people}
        currentWeek={latestWeek}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(person) => {
          if (person) {
            setCurrentUser(person);
            showToast(`Welcome, ${person.name}!`);
            if (person.email && !person.emailVerified) {
              setVerificationEmailTarget(person.email);
              setIsVerificationModalOpen(true);
            }
          }
        }}
        onSwitchToGoogle={() => {
          setIsAuthModalOpen(false);
          setCurrentView('google-signin');
        }}
      />

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        email={verificationEmailTarget}
        onVerified={() => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, emailVerified: true });
          }
          showToast('Email verified successfully!');
        }}
      />
    </div>
  );
}
