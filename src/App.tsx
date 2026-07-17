import { useState, useCallback, useEffect, useRef } from 'react';
import { showSections, SHOW_TITLE, SHOW_SUBTITLE } from './data/showData';
import type { ShowSection } from './data/showData';
import type { ScriptLine } from './data/showData';
import { useAudioManager } from './hooks/useAudioManager';
import AudioPanel from './components/AudioPanel';
import {
  Mic2, Music, Zap, ChevronRight, ChevronLeft,
  Play, Pause, Timer, Activity, Headphones,
  Maximize2, Minimize2, Sparkles, Volume2, Image, Film,
} from 'lucide-react';

function App() {
  const [isShowLive, setIsShowLive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    masterTrack, sectionTimestamps, isPlaying, currentTime, duration,
    volume, currentSectionIndex, isReady,
    loadMasterTrack, loadEmbeddedTrack, removeMasterTrack,
    play, pause, stop, seekTo, seekToSection, updateTimestamp,
    togglePlayPause, setVolume, resetTimestamps,
  } = useAudioManager(showSections.length);

  const [manualSectionIndex, setManualSectionIndex] = useState<number | null>(null);
  const effectiveSectionIndex = manualSectionIndex ?? currentSectionIndex;
  const currentSection: ShowSection = showSections[effectiveSectionIndex];

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Try to load embedded track on mount
  useEffect(() => {
    loadEmbeddedTrack();
  }, [loadEmbeddedTrack]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const goToSection = useCallback((index: number) => {
    if (index >= 0 && index < showSections.length) {
      setManualSectionIndex(index);
      if (masterTrack) seekToSection(index);
    }
  }, [masterTrack, seekToSection]);

  const nextSection = useCallback(() => goToSection(effectiveSectionIndex + 1), [effectiveSectionIndex, goToSection]);
  const prevSection = useCallback(() => goToSection(effectiveSectionIndex - 1), [effectiveSectionIndex, goToSection]);

  // Unified play/pause — syncs track position with show timer
  const handlePlayPause = useCallback(() => {
    if (!isReady) return;
    if (!isShowLive) {
      // First time starting — reset to beginning
      setIsShowLive(true);
      setManualSectionIndex(null);
      stop();
      setTimeout(() => play(), 50);
    } else if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isReady, isShowLive, isPlaying, play, pause, stop]);

  const handleStop = useCallback(() => {
    setIsShowLive(false);
    setManualSectionIndex(null);
    stop();
  }, [stop]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  }, []);

  // Scrub on the main progress bar
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !masterTrack || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekTo(ratio * duration);
  }, [masterTrack, duration, seekTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextSection(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSection(); }
      else if (e.key === ' ') { e.preventDefault(); if (isReady) handlePlayPause(); }
      else if (e.key === 'f') { toggleFullscreen(); }
      else if (e.key === 'Escape' && isPlaying) { pause(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSection, prevSection, toggleFullscreen, isPlaying, pause, isReady, handlePlayPause]);

  useEffect(() => {
    if (isPlaying && manualSectionIndex !== null) {
      const sorted = [...sectionTimestamps].sort((a, b) => a.time - b.time);
      let computed = 0;
      for (let i = 0; i < sorted.length; i++) {
        if (currentTime >= sorted[i].time) computed = sorted[i].sectionIndex;
      }
      if (computed === manualSectionIndex) setManualSectionIndex(null);
    }
  }, [currentTime, sectionTimestamps, isPlaying, manualSectionIndex]);

  const getLineStyle = (style: string) => {
    switch (style) {
      case 'dialogue': return 'dialogue-text text-white';
      case 'action': return 'action-text text-zinc-400';
      case 'music': return 'music-text text-pink-400';
      case 'note': return 'note-text text-amber-400';
      default: return 'teleprompter-text text-zinc-300';
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'MR CHAPS': return 'text-pink-400';
      case 'STAGE': return 'text-zinc-500';
      case 'NOTE': return 'text-amber-500';
      default: return 'text-zinc-400';
    }
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'MR CHAPS': return <Mic2 className="w-4 h-4" />;
      case 'STAGE': return <Sparkles className="w-4 h-4" />;
      case 'NOTE': return <Volume2 className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  // Determine main button state
  const getButtonState = () => {
    if (!isReady) return { text: 'START SHOW', icon: <Play className="w-4 h-4" />, disabled: true };
    if (!isShowLive) return { text: 'START SHOW', icon: <Play className="w-4 h-4" />, disabled: false };
    if (isPlaying) return { text: 'PAUSE', icon: <Pause className="w-4 h-4" />, disabled: false };
    return { text: 'RESUME', icon: <Play className="w-4 h-4" />, disabled: false };
  };
  const btnState = getButtonState();

  // Calculate progress percentage
  const progressPercent = masterTrack && duration > 0
    ? (currentTime / duration) * 100
    : 0;

  return (
    <div className="h-screen w-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Mic2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">{SHOW_TITLE}</h1>
              <p className="text-[10px] text-zinc-500 leading-tight">{SHOW_SUBTITLE}</p>
            </div>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-[10px] font-bold text-pink-400 tracking-wider">PLAYING</span>
            </div>
          )}
          {isReady && !isPlaying && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Music className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider">TRACK READY</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800">
            <Activity className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-zinc-500">BPM</span>
            <span className="ml-2 text-lg font-bold text-pink-400">{currentSection.bpm}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800">
            <Timer className="w-4 h-4 text-zinc-400" />
            <span className="text-lg font-mono font-bold text-zinc-300">
              {masterTrack ? formatTime(currentTime) : '--:--'}
            </span>
          </div>
          <button
            onClick={handlePlayPause}
            disabled={btnState.disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : isReady
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {btnState.icon}
            {btnState.text}
          </button>
          {isShowLive && (
            <button onClick={handleStop}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
              <StopIcon className="w-4 h-4" />
            </button>
          )}
          <button onClick={toggleFullscreen} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SCRUBBABLE PROGRESS BAR */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        onTouchStart={handleProgressClick}
        className="w-full h-2 bg-zinc-800 shrink-0 relative cursor-pointer group"
      >
        {masterTrack && sectionTimestamps.map(ts => (
          <div key={ts.sectionIndex} className="absolute top-0 h-full w-0.5 bg-white/30 z-10"
            style={{ left: `${duration > 0 ? (ts.time / duration) * 100 : 0}%` }} />
        ))}
        <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all"
          style={{ width: `${progressPercent}%` }} />
        {/* Hover tooltip line */}
        <div className="absolute top-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* MAIN */}
      <div className="flex flex-1 min-h-0">
        {/* TELEPROMPTER */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-4 bg-zinc-900/50 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-pink-500">{currentSection.number}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{currentSection.title}</h2>
                <p className="text-sm text-zinc-500">{currentSection.subtitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {masterTrack && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-xs font-mono text-zinc-400">
                    <Headphones className="w-3 h-3 text-pink-400" />
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 text-xs text-zinc-400">
                  <Music className="w-3 h-3" />
                  {currentSection.backingTrack}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-6 max-w-4xl">
              {currentSection.script.map((line, i) => (
                <ScriptLineRenderer key={i} line={line} />
              ))}
              {currentSection.song && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Music className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-pink-400 tracking-wider uppercase">SONG</span>
                  </div>
                  <p className="text-lg font-bold text-white">{currentSection.song}</p>
                  {currentSection.songNote && <p className="text-sm text-pink-300/70 mt-1">{currentSection.songNote}</p>}
                </div>
              )}
              <div className="flex items-center justify-between pt-6 pb-4">
                <button onClick={prevSection} disabled={effectiveSectionIndex === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 font-semibold">
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <span className="text-sm text-zinc-500 font-medium">{effectiveSectionIndex + 1} / {showSections.length}</span>
                <button onClick={nextSection} disabled={effectiveSectionIndex === showSections.length - 1}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 font-semibold">
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TRIGGER PADS */}
        <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Trigger Pads</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {showSections.map((section, index) => {
              const ts = sectionTimestamps.find(t => t.sectionIndex === index);
              const isActive = index === effectiveSectionIndex;
              const isCurrentlyPlaying = index === currentSectionIndex && isPlaying && !manualSectionIndex;
              return (
                <button key={section.id} onClick={() => goToSection(index)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${isActive ? `bg-gradient-to-r ${section.triggerColor} text-white shadow-lg` : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black ${isActive ? 'text-white/80' : 'text-zinc-500'}`}>{section.number}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>{section.title}</p>
                        {isCurrentlyPlaying && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />}
                      </div>
                      <p className={`text-[10px] truncate ${isActive ? 'text-white/70' : 'text-zinc-500'}`}>{section.subtitle}</p>
                    </div>
                    {ts && masterTrack && <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-white/50' : 'text-zinc-600'}`}>{formatTime(ts.time)}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-3 border-t border-zinc-800 shrink-0">
            <div className="text-[10px] text-zinc-600 text-center">
              <p>Arrow keys to navigate</p>
              <p>Space to play/pause</p>
              <p>F for fullscreen</p>
            </div>
          </div>
        </div>

        {/* AUDIO PANEL */}
        <AudioPanel
          masterTrack={masterTrack}
          sectionTimestamps={sectionTimestamps}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          currentSectionIndex={effectiveSectionIndex}
          onLoadMasterTrack={loadMasterTrack}
          onRemoveMasterTrack={removeMasterTrack}
          onTogglePlayPause={togglePlayPause}
          onStop={stop}
          onSeekTo={seekTo}
          onSeekToSection={(index: number) => { setManualSectionIndex(index); seekToSection(index); }}
          onUpdateTimestamp={updateTimestamp}
          onSetVolume={setVolume}
          onResetTimestamps={resetTimestamps}
        />
      </div>
    </div>
  );
}

/** Renders a single script line with optional media embed */
function ScriptLineRenderer({ line }: { line: ScriptLine }) {
  const getLineStyle = (style: string) => {
    switch (style) {
      case 'dialogue': return 'dialogue-text text-white';
      case 'action': return 'action-text text-zinc-400';
      case 'music': return 'music-text text-pink-400';
      case 'note': return 'note-text text-amber-400';
      default: return 'teleprompter-text text-zinc-300';
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'MR CHAPS': return 'text-pink-400';
      case 'STAGE': return 'text-zinc-500';
      case 'NOTE': return 'text-amber-500';
      default: return 'text-zinc-400';
    }
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'MR CHAPS': return <Mic2 className="w-4 h-4" />;
      case 'STAGE': return <Sparkles className="w-4 h-4" />;
      case 'NOTE': return <Volume2 className="w-4 h-4" />;
      default: return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 rounded-xl hover:bg-zinc-800/40 transition-all">
      <div className={`flex items-center gap-2 mb-2 text-xs font-bold tracking-wider uppercase ${getSpeakerColor(line.speaker)}`}>
        {getSpeakerIcon(line.speaker)}
        {line.speaker}
      </div>
      <div className={getLineStyle(line.style)}>{line.text}</div>

      {/* Media embed */}
      {line.mediaUrl && line.mediaType === 'image' && (
        <div className="mt-3">
          <img
            src={line.mediaUrl}
            alt={line.mediaCaption || line.text}
            className="rounded-lg max-h-64 object-contain border border-zinc-700/50"
            loading="lazy"
          />
          {line.mediaCaption && (
            <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
              <Image className="w-3 h-3" />
              {line.mediaCaption}
            </p>
          )}
        </div>
      )}
      {line.mediaUrl && line.mediaType === 'video' && (
        <div className="mt-3">
          <video
            src={line.mediaUrl}
            controls
            className="rounded-lg max-h-64 w-full border border-zinc-700/50"
            preload="metadata"
          />
          {line.mediaCaption && (
            <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
              <Film className="w-3 h-3" />
              {line.mediaCaption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}

export default App;
