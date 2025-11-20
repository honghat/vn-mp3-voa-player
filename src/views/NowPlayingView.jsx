import React from 'react';
import { Music, Heart, MoreHorizontal } from 'lucide-react';

const NowPlayingView = ({ currentSong, isPlaying, onToggleFavorite, isFavorite }) => {
    if (!currentSong) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-secondary)'
            }}>
                <Music size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Chưa có bài hát nào đang phát</p>
            </div>
        );
    }

    const favorite = isFavorite ? isFavorite(currentSong.id) : false;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '40px',
            textAlign: 'center'
        }}>
            <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                marginBottom: '32px',
                border: '4px solid rgba(255,255,255,0.1)',
                animation: isPlaying ? 'spin 20s linear infinite' : 'none',
                position: 'relative'
            }}>
                <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
                {currentSong.thumbnail ? (
                    <img
                        src={currentSong.thumbnail}
                        alt={currentSong.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Music size={80} color="white" />
                    </div>
                )}
                {/* Center hole for vinyl effect */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    background: '#1a1a1a',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.1)'
                }}></div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{currentSong.title}</h2>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>{currentSong.artist}</p>
                {currentSong.album && currentSong.album !== 'Unknown' && (
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', opacity: 0.7 }}>
                        Album: {currentSong.album}
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                <button
                    onClick={() => onToggleFavorite && onToggleFavorite(currentSong)}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    <Heart
                        size={24}
                        fill={favorite ? '#667eea' : 'none'}
                        color={favorite ? '#667eea' : 'white'}
                    />
                </button>
                <button
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    <MoreHorizontal size={24} color="white" />
                </button>
            </div>
        </div>
    );
};

export default NowPlayingView;
