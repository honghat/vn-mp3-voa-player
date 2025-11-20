import React, { useState, useEffect } from 'react';
import { Plus, Music, Trash2, PlayCircle, ArrowLeft } from 'lucide-react';
import { storage } from '../utils/storage';
import SongList from '../components/SongList';

const PlaylistView = ({ onSongSelect, currentSong, onToggleFavorite, isFavorite }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = () => {
        setPlaylists(storage.getPlaylists());
    };

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            storage.createPlaylist(newPlaylistName);
            setNewPlaylistName('');
            setIsCreating(false);
            loadPlaylists();
        }
    };

    const handleDeletePlaylist = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc muốn xóa playlist này?')) {
            storage.deletePlaylist(id);
            loadPlaylists();
            if (selectedPlaylist?.id === id) {
                setSelectedPlaylist(null);
            }
        }
    };

    if (selectedPlaylist) {
        return (
            <div>
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setSelectedPlaylist(null)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginBottom: '16px'
                        }}
                    >
                        <ArrowLeft size={18} /> Quay lại danh sách Playlist
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '12px',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                        }}>
                            <Music size={64} color="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{selectedPlaylist.name}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {selectedPlaylist.songs.length} bài hát • Tạo bởi Bạn
                            </p>
                        </div>
                    </div>
                </div>

                {selectedPlaylist.songs.length > 0 ? (
                    <SongList
                        songs={selectedPlaylist.songs}
                        onSongSelect={onSongSelect}
                        currentSong={currentSong}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <p>Chưa có bài hát nào trong playlist này.</p>
                        <p style={{ fontSize: '13px', marginTop: '8px' }}>Hãy thêm bài hát từ danh sách yêu thích hoặc tìm kiếm.</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Playlist của bạn</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} /> Tạo Playlist mới
                </button>
            </div>

            {isCreating && (
                <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Nhập tên playlist..."
                        autoFocus
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            outline: 'none'
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                    />
                    <button
                        onClick={handleCreatePlaylist}
                        style={{
                            padding: '0 24px',
                            borderRadius: '8px',
                            background: 'var(--primary-color)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Tạo
                    </button>
                    <button
                        onClick={() => setIsCreating(false)}
                        style={{
                            padding: '0 24px',
                            borderRadius: '8px',
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                        }}
                    >
                        Hủy
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                {playlists.map(playlist => (
                    <div
                        key={playlist.id}
                        onClick={() => setSelectedPlaylist(playlist)}
                        style={{
                            cursor: 'pointer',
                            group: 'playlist-card'
                        }}
                    >
                        <div style={{
                            aspectRatio: '1',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.querySelector('.play-btn').style.opacity = 1;
                                e.currentTarget.querySelector('.play-btn').style.transform = 'translateY(0)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.querySelector('.play-btn').style.opacity = 0;
                                e.currentTarget.querySelector('.play-btn').style.transform = 'translateY(10px)';
                            }}
                        >
                            {playlist.songs.length > 0 ? (
                                <img
                                    src={playlist.songs[0].thumbnail}
                                    alt={playlist.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Music size={48} color="var(--text-secondary)" />
                            )}

                            <div className="play-btn" style={{
                                position: 'absolute',
                                opacity: 0,
                                transform: 'translateY(10px)',
                                transition: 'all 0.3s ease',
                                background: 'rgba(0,0,0,0.5)',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '16px'
                            }}>
                                <PlayCircle size={48} color="white" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{playlist.name}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{playlist.songs.length} bài hát</p>
                            </div>
                            <button
                                onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                                title="Xóa playlist"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {playlists.length === 0 && !isCreating && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <Music size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>Bạn chưa có playlist nào.</p>
                        <button
                            onClick={() => setIsCreating(true)}
                            style={{
                                marginTop: '16px',
                                background: 'none',
                                border: '1px solid var(--primary-color)',
                                color: 'var(--primary-color)',
                                padding: '8px 24px',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            Tạo ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistView;
