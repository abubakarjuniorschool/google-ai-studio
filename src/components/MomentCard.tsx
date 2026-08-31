import React, { useState } from 'react';
import { Moment, Person, MomentPhoto } from '../types';
import { formatDatePretty, formatTimeAgo } from '../utils/dateUtils';
import { MapPin, MessageCircle, Heart, Share2, Volume2, Bookmark, Check, Send, Sparkles, Expand } from 'lucide-react';

interface MomentCardProps {
  moment: Moment;
  author?: Person;
  onPhotoClick: (photo: MomentPhoto, allPhotos: MomentPhoto[], index: number) => void;
  onToggleReaction: (momentId: string, emoji: string) => void;
  onAddComment: (momentId: string, text: string) => void;
  onPersonClick?: (personId: string) => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({
  moment,
  author,
  onPhotoClick,
  onToggleReaction,
  onAddComment,
  onPersonClick,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAudioPlay = () => {
    setIsPlayingAudio(!isPlayingAudio);
    // simulated audio pulse
    if (!isPlayingAudio) {
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 4000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(moment.id, commentText.trim());
    setCommentText('');
  };

  const reactionEmojis = ['❤️', '✨', '🔥', '☕', '🌿'];

  return (
    <article
      id={`moment-card-${moment.id}`}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 pb-3 sm:pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPersonClick && onPersonClick(moment.personId)}
            className="relative group shrink-0"
          >
            <img
              src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
              alt={author?.name || 'Contributor'}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-stone-100 group-hover:ring-amber-500 transition-all"
            />
            {author?.role === 'Journal Curator' && (
              <span
                title="Curator"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
              >
                ★
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onPersonClick && onPersonClick(moment.personId)}
                className="font-bold text-sm sm:text-base text-stone-900 hover:text-amber-700 transition-colors text-left"
              >
                {author?.name || 'Anonymous Contributor'}
              </button>
              <span className="text-xs text-stone-400 font-medium">
                {author?.username || ''}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 flex-wrap">
              <span>{formatTimeAgo(moment.date)}</span>
              <span>•</span>
              <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50 text-[11px]">
                {moment.weekLabel}
              </span>
              {moment.location?.name && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-stone-600">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {moment.location.name}
                    {moment.location.city ? `, ${moment.location.city}` : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mood Badge */}
        {moment.mood && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${
              moment.mood.color || 'bg-stone-50 text-stone-700 border-stone-200'
            }`}
          >
            <span className="text-sm">{moment.mood.emoji}</span>
            <span className="hidden sm:inline">{moment.mood.label}</span>
          </div>
        )}
      </div>

      {/* Story Title & Description */}
      <div className="px-4 sm:px-5 py-2">
        <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug font-['Newsreader',serif]">
          {moment.title}
        </h3>
        {moment.description && (
          <p className="mt-1.5 text-stone-700 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line">
            {moment.description}
          </p>
        )}
      </div>

      {/* Audio Ambient Snippet (if available) */}
      {moment.audioNote && (
        <div className="mx-4 sm:mx-5 my-2 p-2.5 rounded-xl bg-stone-100/80 border border-stone-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAudioPlay}
              className={`p-2 rounded-lg transition-all ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70'
              }`}
              title="Play ambient audio note"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs font-semibold text-stone-800">
                {moment.audioNote.label}
              </p>
              <p className="text-[11px] text-stone-500">
                Ambient recording • {moment.audioNote.duration}
              </p>
            </div>
          </div>
          {isPlayingAudio && (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-4 bg-amber-600 rounded-full animate-bounce" />
              <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
            </div>
          )}
        </div>
      )}

      {/* Photo Gallery Grid Layout */}
      {moment.photos && moment.photos.length > 0 && (
        <div className="mt-2 relative">
          {moment.photos.length === 1 && (
            <div
              className="relative group cursor-pointer overflow-hidden bg-stone-100 max-h-[480px]"
              onClick={() => onPhotoClick(moment.photos[0], moment.photos, 0)}
            >
              <img
                src={moment.photos[0].url}
                alt={moment.photos[0].caption || moment.title}
                className="w-full h-full max-h-[480px] object-cover group-hover:scale-[1.01] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs">
                  <Expand className="w-3.5 h-3.5" /> View Photo
                </span>
              </div>
              {moment.photos[0].caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-white text-xs">
                  {moment.photos[0].caption}
                </div>
              )}
            </div>
          )}

          {moment.photos.length === 2 && (
            <div className="grid grid-cols-2 gap-1 bg-stone-100 max-h-[380px]">
              {moment.photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  className="relative group cursor-pointer overflow-hidden h-72 sm:h-80"
                  onClick={() => onPhotoClick(photo, moment.photos, idx)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `Photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {photo.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 text-white text-[11px] truncate">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {moment.photos.length >= 3 && (
            <div className="grid grid-cols-3 gap-1 bg-stone-100 max-h-[400px]">
              <div
                className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden h-72 sm:h-96"
                onClick={() => onPhotoClick(moment.photos[0], moment.photos, 0)}
              >
                <img
                  src={moment.photos[0].url}
                  alt={moment.photos[0].caption || 'Hero photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {moment.photos[0].caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-white text-xs truncate">
                    {moment.photos[0].caption}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 h-72 sm:h-96">
                <div
                  className="relative group cursor-pointer overflow-hidden flex-1"
                  onClick={() => onPhotoClick(moment.photos[1], moment.photos, 1)}
                >
                  <img
                    src={moment.photos[1].url}
                    alt={moment.photos[1].caption || 'Photo 2'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div
                  className="relative group cursor-pointer overflow-hidden flex-1"
                  onClick={() => onPhotoClick(moment.photos[2], moment.photos, 2)}
                >
                  <img
                    src={moment.photos[2].url}
                    alt={moment.photos[2].caption || 'Photo 3'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {moment.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-base backdrop-blur-xs">
                      +{moment.photos.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {moment.tags && moment.tags.length > 0 && (
        <div className="px-4 sm:px-5 pt-3 flex flex-wrap gap-1.5">
          {moment.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/70 px-2 py-0.5 rounded-md transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reaction & Action Footer */}
      <div className="p-4 sm:p-5 pt-3 border-t border-stone-100 mt-2 flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Reaction Emojis */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {reactionEmojis.map((emoji) => {
            const count = moment.reactions[emoji] || 0;
            const hasReacted = moment.userReacted?.[emoji];
            return (
              <button
                key={emoji}
                onClick={() => onToggleReaction(moment.id, emoji)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  hasReacted
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/20 scale-105'
                    : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/70 border border-stone-200/50'
                }`}
                title={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Right: Comments, Bookmark, Share */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showComments
                ? 'bg-stone-200 text-stone-900 font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{moment.comments?.length || 0}</span>
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              isBookmarked
                ? 'text-amber-600 bg-amber-50'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark moment'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-all text-xs"
            title="Share Moment"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Comments Thread */}
      {showComments && (
        <div className="bg-stone-50/90 border-t border-stone-200/80 p-4 sm:p-5 space-y-3">
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {moment.comments && moment.comments.length > 0 ? (
              moment.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-stone-200/60 text-xs"
                >
                  <img
                    src={comment.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                    alt={comment.authorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-stone-900">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-stone-700 mt-0.5 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 italic py-2 text-center">
                No notes yet. Be the first to leave a comment on this weekly moment!
              </p>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a warm note or memory..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
