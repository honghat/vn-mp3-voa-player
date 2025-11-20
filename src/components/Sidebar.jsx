import React from 'react';
import { Home, Disc, Radio, Library, Music2, TrendingUp, Heart, User, Headphones } from 'lucide-react';

const Sidebar = ({ currentView, onViewChange }) => {
    return (
        <div className="sidebar">
            <div className="logo" style={{
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'var(--gradient-primary)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
                <Music2 size={32} strokeWidth={2.5} />
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Hat Music</h2>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>Âm nhạc mọi lúc</p>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <NavItem
                    icon={<Home size={22} />}
                    label="Khám phá"
                    active={currentView === 'discover'}
                    onClick={() => onViewChange('discover')}
                />
                <NavItem
                    icon={<TrendingUp size={22} />}
                    label="BXH"
                    active={currentView === 'chart'}
                    onClick={() => onViewChange('chart')}
                />
                <NavItem
                    icon={<Radio size={22} />}
                    label="Radio Online"
                    active={currentView === 'radio'}
                    onClick={() => onViewChange('radio')}
                />
                <NavItem
                    icon={<Library size={22} />}
                    label="Thư viện"
                    active={currentView === 'library'}
                    onClick={() => onViewChange('library')}
                />
            </nav>

            <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border-color)'
            }}>
                <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Nhạc của tui
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <NavItem
                        icon={<Heart size={20} />}
                        label="Yêu thích"
                        small
                        active={currentView === 'favorites'}
                        onClick={() => onViewChange('favorites')}
                    />
                    <NavItem
                        icon={<Disc size={20} />}
                        label="Đã nghe gần đây"
                        small
                        active={currentView === 'recent'}
                        onClick={() => onViewChange('recent')}
                    />
                </nav>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, small, onClick }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: small ? '10px 12px' : '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: active ? 'var(--hover-bg)' : 'transparent',
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: small ? '14px' : '15px',
            fontWeight: active ? '600' : '500',
            transition: 'all 0.2s ease',
            position: 'relative'
        }}
        className="nav-item"
        onClick={onClick}
        onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.background = 'rgba(102, 126, 234, 0.08)';
        }}
        onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.background = 'transparent';
        }}
    >
        {active && (
            <div style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3px',
                height: '60%',
                background: 'var(--gradient-primary)',
                borderRadius: '0 2px 2px 0'
            }} />
        )}
        <div style={{ marginLeft: active ? '4px' : '0', transition: 'margin 0.2s ease' }}>
            {icon}
        </div>
        <span>{label}</span>
    </div>
);

export default Sidebar;
