import React, { useState, useRef, useEffect } from 'react';
import { Person, Moment, MomentPhoto, Mood } from '../types';
import { MOODS, SAMPLE_PRESET_IMAGES } from '../data/mockData';
import { getWeekNumber, getWeekRangeLabel } from '../utils/dateUtils';
import { X, Upload, Camera, Image as ImageIcon, MapPin, Sparkles, Plus, Trash2, Check, Video, AlertCircle } from 'lucide-react';

interface NewMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMoment: (moment: Moment, newPerson?: Person) => void;
  people: Person[];
  currentWeek: number;
}

export const NewMomentModal: React.FC<NewMomentModalProps> = ({
  isOpen,
  onClose,
  onSaveMoment,
  people,
  currentWeek,
}) => {
  const [personId, setPersonId] = useState(people[0]?.id || 'abubakar');
  const [isCreatingNewPerson, setIsCreatingNewPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonBio, setNewPersonBio] = useState('');
  const [newPersonLocation, setNewPersonLocation] = useState('');

  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>(MOODS[0]);
  const [locationName, setLocationName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [photos, setPhotos] = useState<MomentPhoto[]>([]);
  const [isHighlight, setIsHighlight] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [audioLabel, setAudioLabel] = useState('Quiet afternoon atmosphere & birdsong');

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please check browser permissions or upload from files.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const newPhoto: MomentPhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        url: dataUrl,
        caption: 'Live snapshot',
        aspectRatio: 'landscape',
      };
      setPhotos((prev) => [...prev, newPhoto]);
      stopCamera();
    }
  };

  // Handle file uploads
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const newPhoto: MomentPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            url: result,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            aspectRatio: 'landscape',
          };
          setPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPresetImage = (preset: typeof SAMPLE_PRESET_IMAGES[0]) => {
    const newPhoto: MomentPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      url: preset.url,
      caption: preset.title,
      aspectRatio: preset.aspect,
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const momentDate = new Date(date);
    const weekNo = getWeekNumber(momentDate);
    const weekLabel = getWeekRangeLabel(weekNo, momentDate.getFullYear());

    let finalPersonId = personId;
    let newPersonObj: Person | undefined = undefined;

    if (isCreatingNewPerson && newPersonName.trim()) {
      finalPersonId = `person-${Date.now()}`;
      newPersonObj = {
        id: finalPersonId,
        name: newPersonName.trim(),
        username: `@${newPersonName.toLowerCase().replace(/\s+/g, '')}`,
        avatar:
          photos[0]?.url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        bio: newPersonBio.trim() || 'New contributor to Abubakar journal.',
        location: newPersonLocation.trim() || locationCity || 'Global',
        accentColor: '#d97706',
        joinedDate: 'August 2026',
        role: 'Contributor',
      };
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    // If no photos attached, attach one aesthetic default
    const finalPhotos =
      photos.length > 0
        ? photos
        : [
            {
              id: `p-${Date.now()}`,
              url: SAMPLE_PRESET_IMAGES[0].url,
              caption: title,
              aspectRatio: 'landscape' as const,
            },
          ];

    const newMoment: Moment = {
      id: `moment-${Date.now()}`,
      personId: finalPersonId,
      weekNumber: weekNo,
      year: momentDate.getFullYear(),
      weekLabel,
      date: new Date(date).toISOString(),
      title: title.trim(),
      description: description.trim(),
      photos: finalPhotos,
      location: {
        name: locationName.trim() || 'Cozy Spot',
        city: locationCity.trim() || undefined,
        country: locationCountry.trim() || undefined,
      },
      mood: selectedMood,
      tags: tags.length > 0 ? tags : ['WeeklyMoment', selectedMood.label.replace(/\s+/g, '')],
      reactions: {
        '❤️': 1,
        '✨': 1,
      },
      userReacted: {
        '❤️': true,
      },
      comments: [],
      isHighlight,
      audioNote: includeAudio
        ? {
            duration: '0:35',
            label: audioLabel.trim() || 'Atmospheric recording',
          }
        : undefined,
    };

    onSaveMoment(newMoment, newPersonObj);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:px-6 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-['Newsreader',serif]">
                Add Weekly Moment
              </h2>
              <p className="text-xs text-stone-500">
                Document photos, stories, and highlights for Week {currentWeek}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Author Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Who is sharing this moment?
            </label>
            {!isCreatingNewPerson ? (
              <div className="flex items-center gap-2 flex-wrap">
                {people.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonId(p.id)}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full text-xs font-semibold border transition-all ${
                      personId === p.id
                        ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{p.name.split(' ')[0]}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCreatingNewPerson(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-stone-300 text-stone-600 hover:bg-stone-100 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Contributor</span>
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/60 rounded-2xl p-3.5 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">New Contributor Profile</span>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewPerson(false)}
                    className="text-xs font-semibold text-amber-700 underline"
                  >
                    Cancel / Choose existing
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Full Name (e.g. Maya Lin)"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
                <input
                  type="text"
                  placeholder="Short Bio / Specialty (e.g. Film scans & mountain trails)"
                  value={newPersonBio}
                  onChange={(e) => setNewPersonBio(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}
          </div>

          {/* Date & Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Calculated Week
              </label>
              <div className="px-3 py-2 bg-amber-50/80 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900">
                {getWeekRangeLabel(getWeekNumber(new Date(date)), new Date(date).getFullYear())}
              </div>
            </div>
          </div>

          {/* Title & Story */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Moment Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Afternoon pour-over and river sketches"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Story / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Describe the light, the conversation, the food, or what made this moment special..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Photos Upload & Preset Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Photos ({photos.length})
              </label>
              <span className="text-[11px] text-stone-400">Upload files, snap live, or choose presets</span>
            </div>

            {/* Photo Action Bar */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFilesUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-stone-600" />
                <span>Upload Photos</span>
              </button>

              <button
                type="button"
                onClick={isCameraActive ? stopCamera : startCamera}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCameraActive
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>{isCameraActive ? 'Close Camera' : 'Live Camera'}</span>
              </button>
            </div>

            {/* Live Camera View (if active) */}
            {isCameraActive && (
              <div className="mb-3 p-3 bg-stone-900 rounded-2xl text-white space-y-3">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400">Point camera and take photo</span>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Attached Photos Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 p-1"
                  >
                    <img
                      src={p.url}
                      alt="Moment attachment"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(p.id)}
                      className="absolute top-2 right-2 p-1 rounded-md bg-black/70 hover:bg-rose-600 text-white transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      placeholder="Photo caption..."
                      value={p.caption || ''}
                      onChange={(e) => handleUpdateCaption(p.id, e.target.value)}
                      className="mt-1 w-full px-2 py-1 text-[11px] bg-white border border-stone-200 rounded-md focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Curated Aesthetic Presets */}
            <div>
              <p className="text-[11px] font-semibold text-stone-500 mb-1.5">
                Quick pick from curated sample library:
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPresetImage(preset)}
                    className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-stone-200 hover:border-amber-500 transition-all"
                    title={`Add "${preset.title}"`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-amber-600/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Weekly Vibe & Mood
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => {
                const isSelected = selectedMood.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${m.color} ring-2 ring-amber-500/20 font-bold scale-105`
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Spot / Venue
              </label>
              <input
                type="text"
                placeholder="e.g. High Street Tea House"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. London"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. UK"
                value={locationCountry}
                onChange={(e) => setLocationCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Film, Weekend, Sourdough, Sunset"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Highlight & Audio Options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/80">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isHighlight}
                onChange={(e) => setIsHighlight(e.target.checked)}
                className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span className="text-xs font-semibold text-stone-800">
                Feature as Weekly Reel Highlight
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span className="text-xs font-semibold text-stone-800">
                Attach Ambient Audio Snippet
              </span>
            </label>
          </div>

          {includeAudio && (
            <input
              type="text"
              placeholder="Audio recording note description (e.g. Rain on windowpane)"
              value={audioLabel}
              onChange={(e) => setAudioLabel(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
            />
          )}

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Weekly Moment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
