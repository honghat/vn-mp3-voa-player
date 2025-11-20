import React, { useState, useEffect } from 'react';
import SongList from '../components/SongList';
import { Heart } from 'lucide-react';
import { storage } from '../utils/storage';

const FavoritesView = ({ onSongSelect, currentSong }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(storage.getFavorites());
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--gradient-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Heart size={32} fill="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Yêu thích</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{favorites.length} bài hát</p>
                </div>
            </div>

            {favorites.length > 0 ? (
                <SongList songs={favorites} onSongSelect={onSongSelect} currentSong={currentSong} />
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: 'var(--text-secondary)'
                }}>
                    <Heart size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p>Chưa có bài hát yêu thích</p>
                </div>
            )}
        </div>
    );
};

export default FavoritesView;
