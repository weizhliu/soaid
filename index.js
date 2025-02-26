#!/usr/bin/env node

const http = require('http');
const path = require('path');
const fs = require('fs');

// Get command line arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('file', {
    alias: 'f',
    describe: 'Path to API documentation file',
    default: 'docs/api_v1.yaml',
    type: 'string'
  })
  .option('port', {
    alias: 'p',
    describe: 'Port to run the server on',
    default: 8081,
    type: 'number'
  })
  .help('h')
  .alias('h', 'help')
  .version()
  .argv;

const apiDocFile = argv.file;
const port = argv.port;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>API Documentation</title>
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
  </head>
  <body>
    <elements-api apiDescriptionUrl="${apiDocFile}" router="hash" layout="sidebar"/>
  </body>
</html>`;

console.log("Starting API documentation server...");
console.log(`Using API documentation file: ${apiDocFile}`);

// Create a server that handles requests
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname;

  // Serve root path with the generated index.html
  if (pathname === "/" || pathname === "") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(indexHtml);
    return;
  }

  // Check if the requested file is the API doc file
  if (pathname === `/${apiDocFile}` || pathname === apiDocFile) {
    // Resolve the file path relative to current working directory
    const filePath = path.resolve(process.cwd(), apiDocFile);

    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      // Read file content
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Internal Server Error');
          return;
        }

        // Determine content type based on file extension
        const ext = path.extname(apiDocFile).toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === '.yaml' || ext === '.yml') {
          contentType = 'application/yaml';
        } else if (ext === '.json') {
          contentType = 'application/json';
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
      return;
    }
  }

  // Return 404 for files not found
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(port, () => {
  console.log(`API documentation server running at http://localhost:${port}`);
  console.log('Press Ctrl+C to stop the server');
});
