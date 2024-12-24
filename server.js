const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring'); // To parse POST data

// Dummy user data for validation
const users = {
  'test@example.com': 'password123',
  'user@example.com': 'userpass',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET') {
    if (pathname === '/') {
      // Serve the login page
      fs.readFile('./user/login.html', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else if (pathname === '/dashboard') {
      // Serve the dashboard
      fs.readFile('./user/dashboard.html', (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404 Not Found');
    }
  } else if (req.method === 'POST' && pathname === '/login') {
    // Handle login form submission
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const parsedData = querystring.parse(body);
      const { email, password } = parsedData;

      if (users[email] && users[email] === password) {
        // Redirect to dashboard on successful login
        res.writeHead(302, { Location: '/dashboard' });
        res.end();
      } else {
        // Redirect back to login with error
        res.writeHead(302, { Location: '/?error=Invalid credentials' });
        res.end();
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/html' });
    res.end('Method Not Allowed');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});



// const http = require('http');
// const url = require('url');
// const fs = require('fs');

// const server = http.createServer((req, res) => {
//   if (req.method === 'GET') {
//     const parsedUrl = url.parse(req.url, true); // Parse the URL and query parameters
//     const pathname = parsedUrl.pathname; // Extract the path without query strings

//     if (pathname === '/') {
//       // Serve the login page for the root URL
//       fs.readFile('./user/login.html', (err, data) => {
//         if (err) {
//           res.writeHead(404, { 'Content-Type': 'text/html' });
//           res.end('404 Not Found');
//         } else {
//           res.writeHead(200, { 'Content-Type': 'text/html' });
//           res.end(data);
//         }
//       });
//     } else {
//       // Handle other routes or static file serving
//       const filePath = './user' + pathname;
//       fs.readFile(filePath, (err, data) => {
//         if (err) {
//           res.writeHead(404, { 'Content-Type': 'text/html' });
//           res.end('404 Not Found');
//         } else {
//           res.writeHead(200, { 'Content-Type': 'text/html' });
//           res.end(data);
//         }
//       });
//     }
//   } else {
//     res.writeHead(405, { 'Content-Type': 'text/html' });
//     res.end('Method Not Allowed');
//   }
// });

// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
