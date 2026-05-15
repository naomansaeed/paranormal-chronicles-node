import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { json } from 'node:stream/consumers';
import { error } from 'node:console';
import { chronicles } from './data/chronicles.js';

//Declaring the port at the start as a constant. It is not to be changed in the subsequent code.
const PORT = 3187;

// Resolving the absolute path to the public directory ONCE at startup.
// This prevents repeated string concatenation and makes security checks reliable.
const PUBLIC_DIR = path.resolve('./public');

    /**
    -  Maping file extensions to MIME types.
    -  Browsers refuse to execute/render files if Content-Type doesn't match.
    */

    const getMimeType = (urlPath) => {

        // This will strip query strings like ?v=2 or ?t=123 before checking extension
        const cleanPath = urlPath.split('?')[0];
        const ext = cleanPath.split('.').pop().toLowerCase();
        
        const mimeMap = {
            html: 'text/html',
            css: 'text/css',
            js: 'application/javascript',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            svg: 'image/svg+xml',
            json: 'application/json',
            txt: 'text/plain',
            ico: 'image/x-icon'
        };

        // Fallback for unknown extensions
        return mimeMap[ext] || 'application/octet-stream';
    }

const server = http.createServer((req, res) => {
    
    // Extracting raw path and strip query parameters
    const rawPath = req.url.split('?')[0];

    // Determining which file to serve
    // If user requests '/' or '/index.html', serve the homepage
    // The symbol '||' is called a disjunction or 'OR' operator. used for either/or
    const isHomepage = rawPath === '/' || rawPath === '/index.html';
    // This is a 'ternary' operator by the way.        👇
    const filePath = isHomepage ? './public/index.html' : `./public${rawPath}`;

    // Implementing mock api call 
    if (req.url === '/api/chronicles' && req.method === 'GET') {
        // creating mock data for now
    /*    const chronicles = [
            { id: 1, location: 'Salem, MA', year: 1692, type: 'witchcraft' },
            { id: 2, location: 'Point Pleasant, WV', year: 1966, type: 'cryptid' }
        ]; */
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(chronicles));
        return;
    }

    else if (req.url === '/api/chronicles') {
        // Route exists but method is not allowed
        res.statusCode = 405;
        res.setHeader('Allow', 'GET');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            error: 'Method Not Allowed',
            allowed: ['GET']
        }));
        return;
    }

    // Converting to absolute path for reliable security checking
    const absolutePath = path.resolve(filePath);

    // SECURITY: Ensuring the requested file lives INSIDE ./public
    // Prevents ../../etc/passwd directory traversal attacks
    if (!absolutePath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 403;
        res.end('Forbidden: Access denied.');
        return; // Stoping execution so no file is ever read
    }

    // Preparing response headers
    res.statusCode = 200;
    //following line resulted in index.html downloading instead of rendering
    //res.setHeader('Content-Type', getMimeType(rawPath));
    res.setHeader('Content-Type', getMimeType(filePath));

    res.setHeader('Cache-Control', 'public, max-age=31536000'); // ← 1 year cache for static assets

    // STREAM the file to the client
    // createReadStream() opens the file and reads it in small chunks
    // .pipe(res) automatically writes those chunks to the HTTP response
    const stream = fs.createReadStream(absolutePath);
    stream.pipe(res);

    // Handle stream errors (e.g., file deleted, permission denied, not found)
    stream.on('error', (err) => {
        if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found.');
        } else {
            res.statusCode = 500;
            res.end('Internal server error.');
        }
    });

});

server.listen(PORT, () => console.log(`Listening at ${PORT}`));