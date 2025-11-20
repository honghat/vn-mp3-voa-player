// LocalStorage utilities for managing user data
export const storage = {
    // Favorites
    getFavorites: () => {
        const favorites = localStorage.getItem('hat_music_favorites');
        return favorites ? JSON.parse(favorites) : [];
    },

    addFavorite: (song) => {
        const favorites = storage.getFavorites();
        if (!favorites.find(s => s.id === song.id)) {
            favorites.push(song);
            localStorage.setItem('hat_music_favorites', JSON.stringify(favorites));
        }
    },

    removeFavorite: (songId) => {
        const favorites = storage.getFavorites();
        const updated = favorites.filter(s => s.id !== songId);
        localStorage.setItem('hat_music_favorites', JSON.stringify(updated));
    },

    isFavorite: (songId) => {
        const favorites = storage.getFavorites();
        return favorites.some(s => s.id === songId);
    },

    // Recently Played
    getRecentlyPlayed: () => {
        const recent = localStorage.getItem('hat_music_recent');
        return recent ? JSON.parse(recent) : [];
    },

    addToRecentlyPlayed: (song) => {
        let recent = storage.getRecentlyPlayed();
        // Remove if already exists
        recent = recent.filter(s => s.id !== song.id);
        // Add to beginning
        recent.unshift({ ...song, playedAt: new Date().toISOString() });
        // Keep only last 50
        recent = recent.slice(0, 50);
        localStorage.setItem('hat_music_recent', JSON.stringify(recent));
    },

    // Playlists
    getPlaylists: () => {
        const playlists = localStorage.getItem('hat_music_playlists');
        return playlists ? JSON.parse(playlists) : [];
    },

    createPlaylist: (name) => {
        const playlists = storage.getPlaylists();
        const newPlaylist = {
            id: Date.now().toString(),
            name,
            songs: [],
            createdAt: new Date().toISOString()
        };
        playlists.push(newPlaylist);
        localStorage.setItem('hat_music_playlists', JSON.stringify(playlists));
        return newPlaylist;
    },

    addToPlaylist: (playlistId, song) => {
        const playlists = storage.getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.songs.find(s => s.id === song.id)) {
            playlist.songs.push(song);
            localStorage.setItem('hat_music_playlists', JSON.stringify(playlists));
        }
    },

    removeFromPlaylist: (playlistId, songId) => {
        const playlists = storage.getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.songs = playlist.songs.filter(s => s.id !== songId);
            localStorage.setItem('hat_music_playlists', JSON.stringify(playlists));
        }
    },

    deletePlaylist: (playlistId) => {
        let playlists = storage.getPlaylists();
        playlists = playlists.filter(p => p.id !== playlistId);
        localStorage.setItem('hat_music_playlists', JSON.stringify(playlists));
    }
};

// Vietnamese Radio Stations
export const radioStations = [
    {
        id: 'vov1',
        name: 'VOV1 - Đài Tiếng nói Việt Nam',
        url: 'https://str.vov.gov.vn/vovlive/vov1.stream_aac/chunklist.m3u8',
        thumbnail: 'https://static-znews.zmdcdn.me/skins/zme2010/images/radio/vov1.jpg'
    },
    {
        id: 'vov2',
        name: 'VOV2 - Văn hóa & Đời sống',
        url: 'https://str.vov.gov.vn/vovlive/vov2.stream_aac/chunklist.m3u8',
        thumbnail: 'https://static-znews.zmdcdn.me/skins/zme2010/images/radio/vov2.jpg'
    },
    {
        id: 'vov3',
        name: 'VOV3 - Âm nhạc & Giải trí',
        url: 'https://str.vov.gov.vn/vovlive/vov3.stream_aac/chunklist.m3u8',
        thumbnail: 'https://static-znews.zmdcdn.me/skins/zme2010/images/radio/vov3.jpg'
    },
    {
        id: 'voh',
        name: 'VOH FM 95.6MHz - TP.HCM',
        url: 'https://stream.voh.com.vn/radio/channel1/chunklist.m3u8',
        thumbnail: 'https://voh.com.vn/images/logo.png'
    },
    {
        id: 'vovgt',
        name: 'VOV Giao thông Hà Nội',
        url: 'https://str.vov.gov.vn/vovlive/vovgtHN.stream_aac/chunklist.m3u8',
        thumbnail: 'https://static-znews.zmdcdn.me/skins/zme2010/images/radio/vovgt.jpg'
    }
];
