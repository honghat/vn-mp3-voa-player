import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, MoreHorizontal, Volume2, Music } from 'lucide-react';

const Player = ({ currentSong, isPlaying, onPlayPause, onNext, onPrev, onToggleFavorite, isFavorite }) => {
    const [imgError, setImgError] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const progressBarRef = useRef(null);
    const [volume, setVolume] = useState(0.7);
    // Cập nhật volume khi thay đổi
    useEffect(() => {
        const audio = window.document.querySelector('audio');
        if (audio) audio.volume = volume;
    }, [volume]);
    // Xử lý thay đổi âm lượng khi kéo thanh volume
    const handleVolumeChange = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        setVolume(percent);
    };

    // Reset error state when song changes
    useEffect(() => {
        setImgError(false);
        setCurrentTime(0);
        setDuration(0);
    }, [currentSong?.id]);

    // Lấy audio element từ window (do audioRef nằm ở App.jsx)
    useEffect(() => {
        const audio = window.document.querySelector('audio');
        if (!audio) return;
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration || 0);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('durationchange', updateDuration);
        updateDuration();
        updateTime();
        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('durationchange', updateDuration);
        };
    }, [currentSong?.id]);

    if (!currentSong) return <div className="player-control"></div>;

    const favorite = isFavorite ? isFavorite(currentSong.id) : false;

    // Format thời gian mm:ss
    const formatTime = (sec) => {
        if (!sec || isNaN(sec)) return '0:00';
        const min = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${min}:${s < 10 ? '0' : ''}${s}`;
    };

    // Xử lý tua nhạc khi click/kéo trên progress bar
    const handleSeek = (e) => {
        const audio = window.document.querySelector('audio');
        if (!audio || !progressBarRef.current || !duration) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        audio.currentTime = percent * duration;
        setCurrentTime(audio.currentTime);
    };

    return (
        <div className="player-control">
            {/* Song Info */}
            <div style={{ display: 'flex', alignItems: 'center', width: '30%', gap: '15px' }}>
                <div style={{ width: '64px', height: '64px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!imgError && currentSong.thumbnail ? (
                        <img
                            src={currentSong.thumbnail}
                            alt={currentSong.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <Music size={32} color="var(--text-secondary)" />
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSong.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {currentSong.artist}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite && onToggleFavorite(currentSong);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                        <Heart
                            size={16}
                            fill={favorite ? '#667eea' : 'none'}
                            color={favorite ? '#667eea' : 'var(--text-secondary)'}
                        />
                    </button>
                    <MoreHorizontal size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={(e) => e.stopPropagation()} />
                </div>
            </div>

            {/* Controls */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                    <Shuffle size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={(e) => e.stopPropagation()} />
                    <SkipBack size={24} fill="white" style={{ cursor: 'pointer' }} onClick={(e) => onPrev && onPrev(e)} />
                    <div
                        onClick={(e) => onPlayPause && onPlayPause(e)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '1px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: '2px' }} />}
                    </div>
                    <SkipForward size={24} fill="white" style={{ cursor: 'pointer' }} onClick={(e) => onNext && onNext(e)} />
                    <Repeat size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={(e) => e.stopPropagation()} />
                </div>

                {/* Progress Bar (Mock) */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>{formatTime(currentTime)}</span>
                    <div
                        ref={progressBarRef}
                        style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }}
                        onClick={handleSeek}
                    >
                        <div style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, height: '100%', background: 'white', borderRadius: '2px' }}></div>
                        <div style={{ position: 'absolute', left: `${duration ? (currentTime / duration) * 100 : 0}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: 'white', borderRadius: '50%' }}></div>
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume/Options */}
            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                <Volume2 size={20} color="var(--text-primary)" />
                <div
                    style={{ width: '70px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}
                    onClick={handleVolumeChange}
                >
                    <div style={{ width: `${volume * 100}%`, height: '100%', background: 'white', borderRadius: '2px' }}></div>
                    <div style={{ position: 'absolute', left: `${volume * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: 'white', borderRadius: '50%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Player;
