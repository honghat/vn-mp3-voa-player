import React, { useState } from 'react';
import { Play, Music, Heart } from 'lucide-react';

const SongItem = ({ song, currentSong, onSongSelect, onToggleFavorite, isFavorite }) => {
    const [imgError, setImgError] = useState(false);
    const favorite = isFavorite ? isFavorite(song.id) : false;

    return (
        <div
            className="song-item"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: currentSong?.id === song.id ? 'var(--hover-bg)' : 'transparent',
                borderBottom: '1px solid var(--border-color)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentSong?.id === song.id ? 'var(--hover-bg)' : 'transparent'}
        >
            <div style={{ width: '5%', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFavorite) onToggleFavorite(song);
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Heart
                        size={18}
                        fill={favorite ? '#667eea' : 'none'}
                        color={favorite ? '#667eea' : 'var(--text-secondary)'}
                    />
                </button>
            </div>
            <div
                style={{ width: '45%', display: 'flex', alignItems: 'center', gap: '10px' }}
                onClick={() => onSongSelect(song)}
            >
                <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
                    {!imgError && song.thumbnail ? (
                        <img
                            src={song.thumbnail}
                            alt={song.title}
                            style={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Music size={20} color="var(--text-secondary)" />
                        </div>
                    )}

                    {currentSong?.id === song.id && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Music size={16} color="white" />
                        </div>
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: '500', color: currentSong?.id === song.id ? 'var(--primary-color)' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
                </div>
            </div>
            <div
                style={{ width: '35%', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '10px' }}
                onClick={() => onSongSelect(song)}
            >
                {song.album}
            </div>
            <div
                style={{ width: '15%', fontSize: '12px', color: 'var(--text-secondary)' }}
                onClick={() => onSongSelect(song)}
            >
                {song.duration !== '0:00' ? song.duration : ''}
            </div>
        </div>
    );
};

const SongList = ({ songs, onSongSelect, currentSong, onToggleFavorite, isFavorite }) => {
    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', color: 'var(--text-secondary)', fontSize: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase' }}>
                <div style={{ width: '5%' }}></div>
                <div style={{ width: '45%' }}>Bài hát</div>
                <div style={{ width: '35%' }}>Album</div>
                <div style={{ width: '15%' }}>Thời gian</div>
            </div>

            <div style={{ marginTop: '10px' }}>
                {songs.map((song) => (
                    <SongItem
                        key={song.id}
                        song={song}
                        currentSong={currentSong}
                        onSongSelect={onSongSelect}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite}
                    />
                ))}
            </div>
        </div>
    );
};

export default SongList;
