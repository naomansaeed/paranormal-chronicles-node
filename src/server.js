import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3187;

const server = http.createServer((req, res) => {
    const getMimeType = (urlPath) => {
        const cleanPath = urlPath.split('?')[0];
        const ext = cleanPath.split('.').pop().toLowerCase();
        if (ext === 'css') {
            return 'text/css';
        }
        else if (ext === 'js') {
            return 'application/javascript';
        }
        else { return 'text/html'};
    }

    if (req.url === '/') {
        fs.readFile('./public/index.html', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('main file missing.');
                return; 
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', getMimeType(req.url));
            res.end(data);
        });
    } else {
        //res.statusCode = 404;
        //res.end('File Not Found.')
        const filePath = req.url.split('?')[0];
        const absolutePath = path.resolve('./public' + filePath);
        const publicDir = path.resolve('./public');
        if (!absolutePath.startsWith(publicDir)) {
            res.statusCode = 403;
            res.end('Forbidden');
            return;
        }
        fs.readFile(absolutePath, (err, data) => {
            if(err){
                res.statusCode = 404;
                res.end('File Not Found.');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', getMimeType(req.url));
            res.end(data);
        })
    }
});

server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));