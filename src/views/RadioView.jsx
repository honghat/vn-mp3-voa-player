import React from 'react';
import { Play, Waves } from 'lucide-react';

const RadioView = ({ onPlayRadio }) => {
    const stations = [
        {
            id: 'vov1',
            name: 'VOV1 - Kênh Thời sự',
            url: 'https://stream.vovmedia.vn/vov1',
            description: 'Đài Tiếng nói Việt Nam'
        },
        {
            id: 'vovgt',
            name: 'VOV Giao thông Hà Nội FM 91MHz',
            url: 'https://play.vovgiaothong.vn/live/gthn/playlist.m3u8',
            description: 'Giao thông Hà Nội'
        },
        {
            id: 'vohhcm',
            name: 'VOH FM 87.7 - Nhịp sống Sài Gòn',
            url: 'https://strm.voh.com.vn/radio/channel5/playlist.m3u8',
            description: 'Voice of Ho Chi Minh City'
        },
        {
            id: 'hanoi90',
            name: 'FM Hanoi 90 MHz',
            url: 'http://14.162.146.90:8000/HANOI90',
            description: 'Đài Phát thanh Hà Nội'
        },
        {
            id: 'edm1',
            name: 'Electronic Dance Music 24/7',
            url: 'https://cast.magicstreams.gr:9111/stream',
            description: 'EDM & Dance hits non-stop'
        },
        {
            id: 'jazz1',
            name: 'Smooth Jazz 24.7',
            url: 'https://smoothjazz.cdnstream1.com/2585_128.mp3',
            description: 'Relaxing Smooth Jazz'
        },
        {
            id: 'chill1',
            name: 'Chillout Lounge',
            url: 'https://streams.ilovemusic.de/iloveradio17.mp3',
            description: 'Electronic Chillout & Lounge'
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                    Radio VOV & Âm nhạc Điện tử
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    Nghe VOV Việt Nam và nhạc điện tử 24/7
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
            }}>
                {stations.map((station) => (
                    <div
                        key={station.id}
                        style={{
                            padding: '24px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={() => onPlayRadio(station)}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '12px',
                                background: 'var(--gradient-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Waves size={28} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
                                    {station.name}
                                </h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    {station.description}
                                </p>
                                <button
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        background: 'var(--gradient-primary)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <Play size={14} />
                                    Nghe trực tiếp
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RadioView;
