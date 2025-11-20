import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, MoreHorizontal, Volume2, Music } from 'lucide-react';

const Player = ({ currentSong, isPlaying, onPlayPause, onNext, onPrev, onToggleFavorite, isFavorite }) => {
    const [imgError, setImgError] = useState(false);

    // Reset error state when song changes
    useEffect(() => {
        setImgError(false);
    }, [currentSong?.id]);

    if (!currentSong) return <div className="player-control"></div>;

    const favorite = isFavorite ? isFavorite(currentSong.id) : false;

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
                    <span>0:00</span>
                    <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ width: '30%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
                        <div style={{ position: 'absolute', left: '30%', top: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: 'white', borderRadius: '50%' }}></div>
                    </div>
                    <span>{currentSong.duration}</span>
                </div>
            </div>

            {/* Volume/Options */}
            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                <Volume2 size={20} color="var(--text-primary)" />
                <div style={{ width: '70px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Player;
