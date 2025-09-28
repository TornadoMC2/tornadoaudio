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
  const [isDraggingVolume, setIsDraggingVolume] = useState(false); // Track if user is dragging volume slider

  // New lazy loading states
  const [audioLoadingState, setAudioLoadingState] = useState('unloaded'); // 'unloaded', 'loading', 'loaded', 'error'
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [audioError, setAudioError] = useState(null);

  const beforeRef = useRef(null);
  const afterRef = useRef(null);
  const volumeDropdownRef = useRef(null);
  const volumeSliderRef = useRef(null);

  // Update audio volumes when volume state changes
  useEffect(() => {
    if (beforeRef.current) {
      beforeRef.current.volume = volume;
    }
    if (afterRef.current) {
      afterRef.current.volume = volume;
    }
  }, [volume]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeDropdownRef.current && !volumeDropdownRef.current.contains(event.target) && !isDraggingVolume) {
        setShowVolumeDropdown(false);
      }
    };

    if (showVolumeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showVolumeDropdown, isDraggingVolume]);

  // Lazy loading effect - only set up audio when loaded
  useEffect(() => {
    if (audioLoadingState !== 'loaded') return;

    const beforeAudioEl = beforeRef.current;
    const afterAudioEl = afterRef.current;

    if (beforeAudioEl && afterAudioEl) {
      // Set initial volume
      beforeAudioEl.volume = volume;
      afterAudioEl.volume = volume;

      // Simple time update - no sync, just track current time
      const handleTimeUpdate = () => {
        const activeAudio = currentTrack === 'before' ? beforeAudioEl : afterAudioEl;
        setCurrentTime(activeAudio.currentTime);
      };

      // Handle metadata loaded - use shorter duration to trim longer audio
      const handleLoadedMetadata = () => {
        const beforeDuration = beforeAudioEl.duration || 0;
        const afterDuration = afterAudioEl.duration || 0;

        // Use the shorter duration to ensure sync throughout and effectively "trim" longer audio
        const shortestDuration = Math.min(beforeDuration, afterDuration);
        setDuration(shortestDuration);
        setIsLoaded(true);
        
        // Ensure both tracks start at the same position
        beforeAudioEl.currentTime = 0;
        afterAudioEl.currentTime = 0;
      };

      // Handle audio ended or reaching the trimmed duration
      const handleEnded = () => {
        setIsPlaying(false);
        // Reset both tracks to beginning for consistency
        beforeAudioEl.currentTime = 0;
        afterAudioEl.currentTime = 0;
        setCurrentTime(0);
      };

      // Check if we've reached the end of the shorter track during playback
      const checkDurationLimit = () => {
        const activeAudio = currentTrack === 'before' ? beforeAudioEl : afterAudioEl;

        // Stop playback if we've reached the duration limit (shortest track length)
        if (activeAudio.currentTime >= duration && duration > 0) {
          handleEnded();
        }
      };

      // Handle loading progress
      const handleProgress = (audio) => {
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const duration = audio.duration;
          if (duration > 0) {
            const progress = (bufferedEnd / duration) * 100;
            setLoadingProgress(Math.min(progress, 100));
          }
        }
      };

      // Handle loading errors
      const handleError = (e) => {
        console.error('Audio loading error:', e);
        setAudioError('Failed to load audio. Please try again.');
        setAudioLoadingState('error');
      };

      const activeAudio = currentTrack === 'before' ? beforeAudioEl : afterAudioEl;

      // Simple event listeners - no complex sync
      activeAudio.addEventListener('timeupdate', handleTimeUpdate);
      activeAudio.addEventListener('timeupdate', checkDurationLimit);
      activeAudio.addEventListener('ended', handleEnded);
      beforeAudioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
      afterAudioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
      beforeAudioEl.addEventListener('progress', () => handleProgress(beforeAudioEl));
      afterAudioEl.addEventListener('progress', () => handleProgress(afterAudioEl));
      beforeAudioEl.addEventListener('error', handleError);
      afterAudioEl.addEventListener('error', handleError);

      return () => {
        activeAudio.removeEventListener('timeupdate', handleTimeUpdate);
        activeAudio.removeEventListener('timeupdate', checkDurationLimit);
        activeAudio.removeEventListener('ended', handleEnded);
        beforeAudioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
        afterAudioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
        beforeAudioEl.removeEventListener('progress', () => handleProgress(beforeAudioEl));
        afterAudioEl.removeEventListener('progress', () => handleProgress(afterAudioEl));
        beforeAudioEl.removeEventListener('error', handleError);
        afterAudioEl.removeEventListener('error', handleError);
      };
    }
  }, [currentTrack, volume, audioLoadingState, duration]);

  // Function to load audio files lazily
  const loadAudioFiles = async () => {
    if (audioLoadingState === 'loading' || audioLoadingState === 'loaded') return;

    setAudioLoadingState('loading');
    setLoadingProgress(0);
    setAudioError(null);
    setIsLoaded(false); // Reset isLoaded when starting to load

    try {
      const beforeAudioEl = beforeRef.current;
      const afterAudioEl = afterRef.current;

      if (beforeAudioEl && afterAudioEl) {
        // Set preload to auto to ensure both tracks have enough buffered data for seamless switching
        beforeAudioEl.preload = 'auto';
        afterAudioEl.preload = 'auto';

        // Force load by setting src again
        beforeAudioEl.load();
        afterAudioEl.load();

        // Wait for both to be ready with enough data for smooth playback
        await Promise.all([
          new Promise((resolve, reject) => {
            const handleCanPlay = () => {
              beforeAudioEl.removeEventListener('canplaythrough', handleCanPlay);
              beforeAudioEl.removeEventListener('error', handleError);
              resolve();
            };
            const handleError = (e) => {
              beforeAudioEl.removeEventListener('canplaythrough', handleCanPlay);
              beforeAudioEl.removeEventListener('error', handleError);
              reject(e);
            };

            // Use canplaythrough to ensure enough data is buffered for seamless switching
            if (beforeAudioEl.readyState >= 4) {
              resolve(); // Already can play through
            } else {
              beforeAudioEl.addEventListener('canplaythrough', handleCanPlay);
              beforeAudioEl.addEventListener('error', handleError);
            }
          }),
          new Promise((resolve, reject) => {
            const handleCanPlay = () => {
              afterAudioEl.removeEventListener('canplaythrough', handleCanPlay);
              afterAudioEl.removeEventListener('error', handleError);
              resolve();
            };
            const handleError = (e) => {
              afterAudioEl.removeEventListener('canplaythrough', handleCanPlay);
              afterAudioEl.removeEventListener('error', handleError);
              reject(e);
            };

            // Use canplaythrough to ensure enough data is buffered for seamless switching
            if (afterAudioEl.readyState >= 4) {
              resolve(); // Already can play through
            } else {
              afterAudioEl.addEventListener('canplaythrough', handleCanPlay);
              afterAudioEl.addEventListener('error', handleError);
            }
          })
        ]);

        // Set both states when audio is ready - use the shorter duration to trim longer audio
        const beforeDuration = beforeAudioEl.duration || 0;
        const afterDuration = afterAudioEl.duration || 0;
        const shortestDuration = Math.min(beforeDuration, afterDuration);

        setDuration(shortestDuration);
        setIsLoaded(true);
        setAudioLoadingState('loaded');
        setLoadingProgress(100);
        
        // Pre-sync both tracks to starting position for consistency
        beforeAudioEl.currentTime = 0;
        afterAudioEl.currentTime = 0;
      }
    } catch (error) {
      console.error('Error loading audio files:', error);
      setAudioError('Failed to load audio files. Please check your internet connection and try again.');
      setAudioLoadingState('error');
      setIsLoaded(false);
    }
  };

  const handleFirstInteraction = async () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      if (audioLoadingState === 'unloaded') {
        await loadAudioFiles();
      }
    }
  };

  const togglePlayback = async () => {
    const shouldPlayAfterLoad = !isPlaying && audioLoadingState === 'unloaded';

    await handleFirstInteraction();

    if (audioLoadingState !== 'loaded') {
      // If we're still loading and user wanted to play, set a flag to play after loading
      if (shouldPlayAfterLoad) {
        // Wait for loading to complete, then play
        const waitForLoad = setInterval(() => {
          if (audioLoadingState === 'loaded') {
            clearInterval(waitForLoad);
            // Auto-play after loading is complete
            const activeAudio = currentTrack === 'before' ? beforeRef.current : afterRef.current;
            if (activeAudio) {
              activeAudio.play().then(() => {
                setIsPlaying(true);
              }).catch(error => {
                console.error('Error auto-playing audio after load:', error);
                setAudioError('Unable to play audio. Please try again.');
              });
            }
          } else if (audioLoadingState === 'error') {
            clearInterval(waitForLoad);
          }
        }, 100);
      }
      return; // Don't play if audio isn't loaded yet
    }

    const activeAudio = currentTrack === 'before' ? beforeRef.current : afterRef.current;
    const inactiveAudio = currentTrack === 'before' ? afterRef.current : beforeRef.current;

    if (isPlaying) {
      activeAudio.pause();
      inactiveAudio.pause();
    } else {
      try {
        await activeAudio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioError('Unable to play audio. Please try again.');
        return;
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Enhanced sync function to keep both tracks in perfect sync
  const syncBothTracks = (sourceAudio, targetAudio) => {
    if (sourceAudio && targetAudio && sourceAudio.readyState >= 1 && targetAudio.readyState >= 1) {
      const timeDiff = Math.abs(targetAudio.currentTime - sourceAudio.currentTime);
      // Only sync if there's a significant difference (more than 50ms)
      if (timeDiff > 0.05) {
        targetAudio.currentTime = sourceAudio.currentTime;
      }
    }
  };

  const switchTrack = async (track) => {
    await handleFirstInteraction();

    if (audioLoadingState !== 'loaded') {
      return; // Don't switch if audio isn't loaded yet
    }

    // Get references to both audio elements
    const beforeAudio = beforeRef.current;
    const afterAudio = afterRef.current;
    const currentAudio = currentTrack === 'before' ? beforeAudio : afterAudio;
    const newActiveAudio = track === 'before' ? beforeAudio : afterAudio;

    // If switching to the same track, do nothing
    if (currentTrack === track) {
      return;
    }

    const wasPlaying = isPlaying;
    const currentTime = currentAudio.currentTime;

    // Pre-sync the new track to the exact current time
    syncBothTracks(currentAudio, newActiveAudio);

    // For seamless switching during playback
    if (wasPlaying) {
      try {
        // Start the new track playing at the exact same time
        newActiveAudio.currentTime = currentTime;
        await newActiveAudio.play();

        // Immediately pause the old track to avoid overlap
        currentAudio.pause();

        // Update state
        setCurrentTrack(track);

        // Fine-tune synchronization after the switch
        setTimeout(() => {
          syncBothTracks(newActiveAudio, currentAudio);
        }, 10);

      } catch (error) {
        console.error('Error playing audio after track switch:', error);
        setAudioError('Unable to play audio. Please try again.');
        // Fallback: pause everything if there's an error
        beforeAudio.pause();
        afterAudio.pause();
        setIsPlaying(false);
      }
    } else {
      // When not playing, just sync and switch
      newActiveAudio.currentTime = currentTime;
      currentAudio.pause();
      setCurrentTrack(track);

      // Ensure both tracks stay synced
      setTimeout(() => {
        syncBothTracks(newActiveAudio, currentAudio);
      }, 10);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  const handleVolumeTouchStart = (e) => {
    e.stopPropagation();
    setIsDraggingVolume(true);
    // Don't prevent default - let browser handle the touch
  };

  const handleVolumeTouchEnd = (e) => {
    e.stopPropagation();
    // Delay clearing drag state to prevent dropdown from closing
    setTimeout(() => {
      setIsDraggingVolume(false);
    }, 100);
  };

  // Remove the problematic handleVolumeTouchMove - let browser handle it natively
  const handleVolumeSliderInteraction = (e) => {
    e.stopPropagation();
    // Prevent any parent events during slider interaction
  };

  const toggleVolumeDropdown = (e) => {
    e.stopPropagation();
    setShowVolumeDropdown(!showVolumeDropdown);
  };

  const handleVolumeDropdownClick = (e) => {
    e.stopPropagation();
  };

  const handleProgressChange = (e) => {
    if (audioLoadingState !== 'loaded') return;

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

  const retryLoading = () => {
    setAudioLoadingState('unloaded');
    setAudioError(null);
    setLoadingProgress(0);
    loadAudioFiles();
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
        <div className="volume-dropdown-container" ref={volumeDropdownRef}>
          <button
              className="volume-toggle-btn"
              onClick={toggleVolumeDropdown}
              aria-label="Volume control"
              disabled={audioLoadingState !== 'loaded'}
          >
            🔊
          </button>
          {showVolumeDropdown && (
              <div className="volume-dropdown" onClick={handleVolumeDropdownClick}>
                <div className="volume-control-dropdown">
                  <span>Volume</span>
                  <input
                      ref={volumeSliderRef}
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      onMouseDown={handleVolumeMouseDown}
                      onMouseUp={handleVolumeMouseUp}
                      onTouchStart={handleVolumeTouchStart}
                      onTouchEnd={handleVolumeTouchEnd}
                      onPointerDown={handleVolumeSliderInteraction}
                      onPointerMove={handleVolumeSliderInteraction}
                      className="volume-slider-dropdown"
                      aria-label="Volume control"
                      disabled={audioLoadingState !== 'loaded'}
                  />
                  <span className="volume-percentage-dropdown">{Math.round(volume * 100)}%</span>
                </div>
              </div>
          )}
        </div>

        {/* Loading State Display */}
        {audioLoadingState === 'loading' && (
          <div className="audio-loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Loading audio files...</p>
              <div className="loading-progress-bar">
                <div
                  className="loading-progress-fill"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className="loading-percentage">{Math.round(loadingProgress)}%</span>
            </div>
          </div>
        )}

        {/* Error State Display */}
        {audioLoadingState === 'error' && (
          <div className="audio-error-overlay">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <p>{audioError}</p>
              <button className="retry-btn" onClick={retryLoading}>
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="audio-controls">
          <div className="track-selector">
            <button
                className={`track-btn ${currentTrack === 'before' ? 'active' : ''}`}
                onClick={() => switchTrack('before')}
                disabled={audioLoadingState === 'loading'}
            >
              Before Mix
              {audioLoadingState === 'unloaded' && <span className="load-indicator">Click to load</span>}
            </button>
            <button
                className={`track-btn ${currentTrack === 'after' ? 'active' : ''}`}
                onClick={() => switchTrack('after')}
                disabled={audioLoadingState === 'loading'}
            >
              After Mix
              {audioLoadingState === 'unloaded' && <span className="load-indicator">Click to load</span>}
            </button>
          </div>

          <div className="playback-controls">
            {audioLoadingState === 'unloaded' && (
              <span className="play-hint">Click to load and play</span>
            )}
            <button
              className="play-btn"
              onClick={togglePlayback}
              disabled={audioLoadingState === 'loading' || audioLoadingState === 'error'}
            >
              {audioLoadingState === 'loading' ? '⏳' :
               audioLoadingState === 'error' ? '❌' :
               isPlaying ? '⏸️' : '▶️'}
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
              disabled={!isLoaded || audioLoadingState !== 'loaded'}
              aria-label="Audio progress"
          />
          <span className="time-display">{formatTime(duration)}</span>
        </div>

        <div className="current-track-info">
          <span>Now playing: {currentTrack === 'before' ? 'Original Track' : 'Mixed Track'}</span>
          {audioLoadingState === 'loading' && <span className="loading-indicator"> • Loading audio...</span>}
          {audioLoadingState === 'unloaded' && <span className="unloaded-indicator"> • Click play to load audio</span>}
        </div>

        {/* Hidden audio elements - now with preload="none" for lazy loading */}
        <audio ref={beforeRef} preload="none">
          <source src={beforeAudio} type="audio/mpeg" />
          <source src={beforeAudio} type="audio/wav" />
        </audio>
        <audio ref={afterRef} preload="none">
          <source src={afterAudio} type="audio/mpeg" />
          <source src={afterAudio} type="audio/wav" />
        </audio>
      </div>
  );
};

export default AudioComparison;

