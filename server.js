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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
