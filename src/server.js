import http from 'node:http';
import fs from 'node:fs';

const PORT = 3187;

const server = http.createServer((req,res) => {
    //---
    //const content = `<html><h1>The server is working.</h1></html>`;
    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'text/html');
    //res.end(content);
    //----

    // if the url is exactly '/', send index.html 
    if (req.url === '/') {
        fs.readFile('./public/index.html', (err, data) => {
            if(err) {
                // something happened on the way after the page was sent.
                res.statusCode = 500;
                res.end('Error Loading Page.');
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
    });
    } 
    // This code will run When CSS file is requested
    else if (req.url === '/css/style.css') {
        fs.readFile('./public/css/style.css', (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('CSS not found');
                return;
            }
            res.setHeader('Content-Type', 'text/css');
            res.end(data);
        })
    }
    // otherwise, give 'not found' error.
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404: Page not found');
    }
});

server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));