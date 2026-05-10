import http from 'node:http';

const PORT = 3187;

const server = http.createServer((req,res) => {
    const content = `<html><h1>The server is working.</h1></html>`;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(content);
});

server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));