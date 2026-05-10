import http from 'node:http';
import fs from 'node:fs';

const PORT = 3187;

const server = http.createServer((req,res) => {
    //const content = `<html><h1>The server is working.</h1></html>`;
    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'text/html');
    //res.end(content);
    fs.readFile('./public/index.html', (err, data) => {
        if(err) {
            res.statusCode = 500;
            res.end('Error Loading Page.');
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
});

server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));