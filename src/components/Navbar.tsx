import React from 'react';
import { ViewMode, Person } from '../types';
import { Camera, Image as ImageIcon, Calendar, Users, Sparkles, Plus, Search, SlidersHorizontal, Film, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenNewMoment: () => void;
  onOpenRecap: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilterCount: number;
  onToggleFilters: () => void;
  showFilters: boolean;
  isCloudConnected?: boolean;
  currentUser?: Person | null;
  onOpenAuth?: () => void;
  onOpenGoogleSignIn?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenNewMoment,
  onOpenRecap,
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onToggleFilters,
  showFilters,
  isCloudConnected = true,
  currentUser,
  onOpenAuth,
  onOpenGoogleSignIn,
  onSignOut,
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-600 text-amber-50 flex items-center justify-center shadow-sm shadow-amber-600/20 ring-1 ring-amber-700/10">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-stone-900 font-['Newsreader',serif]">
                  Abubakar
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200/60">
                  Weekly Journal
                </span>
                {isCloudConnected && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="Connected to Firestore Live Database">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Firebase Live
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium tracking-normal hidden sm:block">
                Capturing people's weekly photos & candid moments
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-stone-200/60 rounded-xl border border-stone-300/40">
            <button
              id="nav-tab-feed"
              onClick={() => onViewChange('feed')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'feed'
                  ? 'bg-white text-stone-900 shadow-xs shadow-stone-900/5 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Feed</span>
            </button>

            <button
              id="nav-tab-grid"
              onClick={() => onViewChange('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs shadow-stone-900/5 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Photo Wall</span>
            </button>

            <button
              id="nav-tab-timeline"
              onClick={() => onViewChange('timeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'timeline'
                  ? 'bg-white text-stone-900 shadow-xs shadow-stone-900/5 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Timeline</span>
            </button>

            <button
              id="nav-tab-people"
              onClick={() => onViewChange('people')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentView === 'people'
                  ? 'bg-white text-stone-900 shadow-xs shadow-stone-900/5 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
              }`}
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>People</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <div className="relative hidden lg:block w-48 xl:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search moments, tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/80 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              id="btn-toggle-filters"
              onClick={onToggleFilters}
              className={`relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100/60'
              }`}
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Weekly Recap Story Player Button */}
            <button
              id="btn-open-weekly-recap"
              onClick={onOpenRecap}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-all active:scale-95"
            >
              <Film className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Weekly Story</span>
              <span className="sm:hidden">Story</span>
            </button>

            {/* Add Moment Button */}
            <button
              id="btn-open-new-moment"
              onClick={onOpenNewMoment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Moment</span>
            </button>

            {/* User Account / Google Sign In Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-stone-200 hover:ring-2 hover:ring-amber-500/30 transition-all bg-white"
                  title={currentUser.name}
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-40 space-y-1">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {currentUser.email || currentUser.username}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onSignOut) onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenGoogleSignIn || (() => onViewChange('google-signin'))}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 transition-all shadow-2xs"
                  title="Sign in with Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Google Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View Switcher Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200/60">
          <button
            onClick={() => onViewChange('feed')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium ${
              currentView === 'feed' ? 'text-amber-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => onViewChange('grid')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium ${
              currentView === 'grid' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Wall</span>
          </button>
          <button
            onClick={() => onViewChange('timeline')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium ${
              currentView === 'timeline' ? 'text-sky-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => onViewChange('people')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium ${
              currentView === 'people' ? 'text-purple-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>People</span>
          </button>
        </div>
      </div>
    </header>
  );
};
