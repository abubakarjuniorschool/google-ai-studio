export interface Person {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  accentColor: string;
  joinedDate: string;
  role?: string;
  email?: string;
  emailVerified?: boolean;
}

export interface MomentPhoto {
  id: string;
  url: string;
  caption?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  location?: string;
  filter?: string;
}

export interface Comment {
  id: string;
  personId?: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface Moment {
  id: string;
  personId: string;
  weekNumber: number;
  year: number;
  weekLabel: string;
  date: string; // ISO date string
  title: string;
  description: string;
  photos: MomentPhoto[];
  location: {
    name: string;
    city?: string;
    country?: string;
  };
  mood: Mood;
  tags: string[];
  reactions: Record<string, number>;
  userReacted?: Record<string, boolean>;
  comments: Comment[];
  isHighlight?: boolean;
  audioNote?: {
    duration: string;
    label: string;
  };
}

export type ViewMode = 'feed' | 'grid' | 'timeline' | 'people' | 'auth' | 'google-signin';

export interface FilterState {
  search: string;
  selectedWeek: number | 'all';
  selectedPersonId: string | 'all';
  selectedMood: string | 'all';
  onlyHighlights: boolean;
}
