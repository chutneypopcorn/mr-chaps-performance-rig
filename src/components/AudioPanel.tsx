import { useState, useRef, useCallback, useEffect } from 'react';
import { showSections } from '../data/showData';
import type { SectionTimestamp } from '../hooks/useAudioManager';
import {
  Volume2, VolumeX, Music, Upload,
  Headphones, Play, Trash2, Clock, RotateCcw,
} from 'lucide-react';

interface AudioPanelProps {
  masterTrack: { url: string; fileName: string; duration: number } | null;
  sectionTimestamps: SectionTimestamp[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentSectionIndex: number;
  onLoadMasterTrack: (file: File) => void;
  onRemoveMasterTrack: () => void;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onSeekTo: (time: number) => void;
  onSeekToSection: (sectionIndex: number) => void;
  onUpdateTimestamp: (sectionIndex: number, time: number) => void;
  onSetVolume: (v: number) => void;
  onResetTimestamps?: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPanel({
  masterTrack, sectionTimestamps, isPlaying, currentTime, duration,
  volume, currentSectionIndex, onLoadMasterTrack, onRemoveMasterTrack,
  onTogglePlayPause, onStop, onSeekTo, onSeekToSection,
  onUpdateTimestamp, onSetVolume, onResetTimestamps,
}: AudioPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'timeline'>('player');
  const [editingTimestamp, setEditingTimestamp] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Collapse by default on mobile (< 768px)
  useEffect(() => {
    const checkMobile = () => setIsExpanded(window.innerWidth >= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onLoadMasterTrack(file);
    };
    input.click();
  };

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !masterTrack) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeekTo(ratio * duration);
  }, [duration, masterTrack, onSeekTo]);

  const handleTimestampChange = (sectionIndex: number, newTime: number) => {
    onUpdateTimestamp(sectionIndex, Math.max(0, Math.min(newTime, duration)));
  };

  return (
    <div className="bg-zinc-900 border-l border-zinc-800 flex flex-col shrink-0" style={{ width: isExpanded ? 400 : 48 }}>
      <button onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full py-3 border-b border-zinc-800 text-zinc-400 hover:text-pink-400 transition-colors">
        <Headphones className="w-5 h-5" />
      </button>

      {!isExpanded && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button onClick={() => onSetVolume(volume > 0 ? 0 : 1)}
            className="p-2 rounded-lg text-zinc-500 hover:text-pink-400 hover:bg-zinc-800 transition-all">
            {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {masterTrack && (
            <button onClick={onTogglePlayPause}
              className={`p-2 rounded-lg transition-all ${isPlaying ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
              {isPlaying ? <SquareIcon className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-zinc-800">
            <button onClick={() => setActiveTab('player')}
              className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors ${activeTab === 'player' ? 'text-pink-400 bg-zinc-800/50' : 'text-zinc-500'}`}>
              <div className="flex items-center justify-center gap-1.5"><Music className="w-3.5 h-3.5" />Player</div>
            </button>
            <button onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors ${activeTab === 'timeline' ? 'text-pink-400 bg-zinc-800/50' : 'text-zinc-500'}`}>
              <div className="flex items-center justify-center gap-1.5"><Clock className="w-3.5 h-3.5" />Timeline</div>
            </button>
          </div>

          {activeTab === 'player' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
              {!masterTrack ? (
                <div className="p-4 rounded-xl bg-zinc-800 border-2 border-dashed border-zinc-700 text-center">
                  <Music className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-zinc-400 mb-1">No Master Track</p>
                  <p className="text-xs text-zinc-600 mb-4">Upload your pre-mixed show track</p>
                  <button onClick={handleFileSelect}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-all text-sm font-bold">
                    <Upload className="w-4 h-4" />Upload Track
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-pink-400" />
                      <p className="text-xs font-bold text-pink-400 tracking-wider uppercase">Master Track</p>
                    </div>
                    <p className="text-sm font-bold text-white truncate">{masterTrack.fileName}</p>
                    <p className="text-xs text-zinc-500">{formatTime(duration)} total</p>
                    <button onClick={onRemoveMasterTrack}
                      className="flex items-center gap-1.5 mt-2 text-xs text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={onTogglePlayPause}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isPlaying ? <SquareIcon className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isPlaying ? 'PAUSE' : 'PLAY'}
                    </button>
                    <button onClick={onStop}
                      className="flex items-center justify-center px-3 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-bold">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-mono text-pink-400">{formatTime(currentTime)}</span>
                      <span className="text-xs font-mono text-zinc-600">{formatTime(duration)}</span>
                    </div>
                    <div ref={timelineRef} onClick={handleTimelineClick}
                      className="w-full h-3 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden">
                      {sectionTimestamps.sort((a, b) => a.time - b.time).map((ts, i, arr) => {
                        const nextTs = arr[i + 1];
                        const endTime = nextTs ? nextTs.time : duration;
                        const width = duration > 0 ? ((endTime - ts.time) / duration) * 100 : 0;
                        const left = duration > 0 ? (ts.time / duration) * 100 : 0;
                        const isCurrent = ts.sectionIndex === currentSectionIndex;
                        return (
                          <div key={ts.sectionIndex}
                            className={`absolute top-0 h-full ${isCurrent ? 'opacity-80' : 'opacity-40'}`}
                            style={{ left: `${left}%`, width: `${width}%`, background: `linear-gradient(to right, ${isCurrent ? '#ec4899' : '#52525b'}, ${isCurrent ? '#f43f5e' : '#52525b'})` }} />
                        );
                      })}
                      <div className="absolute top-0 h-full bg-white/20 rounded-full pointer-events-none"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                      <div className="absolute top-0 h-full w-0.5 bg-white shadow-lg"
                        style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                    <p className="text-[10px] font-bold text-pink-400 tracking-wider uppercase mb-1">Now Playing</p>
                    <p className="text-sm font-bold text-white">{showSections[currentSectionIndex]?.title}</p>
                    <p className="text-xs text-zinc-500">{showSections[currentSectionIndex]?.subtitle}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {volume > 0 ? <Volume2 className="w-3 h-3 text-zinc-400" /> : <VolumeX className="w-3 h-3 text-zinc-600" />}
                        <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Volume</p>
                      </div>
                      <span className="text-[10px] text-zinc-600">{Math.round(volume * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value={volume}
                      onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-pink-500" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-2">Jump To</p>
                    <div className="space-y-1">
                      {showSections.map((section, index) => {
                        const ts = sectionTimestamps.find(t => t.sectionIndex === index);
                        const isCurrent = index === currentSectionIndex;
                        return (
                          <button key={section.id} onClick={() => onSeekToSection(index)}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${isCurrent ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-750'}`}>
                            <span className="text-[10px] font-black">{section.number}</span>
                            <span className="text-xs font-medium truncate flex-1">{section.title}</span>
                            {ts && <span className="text-[10px] font-mono opacity-60">{formatTime(ts.time)}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && masterTrack && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Section Timestamps</p>
                    <p className="text-[10px] text-zinc-500">Set when each section starts in the track</p>
                  </div>
                </div>
                {onResetTimestamps && (
                  <button
                    onClick={onResetTimestamps}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-500 hover:text-pink-400 hover:bg-zinc-700 transition-all text-[10px] font-bold"
                    title="Reset all timestamps to official defaults"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-zinc-800 mb-4">
                <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
                  <span>0:00</span><span>{formatTime(duration)}</span>
                </div>
                <div ref={timelineRef} onClick={handleTimelineClick}
                  className="w-full h-6 bg-zinc-900 rounded-lg cursor-pointer relative overflow-hidden">
                  {sectionTimestamps.sort((a, b) => a.time - b.time).map((ts, i, arr) => {
                    const nextTs = arr[i + 1];
                    const endTime = nextTs ? nextTs.time : duration;
                    const width = duration > 0 ? ((endTime - ts.time) / duration) * 100 : 0;
                    const left = duration > 0 ? (ts.time / duration) * 100 : 0;
                    const isCurrent = ts.sectionIndex === currentSectionIndex;
                    const section = showSections[ts.sectionIndex];
                    return (
                      <div key={ts.sectionIndex}
                        className={`absolute top-0 h-full ${isCurrent ? 'opacity-100' : 'opacity-60'} flex items-center justify-center`}
                        style={{ left: `${left}%`, width: `${width}%`, background: `linear-gradient(to right, ${isCurrent ? '#ec4899' : '#3f3f46'}, ${isCurrent ? '#f43f5e' : '#3f3f46'})` }}>
                        <span className="text-[9px] font-bold text-white/80 truncate px-1">{section.number}</span>
                      </div>
                    );
                  })}
                  <div className="absolute top-0 h-full w-0.5 bg-white shadow-lg z-10"
                    style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
                </div>
              </div>

              {showSections.map((section, index) => {
                const ts = sectionTimestamps.find(t => t.sectionIndex === index);
                const isCurrent = index === currentSectionIndex;
                return (
                  <div key={section.id} className={`p-3 rounded-xl transition-all ${isCurrent ? 'bg-zinc-800 ring-1 ring-pink-500/30' : 'bg-zinc-800/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-black ${isCurrent ? 'text-pink-400' : 'text-zinc-600'}`}>{section.number}</span>
                      <p className="text-xs font-bold text-zinc-300 flex-1">{section.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      {editingTimestamp === index ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input type="number" min="0" max={Math.floor(duration)} value={Math.floor(ts?.time || 0)}
                            onChange={(e) => handleTimestampChange(index, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded bg-zinc-900 text-xs font-mono text-white border border-zinc-700 focus:border-pink-500 outline-none" />
                          <span className="text-xs text-zinc-600">sec</span>
                          <button onClick={() => setEditingTimestamp(null)}
                            className="text-[10px] text-pink-400 hover:text-pink-300 font-bold">Done</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-mono text-zinc-400">{formatTime(ts?.time || 0)}</span>
                          <button onClick={() => setEditingTimestamp(index)}
                            className="text-[10px] text-zinc-600 hover:text-pink-400 transition-colors">Edit</button>
                          <button onClick={() => handleTimestampChange(index, currentTime)}
                            className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors ml-auto">Set to Now</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'timeline' && !masterTrack && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <Music className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500 mb-4">Upload a master track first</p>
                <button onClick={() => setActiveTab('player')}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-all">Go to Player</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SquareIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}
