import React, { useState, useEffect } from 'react';
import SongList from '../components/SongList';
import { TrendingUp } from 'lucide-react';

const ChartView = ({ onSongSelect, currentSong, onToggleFavorite, isFavorite }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    useEffect(() => {
        const fetchTop100 = async () => {
            try {
                const res = await fetch('/api/top100');
                const data = await res.json();

                if (data && data.data) {
                    // Try to find VN section, otherwise take the first one
                    let items = [];

                    // Check if data.data is an array (sections) or object (direct items)
                    if (Array.isArray(data.data)) {
                        const vnTop = data.data.find(section => section.genre?.name === 'Việt Nam') || data.data[0];
                        if (vnTop && vnTop.items) {
                            items = vnTop.items;
                        }
                    } else if (data.data.items) {
                        items = data.data.items;
                    }

                    if (items.length > 0) {
                        const formattedSongs = items.map(song => ({
                            id: song.encodeId,
                            title: song.title,
                            artist: song.artistsNames,
                            album: song.album?.title || song.title || 'Unknown Album',
                            duration: formatDuration(song.duration || 0),
                            thumbnail: song.thumbnailM,
                            url: ''
                        }));
                        setSongs(formattedSongs);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch Top 100:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTop100();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'var(--gradient-primary)',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                }}>
                    <TrendingUp size={40} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                        Bảng Xếp Hạng
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                        Top 100 bài hát hot nhất Việt Nam
                    </p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Đang tải bảng xếp hạng...
                </div>
            ) : (
                <SongList
                    songs={songs}
                    onSongSelect={onSongSelect}
                    currentSong={currentSong}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isFavorite}
                />
            )}
        </div>
    );
};

export default ChartView;
