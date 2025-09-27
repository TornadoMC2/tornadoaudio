import React, { useState, useRef, useEffect } from 'react';
import './AudioComparison.css';

const AudioComparison = ({ beforeAudio, afterAudio, title, description, isPlaceholder }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('before'); // 'before' or 'after'
  const [volume, setVolume] = useState(0.7); // Single volume control for both tracks (0.0 to 1.0)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVolumeDropdown, setShowVolumeDropdown] = useState(false); // Volume dropdown state
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  // Update audio volumes when volume state changes
  useEffect(() => {
    if (beforeRef.current) {
      beforeRef.current.volume = volume;
    }
    if (afterRef.current) {
      afterRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const beforeAudioEl = beforeRef.current;
    const afterAudioEl = afterRef.current;

    if (beforeAudioEl && afterAudioEl) {
      // Set initial volume
      beforeAudioEl.volume = volume;
      afterAudioEl.volume = volume;

      // Handle metadata loaded
      const handleLoadedMetadata = () => {
        setDuration(beforeAudioEl.duration || afterAudioEl.duration);
        setIsLoaded(true);
      };

      // Handle time update
      const handleTimeUpdate = () => {
        const activeAudio = currentTrack === 'before' ? beforeAudioEl : afterAudioEl;
        setCurrentTime(activeAudio.currentTime);
      };

      // Handle audio ended
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      // Sync the audio elements
      const syncAudio = () => {
        if (currentTrack === 'before') {
          afterAudioEl.currentTime = beforeAudioEl.currentTime;
        } else {
          beforeAudioEl.currentTime = afterAudioEl.currentTime;
        }
      };

      const activeAudio = currentTrack === 'before' ? beforeAudioEl : afterAudioEl;

      activeAudio.addEventListener('timeupdate', syncAudio);
      activeAudio.addEventListener('timeupdate', handleTimeUpdate);
      activeAudio.addEventListener('ended', handleEnded);
      beforeAudioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
      afterAudioEl.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        activeAudio.removeEventListener('timeupdate', syncAudio);
        activeAudio.removeEventListener('timeupdate', handleTimeUpdate);
        activeAudio.removeEventListener('ended', handleEnded);
        beforeAudioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
        afterAudioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentTrack, volume]);

  const togglePlayback = () => {
    const activeAudio = currentTrack === 'before' ? beforeRef.current : afterRef.current;
    const inactiveAudio = currentTrack === 'before' ? afterRef.current : beforeRef.current;

    if (isPlaying) {
      activeAudio.pause();
      inactiveAudio.pause();
    } else {
      activeAudio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const switchTrack = (track) => {
    const currentTime = (currentTrack === 'before' ? beforeRef.current : afterRef.current).currentTime;
    const wasPlaying = isPlaying;

    if (isPlaying) {
      beforeRef.current.pause();
      afterRef.current.pause();
    }

    setCurrentTrack(track);

    setTimeout(() => {
      const newActiveAudio = track === 'before' ? beforeRef.current : afterRef.current;
      newActiveAudio.currentTime = currentTime;

      if (wasPlaying) {
        newActiveAudio.play();
      }
    }, 50);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleVolumeDropdown = () => {
    setShowVolumeDropdown(!showVolumeDropdown);
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    const activeAudio = currentTrack === 'before' ? beforeRef.current : afterRef.current;
    const inactiveAudio = currentTrack === 'before' ? afterRef.current : beforeRef.current;

    if (activeAudio && inactiveAudio) {
      activeAudio.currentTime = newTime;
      inactiveAudio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // If this is a placeholder, render a different layout
  if (isPlaceholder) {
    const scrollToContact = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    return (
      <div className="audio-comparison placeholder-comparison">
        <h3>{title}</h3>
        <p>{description}</p>

        <div className="placeholder-content">
          <div className="placeholder-visual">
            <div className="waveform-placeholder">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
            <div className="placeholder-text">Your Music Here</div>
          </div>

          <button className="get-started-btn" onClick={scrollToContact}>
            Get Started Today
          </button>

          <div className="placeholder-features">
            <div className="feature-item">✓ Professional Quality</div>
            <div className="feature-item">✓ Fast Turnaround</div>
            <div className="feature-item">✓ Unlimited Revisions*</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-comparison">
      <h3>{title}</h3>
      <p>{description}</p>

      {/* Volume Dropdown - positioned in top right corner */}
      <div className="volume-dropdown-container">
        <button
          className="volume-toggle-btn"
          onClick={toggleVolumeDropdown}
          aria-label="Volume control"
        >
          🔊
        </button>
        {showVolumeDropdown && (
          <div className="volume-dropdown">
            <div className="volume-control-dropdown">
              <span>Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider-dropdown"
                aria-label="Volume control"
              />
              <span className="volume-percentage-dropdown">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="audio-controls">
        <div className="track-selector">
          <button
            className={`track-btn ${currentTrack === 'before' ? 'active' : ''}`}
            onClick={() => switchTrack('before')}
          >
            Before Mix
          </button>
          <button
            className={`track-btn ${currentTrack === 'after' ? 'active' : ''}`}
            onClick={() => switchTrack('after')}
          >
            After Mix
          </button>
        </div>

        <div className="playback-controls">
          <button className="play-btn" onClick={togglePlayback} disabled={!isLoaded}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      <div className="progress-control">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleProgressChange}
          className="progress-slider"
          disabled={!isLoaded}
          aria-label="Audio progress"
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <div className="current-track-info">
        <span>Now playing: {currentTrack === 'before' ? 'Original Track' : 'Mixed Track'}</span>
        {!isLoaded && <span className="loading-indicator"> • Loading audio...</span>}
      </div>

      {/* Hidden audio elements */}
      <audio ref={beforeRef} preload="metadata">
        <source src={beforeAudio} type="audio/mpeg" />
      </audio>
      <audio ref={afterRef} preload="metadata">
        <source src={afterAudio} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AudioComparison;
