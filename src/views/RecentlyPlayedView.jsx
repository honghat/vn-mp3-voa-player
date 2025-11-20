import React, { useState, useEffect } from 'react';
import SongList from '../components/SongList';
import { Clock } from 'lucide-react';
import { storage } from '../utils/storage';

const RecentlyPlayedView = ({ onSongSelect, currentSong }) => {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        setRecent(storage.getRecentlyPlayed());
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Clock size={32} />
                </div>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Đã nghe gần đây</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{recent.length} bài hát</p>
                </div>
            </div>

            {recent.length > 0 ? (
                <SongList songs={recent} onSongSelect={onSongSelect} currentSong={currentSong} />
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: 'var(--text-secondary)'
                }}>
                    <Clock size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p>Chưa có lịch sử nghe nhạc</p>
                </div>
            )}
        </div>
    );
};

export default RecentlyPlayedView;
