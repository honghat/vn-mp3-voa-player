import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import SongList from './components/SongList';
import FavoritesView from './views/FavoritesView';
import RecentlyPlayedView from './views/RecentlyPlayedView';
import RadioView from './views/RadioView';
import ChartView from './views/ChartView';
import LibraryView from './views/LibraryView';
import { Search, Heart } from 'lucide-react';
import { storage } from './utils/storage';
import Hls from 'hls.js';

const API_URL = 'http://localhost:3010/api';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState('discover');
  const [favorites, setFavorites] = useState([]);
  const audioRef = useRef(new Audio());
  const hlsRef = useRef(null);

  useEffect(() => {
    setFavorites(storage.getFavorites());
  }, []);

  // Fetch default songs on mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${API_URL}/search?q=Đen Vâu`);
        const data = await res.json();

        if (data && data.data && data.data.songs) {
          const formattedSongs = data.data.songs.map(song => ({
            id: song.encodeId,
            title: song.title,
            artist: song.artistsNames,
            album: song.album?.title || 'Unknown',
            duration: formatDuration(song.duration),
            thumbnail: song.thumbnailM,
            url: ''
          }));
          setSongs(formattedSongs);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  // Handle song change and fetching stream
  useEffect(() => {
    const playSong = async () => {
      if (!currentSong) return;

      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Handle radio streaming
      if (currentSong.isRadio) {
        const url = currentSong.url;

        if (url.includes('.m3u8')) {
          // HLS streaming
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
            });
            hlsRef.current = hls;

            hls.loadSource(url);
            hls.attachMedia(audioRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log('HLS manifest loaded, starting playback');
              if (isPlaying) {
                audioRef.current.play().catch(e => console.log("HLS play error:", e));
              }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
              console.error('HLS error:', data);
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.log('Network error, try to recover');
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log('Media error, try to recover');
                    hls.recoverMediaError();
                    break;
                  default:
                    hls.destroy();
                    break;
                }
              }
            });
          } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS support
            audioRef.current.src = url;
            if (isPlaying) {
              audioRef.current.play().catch(e => console.log("Safari HLS play error:", e));
            }
          }
        } else {
          // Direct stream URL
          audioRef.current.src = url;
          if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Radio play error:", e));
          }
        }
        return;
      }

      // Handle regular song streaming
      if (!currentSong.url) {
        try {
          const res = await fetch(`${API_URL}/song/${currentSong.id}`);
          const data = await res.json();
          const streamUrl = data.data ? (data.data['128'] || data.data['320']) : null;

          if (streamUrl) {
            currentSong.url = streamUrl;
            audioRef.current.src = streamUrl;
            if (isPlaying) {
              audioRef.current.play().catch(e => console.log("Play error:", e));
            }
            // Add to recently played
            storage.addToRecentlyPlayed(currentSong);
          }
        } catch (e) {
          console.error("Error fetching song stream:", e);
        }
      } else {
        audioRef.current.src = currentSong.url;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.log("Play error:", e));
        }
      }
    };

    playSong();
  }, [currentSong]);

  useEffect(() => {
    if (isPlaying && audioRef.current.src) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!songs.length) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!songs.length) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleSongSelect = (song) => {
    if (currentSong && song.id === currentSong.id) {
      handlePlayPause();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handlePlayRadio = (station) => {
    console.log('Playing radio:', station);
    const radioSong = {
      id: station.id,
      title: station.name,
      artist: station.description || 'Radio trực tiếp',
      album: 'Radio Việt Nam',
      duration: 'LIVE',
      thumbnail: 'https://via.placeholder.com/150/667eea/ffffff?text=Radio',
      url: station.url,
      isRadio: true
    };
    setCurrentSong(radioSong);
    setIsPlaying(true);
  };

  const toggleFavorite = (song) => {
    if (storage.isFavorite(song.id)) {
      storage.removeFavorite(song.id);
    } else {
      storage.addFavorite(song);
    }
    setFavorites(storage.getFavorites());
  };

  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSearch = async (query) => {
    try {
      const res = await fetch(`${API_URL}/search?q=${query}`);
      const data = await res.json();

      if (data && data.data && data.data.songs) {
        const formattedSongs = data.data.songs.map(song => ({
          id: song.encodeId,
          title: song.title,
          artist: song.artistsNames,
          album: song.album?.title || 'Unknown',
          duration: formatDuration(song.duration),
          thumbnail: song.thumbnailM,
          url: ''
        }));
        setSongs(formattedSongs);

        if (formattedSongs.length > 0) {
          setCurrentSong(formattedSongs[0]);
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="content">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
            <div style={{ position: 'relative', width: '480px' }}>
              <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '15px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.borderColor = 'var(--primary-color)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'var(--border-color)';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                    setCurrentView('discover');
                  }
                }}
              />
            </div>
          </div>

          {/* Main Content */}
          {currentView === 'discover' && (
            <>
              <div style={{
                marginBottom: '40px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '240px',
                background: 'var(--gradient-primary)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
              }}>
                <div style={{
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  background: 'radial-gradient(circle at top right, rgba(240, 147, 251, 0.2), transparent 60%)'
                }}>
                  <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    marginBottom: '12px',
                    background: 'linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.8))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Hat Music</h1>
                  <p style={{ fontSize: '18px', opacity: 0.9, fontWeight: '500' }}>Khám phá và thưởng thức hàng triệu bài hát</p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  marginBottom: '24px',
                  fontSize: '24px',
                  fontWeight: '700',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Kết quả tìm kiếm</h3>
                {songs.length > 0 && (
                  <SongList
                    songs={songs}
                    onSongSelect={handleSongSelect}
                    currentSong={currentSong}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={storage.isFavorite}
                  />
                )}
              </div>
            </>
          )}

          {currentView === 'chart' && (
            <ChartView
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              onToggleFavorite={toggleFavorite}
              isFavorite={storage.isFavorite}
            />
          )}

          {currentView === 'library' && (
            <LibraryView
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
            />
          )}

          {currentView === 'favorites' && (
            <FavoritesView
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
            />
          )}

          {currentView === 'recent' && (
            <RecentlyPlayedView
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
            />
          )}

          {currentView === 'radio' && (
            <RadioView onPlayRadio={handlePlayRadio} />
          )}
        </div>
      </div>
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleFavorite={toggleFavorite}
        isFavorite={storage.isFavorite}
      />
    </div>
  );
}

export default App;
