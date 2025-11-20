import React, { useState } from 'react';
import FavoritesView from './FavoritesView';
import RecentlyPlayedView from './RecentlyPlayedView';
import { Heart, Disc } from 'lucide-react';

const LibraryView = ({ onSongSelect, currentSong, onToggleFavorite, isFavorite }) => {
    const [activeTab, setActiveTab] = useState('favorites');

    const tabs = [
        { id: 'favorites', label: 'Yêu thích', icon: <Heart size={18} /> },
        { id: 'recent', label: 'Đã nghe gần đây', icon: <Disc size={18} /> }
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
                    Thư viện cá nhân
                </h2>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '16px'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 24px',
                                borderRadius: '24px',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? 'transparent' : 'var(--border-color)',
                                background: activeTab === tab.id ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                {activeTab === 'favorites' && (
                    <FavoritesView
                        onSongSelect={onSongSelect}
                        currentSong={currentSong}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite}
                    />
                )}
                {activeTab === 'recent' && (
                    <RecentlyPlayedView
                        onSongSelect={onSongSelect}
                        currentSong={currentSong}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite}
                    />
                )}
            </div>
        </div>
    );
};

export default LibraryView;
