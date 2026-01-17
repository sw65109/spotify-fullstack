import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiShuffle,
  FiSkipBack,
  FiPlay,
  FiPause,
  FiSkipForward,
  FiRepeat,
  FiMic,
  FiMonitor,
  FiMaximize2,
  FiMinimize2,
  FiVolume2,
  FiVolumeX,
  FiList,
  FiSpeaker,
  FiPlusCircle,
} from "react-icons/fi";
import { usePlayer } from "../context/usePlayer";

function IconButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      className={[
        "relative group flex items-center justify-center",
        disabled
          ? "text-white/30 cursor-not-allowed"
          : "text-white/70 hover:text-white cursor-pointer",
      ].join(" ")}
    >
      {children}
      <span
        className={[
          "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2",
          "whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium",
          "bg-neutral-800 text-white shadow-md",
          "opacity-0 group-hover:opacity-100",
          disabled ? "hidden" : "",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

const formatTime = (seconds) => {
  const safe = Number.isFinite(seconds) ? seconds : 0;
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Player = () => {
  const {
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    likedTrackIds,
    toggleLikedTrack,
    songs,
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef(null);

  const volumeBarRef = useRef(null);
  const isDraggingVolumeRef = useRef(false);

  const hasTrack = Boolean(currentTrack?.file);
  const showPlayingExtras = hasTrack && isPlaying;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(() => {
    const raw = localStorage.getItem("volume");
    const n = raw == null ? 0.8 : Number(raw);
    if (!Number.isFinite(n)) return 0.8;
    return Math.min(1, Math.max(0, n));
  });

  const lastNonZeroVolumeRef = useRef(0.8);

  const [isShuffle, setIsShuffle] = useState(false);
  const queueRef = useRef([]);
  const queuePosRef = useRef(0);
  const playNextRef = useRef(null);
  const [repeatMode, setRepeatMode] = useState("off");

  const cycleRepeatMode = () => {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  };

  const isLiked = currentTrack ? likedTrackIds?.includes(currentTrack.id) : false;

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const currentIndex = hasTrack
    ? (songs ?? []).findIndex((s) => s.id === currentTrack.id)
    : -1;

  const playTrackByIndex = useCallback(
    (index) => {
      const song = (songs ?? [])[index];
      if (!song) return;

      setCurrentTrack({
        id: song.id,
        name: song.name,
        desc: song.desc,
        image: song.image,
        file: song.file,
      });
      setIsPlaying(true);
    },
    [songs, setCurrentTrack, setIsPlaying]
  );

  const buildShuffleQueue = useCallback(
    (startIndex) => {
      const rest = (songs ?? []).map((_, i) => i).filter((i) => i !== startIndex);

      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }

      return [startIndex, ...rest];
    },
    [songs]
  );

  const makeQueue = useCallback(
    (startIndex, shuffle) => {
      if (startIndex < 0) return [];
      if (shuffle) return buildShuffleQueue(startIndex);
      return (songs ?? []).map((_, i) => i);
    },
    [songs, buildShuffleQueue]
  );

  useEffect(() => {
    if (!hasTrack) return;
    if (currentIndex < 0) return;

    if (queueRef.current.length === 0) {
      queueRef.current = makeQueue(currentIndex, isShuffle);
      queuePosRef.current = isShuffle ? 0 : currentIndex;
      return;
    }

    if (isShuffle) {
      const posInQueue = queueRef.current.indexOf(currentIndex);
      if (posInQueue >= 0) {
        queuePosRef.current = posInQueue;
        return;
      }

      queueRef.current = makeQueue(currentIndex, true);
      queuePosRef.current = 0;
      return;
    }

    queueRef.current = makeQueue(currentIndex, false);
    queuePosRef.current = currentIndex;
  }, [currentTrack?.id, hasTrack, currentIndex, isShuffle, makeQueue]);

  const toggleShuffle = () => {
    if (!hasTrack) return;
    if (currentIndex < 0) return;

    const next = !isShuffle;
    setIsShuffle(next);

    queueRef.current = makeQueue(currentIndex, next);
    queuePosRef.current = next ? 0 : currentIndex;
  };

  const playNext = useCallback(
    ({ wrap } = { wrap: true }) => {
      if (!hasTrack) return;

      if (queueRef.current.length === 0) {
        const start = currentIndex >= 0 ? currentIndex : 0;
        queueRef.current = makeQueue(start, isShuffle);
        queuePosRef.current = isShuffle ? 0 : start;
      }

      const lastIndex = queueRef.current.length - 1;
      const atEnd = queuePosRef.current >= lastIndex;

      if (atEnd && !wrap) {
        setIsPlaying(false);
        return;
      }

      const nextPos = atEnd ? 0 : queuePosRef.current + 1;
      queuePosRef.current = nextPos;
      playTrackByIndex(queueRef.current[nextPos]);
    },
    [hasTrack, currentIndex, isShuffle, makeQueue, playTrackByIndex, setIsPlaying]
  );

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  const playPrev = () => {
    if (!hasTrack) return;

    if (queueRef.current.length === 0) {
      const start = currentIndex >= 0 ? currentIndex : 0;
      queueRef.current = makeQueue(start, isShuffle);
      queuePosRef.current = isShuffle ? 0 : start;
    }

    const prevPos =
      (queuePosRef.current - 1 + queueRef.current.length) % queueRef.current.length;

    queuePosRef.current = prevPos;
    playTrackByIndex(queueRef.current[prevPos]);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasTrack) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [hasTrack, isPlaying, setIsPlaying, currentTrack?.file]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);

    const onEnded = () => {
      const audio = audioRef.current;

      if (repeatMode === "one") {
        if (!audio) return;
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }

      if (repeatMode === "all") {
        playNextRef.current?.({ wrap: true });
        return;
      }

      playNextRef.current?.({ wrap: false });
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    onLoadedMetadata();
    onTimeUpdate();

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack?.file, repeatMode, setIsPlaying]);

  const seek = (e) => {
    if (!hasTrack) return;
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    audio.currentTime = pct * duration;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume, currentTrack?.file]);

  useEffect(() => {
    localStorage.setItem("volume", String(volume));
    if (volume > 0) lastNonZeroVolumeRef.current = volume;
  }, [volume]);

  const toggleMute = () => {
    setVolume((v) => {
      const current = Number(v) || 0;
      if (current > 0) {
        lastNonZeroVolumeRef.current = current;
        return 0;
      }
      const restore = Number(lastNonZeroVolumeRef.current) || 0.8;
      return restore > 0 ? restore : 0.8;
    });
  };

  const safePointerCapture = (el, pointerId, action) => {
    try {
      if (action === "set") el?.setPointerCapture?.(pointerId);
      if (action === "release") el?.releasePointerCapture?.(pointerId);
    } catch (err) {
      // Don’t crash the UI if capture fails on some browsers/edge cases
      if (import.meta.env.DEV) {
        console.debug(`[PointerCapture:${action}] failed`, err);
      }
    }
  };

  const setVolumeFromClientX = (clientX) => {
    const el = volumeBarRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (!rect.width) return;

    const x = clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    setVolume(pct);
    if (pct > 0) lastNonZeroVolumeRef.current = pct;
  };

  const onVolumePointerDown = (e) => {
    isDraggingVolumeRef.current = true;
  
    safePointerCapture(e.currentTarget, e.pointerId, "set");
    setVolumeFromClientX(e.clientX);
  };

  const onVolumePointerMove = (e) => {
    if (!isDraggingVolumeRef.current) return;
    setVolumeFromClientX(e.clientX);
  };

  const onVolumePointerUp = (e) => {
    if (!isDraggingVolumeRef.current) return;
  
    isDraggingVolumeRef.current = false;
    safePointerCapture(e.currentTarget, e.pointerId, "release");
  };

  return (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      <audio
        key={currentTrack?.file ?? "no-track"}
        ref={audioRef}
        src={currentTrack?.file}
        preload="metadata"
      />

      <div className="hidden lg:flex items-center gap-4 min-w-0">
        {hasTrack ? (
          <>
            <img className="w-12" src={currentTrack.image} alt="" />
            <div className="min-w-0">
              <p className="truncate">{currentTrack.name}</p>
              <p className="truncate">{currentTrack.desc?.slice?.(0, 20)}</p>
            </div>

            <IconButton
              label={isLiked ? "Remove from Liked Songs" : "Save to your Liked Songs"}
              disabled={!hasTrack}
              onClick={() => toggleLikedTrack(currentTrack.id)}
            >
              <FiPlusCircle className={isLiked ? "text-green-500 text-lg" : "text-lg"} />
            </IconButton>
          </>
        ) : (
          <div className="text-white/40">No song selected</div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4 items-center">
          <IconButton
            label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            disabled={!hasTrack}
            onClick={toggleShuffle}
          >
            <FiShuffle className={isShuffle ? "text-green-500 text-lg" : "text-lg"} />
          </IconButton>

          <IconButton label="Previous" disabled={!hasTrack} onClick={playPrev}>
            <FiSkipBack className="text-lg" />
          </IconButton>

          <IconButton
            label={isPlaying ? "Pause" : "Play"}
            disabled={!hasTrack}
            onClick={() => setIsPlaying((v) => !v)}
          >
            {isPlaying ? <FiPause className="text-lg" /> : <FiPlay className="text-lg" />}
          </IconButton>

          <IconButton label="Next" disabled={!hasTrack} onClick={playNext}>
            <FiSkipForward className="text-lg" />
          </IconButton>

          <IconButton
            label={
              repeatMode === "off"
                ? "Repeat all"
                : repeatMode === "all"
                ? "Repeat one"
                : "Repeat off"
            }
            disabled={!hasTrack}
            onClick={cycleRepeatMode}
          >
            <FiRepeat className={repeatMode !== "off" ? "text-green-500 text-lg" : "text-lg"} />
          </IconButton>
        </div>

        <div className="flex items-center gap-5">
          <p className={hasTrack ? "" : "text-white/30"}>{formatTime(currentTime)}</p>

          <div
            className={[
              "w-[60vw] max-w-[500px] rounded-full",
              hasTrack ? "bg-gray-300 cursor-pointer" : "bg-white/20 cursor-not-allowed",
            ].join(" ")}
            onClick={seek}
          >
            <div className="h-1 bg-green-800 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>

          <p className={hasTrack ? "" : "text-white/30"}>{formatTime(duration)}</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 opacity-75">
        <IconButton label="Queue" disabled={!hasTrack} onClick={() => {}}>
          <FiList className="text-lg" />
        </IconButton>

        <IconButton label="Devices" disabled={!hasTrack} onClick={() => {}}>
          <FiSpeaker className="text-lg" />
        </IconButton>

        <IconButton label={volume === 0 ? "Unmute" : "Mute"} disabled={false} onClick={toggleMute}>
          {volume === 0 ? <FiVolumeX className="text-lg" /> : <FiVolume2 className="text-lg" />}
        </IconButton>

        <div
          ref={volumeBarRef}
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
          tabIndex={0}
          className="w-20 h-1 rounded select-none touch-none bg-white/20 cursor-pointer"
          onPointerDown={onVolumePointerDown}
          onPointerMove={onVolumePointerMove}
          onPointerUp={onVolumePointerUp}
          onPointerCancel={onVolumePointerUp}
        >
          <div
            className="h-1 rounded bg-white pointer-events-none"
            style={{ width: `${volume * 100}%` }}
          />
        </div>

        {showPlayingExtras && (
          <>
            <IconButton label="Lyrics" disabled={false} onClick={() => {}}>
              <FiMic className="text-lg" />
            </IconButton>

            <IconButton label="Open mini player" disabled={false} onClick={() => {}}>
              <FiMonitor className="text-lg" />
            </IconButton>
          </>
        )}

        <IconButton
          label={isExpanded ? "Exit full screen" : "Full screen"}
          disabled={!hasTrack}
          onClick={() => setIsExpanded((v) => !v)}
        >
          {isExpanded ? (
            <FiMinimize2 className="text-lg" />
          ) : (
            <FiMaximize2 className="text-lg" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default Player;