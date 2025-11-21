// ===== RADIO CHANNELS =====
const RADIO_CHANNELS = [
    {
        id: 'vov1',
        name: 'VOV1 - Thời sự',
        url: 'https://live.radiovietnam.vn/vov1',
        description: 'Kênh thời sự tổng hợp',
        thumbnail: 'https://static.hat404.io.vn/radio/vov1.png'
    },
    {
        id: 'vov2',
        name: 'VOV2 - Văn hóa',
        url: 'https://live.radiovietnam.vn/vov2',
        description: 'Kênh văn hóa xã hội',
        thumbnail: 'https://static.hat404.io.vn/radio/vov2.png'
    },
    {
        id: 'vov3',
        name: 'VOV3 - Âm nhạc',
        url: 'https://live.radiovietnam.vn/vov3',
        description: 'Kênh âm nhạc giải trí',
        thumbnail: 'https://static.hat404.io.vn/radio/vov3.png'
    },
    {
        id: 'vovgiao',
        name: 'VOV Giao thông',
        url: 'https://live.radiovietnam.vn/vovgt',
        description: 'Kênh giao thông quốc gia',
        thumbnail: 'https://static.hat404.io.vn/radio/vovgt.png'
    },
    {
        id: 'vovfm',
        name: 'VOV FM',
        url: 'https://live.radiovietnam.vn/vovfm',
        description: 'Kênh FM tổng hợp',
        thumbnail: 'https://static.hat404.io.vn/radio/vovfm.png'
    }
];

// Endpoint trả về danh sách kênh radio
app.get('/api/radio-list', (req, res) => {
    res.json({ channels: RADIO_CHANNELS });
});
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import { ZingMp3 } from 'zingmp3-api-full-v2';

const app = express();
const PORT = 3010;

app.use(cors({
    origin: ["http://music.hat404.io.vn", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Get Song Info & Stream
app.get('/api/song/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Fetching stream for ID: ${id}`);
        // Use getSong to get the actual media links
        const song = await ZingMp3.getSong(id);
        console.log('Stream Data:', JSON.stringify(song, null, 2));
        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch song' });
    }
});

// Get Home Data (Charts, etc.)
app.get('/api/home', async (req, res) => {
    try {
        const home = await ZingMp3.getHome();
        res.json(home);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch home data' });
    }
});

// Get Top 100
app.get('/api/top100', async (req, res) => {
    try {
        const data = await ZingMp3.getTop100();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch top 100' });
    }
});

// Search
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        console.log(`Searching for: ${query}`);
        const data = await ZingMp3.search(query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search' });
    }
});

// Proxy endpoint for radio streams to avoid CORS
app.get('/api/radio-proxy', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter required' });
    }

    try {
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (proxyRes) => {
            // Forward headers
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        }).on('error', (err) => {
            console.error('Proxy error:', err);
            res.status(500).json({ error: 'Failed to proxy stream' });
        });
    } catch (error) {
        console.error('Radio proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ===== CACHE AUDIO =====
const audioCache = new Map(); // {songId: Buffer}
const CACHE_MAX_SIZE = 10;

// ===== PROXY AUDIO =====
import axios from 'axios';
app.get('/proxy_audio', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).send('Missing id parameter');
        }
        // Lấy từ cache
        if (audioCache.has(id)) {
            const audioBuffer = audioCache.get(id);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=86400'
            });
            return res.send(audioBuffer);
        }
        // Nếu không có trong cache, download mới
        const song = await ZingMp3.getSong(id);
        const url = song?.data?.['128'];
        if (!url) return res.status(404).send('Stream URL not found');
        const audioResponse = await axios({
            method: 'GET',
            url,
            responseType: 'arraybuffer',
            timeout: 120000
        });
        const audioBuffer = Buffer.from(audioResponse.data);
        // Giới hạn cache size
        if (audioCache.size >= CACHE_MAX_SIZE) {
            const firstKey = audioCache.keys().next().value;
            audioCache.delete(firstKey);
        }
        audioCache.set(id, audioBuffer);
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=86400'
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error('Proxy audio error:', error.message);
        res.status(500).send('Failed to proxy audio');
    }
});

// ===== PROXY LYRIC =====
app.get('/proxy_lyric', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).send('Missing id parameter');
        }
        const songLyric = await ZingMp3.getLyric(id);
        const lyricData = songLyric?.data;
        if (lyricData?.file) {
            // Nếu có file LRC, tải về và trả về nội dung
            const resp = await axios.get(lyricData.file);
            res.set('Content-Type', 'text/plain; charset=utf-8');
            return res.send(resp.data);
        } else if (Array.isArray(lyricData?.sentences)) {
            // Nếu có sentences, chuyển sang LRC format
            let lrcContent = '';
            lyricData.sentences.forEach(s => {
                const words = s.words || [];
                words.forEach(w => {
                    const time = w.startTime || 0;
                    const minutes = Math.floor(time / 60000);
                    const seconds = Math.floor((time % 60000) / 1000);
                    const ms = Math.floor((time % 1000) / 10);
                    lrcContent += `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}]${w.data}\n`;
                });
            });
            res.set('Content-Type', 'text/plain; charset=utf-8');
            return res.send(lrcContent);
        } else {
            res.status(404).send('Lyric not found');
        }
    } catch (error) {
        console.error('Proxy lyric error:', error.message);
        res.status(404).send('Lyric not found');
    }
});

// ===== STREAM_PCM (Tìm kiếm và trả về bài hát cho ESP32) =====
app.get('/stream_pcm', async (req, res) => {
    try {
        const { song, artist = '' } = req.query;
        if (!song) {
            return res.status(400).json({ error: 'Missing song parameter' });
        }
        const searchQuery = artist ? `${song} ${artist}` : song;
        const data = await ZingMp3.search(searchQuery);
        const songs = Array.isArray(data?.data?.songs) ? data.data.songs : [];
        // Trả về 3 bài đầu tiên
        const topSongs = songs.slice(0, 3);
        const results = topSongs.map(songItem => ({
            title: songItem.title || song,
            artist: songItem.artistsNames || artist || 'Unknown',
            audio_url: `/proxy_audio?id=${songItem.encodeId}`,
            lyric_url: `/proxy_lyric?id=${songItem.encodeId}`,
            thumbnail: songItem.thumbnail || songItem.thumbnailM || '',
            duration: songItem.duration || 0,
            language: 'unknown'
        }));
        res.json({ count: results.length, songs: results });
    } catch (error) {
        console.error('stream_pcm error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        cache_size: audioCache.size,
        cached_songs: Array.from(audioCache.keys())
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
