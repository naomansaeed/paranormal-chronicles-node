import http from 'node:http';
import fs from 'node:fs';

const PORT = 3187;

const server = http.createServer((req, res) => {
    const getMimeType = (urlPath) => {
        const ext = urlPath.split('.').pop().toLowerCase();
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
        fs.readFile('./public' + req.url, (err, data) => {
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