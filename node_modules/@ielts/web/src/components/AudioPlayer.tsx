import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  transcript?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  transcript,
  autoPlay = false,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // default simulated 2 minutes
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [usingSpeechSynth, setUsingSpeechSynth] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if real audio URL works, otherwise use Web Speech API fallback
    if (!audioUrl && transcript && 'speechSynthesis' in window) {
      setUsingSpeechSynth(true);
    }
  }, [audioUrl, transcript]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (usingSpeechSynth && transcript) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(transcript);
        utterance.rate = playbackRate;
        utterance.lang = 'en-US';

        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (timerRef.current) clearInterval(timerRef.current);
          if (onEnded) onEnded();
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
        };

        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);

        // Approximate duration based on word count (130 words per min)
        const words = transcript.split(/\s+/).length;
        const estDuration = Math.max(30, Math.round((words / 130) * 60));
        setDuration(estDuration);

        timerRef.current = window.setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= estDuration) {
              clearInterval(timerRef.current!);
              return estDuration;
            }
            return prev + 1;
          });
        }, 1000 / playbackRate);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleReplay10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    } else {
      setCurrentTime((prev) => Math.max(0, prev - 10));
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);

    if (usingSpeechSynth && isPlaying) {
      // restart synth with new rate
      togglePlay();
      setTimeout(togglePlay, 100);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration || 120);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-95 min-h-touch min-w-touch"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
        </button>

        {/* Time and Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-400 dark:text-slate-500">{formatTime(duration)}</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Controls: Replay & Speed */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleReplay10}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-touch min-w-touch flex items-center justify-center"
            title="Replay 10s"
            aria-label="Replay 10 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={cycleSpeed}
            className="px-2 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-100 transition-colors min-h-touch flex items-center justify-center"
            title="Change Playback Speed"
            aria-label="Change playback speed"
          >
            {playbackRate}x
          </button>
        </div>
      </div>

      {usingSpeechSynth && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          🔊 Synthesized IELTS audio playback (offline-ready)
        </p>
      )}
    </div>
  );
};
