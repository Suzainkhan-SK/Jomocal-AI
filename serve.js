import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist'), {
    // Don't serve index.html for root requests, let the catch-all handle it
    index: false
}));

// Handle SPA routing - serve index.html for all routes that don't match static files
// Use app.use middleware instead of app.get('*') for Express 5 compatibility
app.use((req, res, next) => {
    // Check if response was already sent by express.static
    if (res.headersSent) {
        return next();
    }
    
    // Check if it's likely a static file request (has file extension)
    const hasExtension = /\.[^/]+$/.test(req.path);
    if (hasExtension && !req.path.endsWith('/')) {
        // Let Express handle 404 for static files that don't exist
        return res.status(404).send('File not found');
    }
    
    // Serve index.html for all other routes (SPA routing)
    try {
        const indexPath = join(__dirname, 'dist', 'index.html');
        
        // Check if index.html exists
        if (!existsSync(indexPath)) {
            console.error('index.html not found in dist directory');
            return res.status(500).send('Application not built. Please run npm run build first.');
        }
        
        const indexHtml = readFileSync(indexPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        res.send(indexHtml);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading application');
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Serving files from: ${join(__dirname, 'dist')}`);
});
