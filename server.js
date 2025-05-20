/*const http = require('http');
const querystring = require('querystring');

const startPort = 3000;

// HTML Form Rendering
const renderForm = () => `
  <html>
    <head>
      <title>SIGN IN PAGE</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color:rgb(228, 92, 92);
          padding: 30px;
        }
        form {
          background-color: #fff;
          padding: 20px 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: auto;
        }
        h2 {
          text-align: center;
          color: #333;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"] {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        input[type="submit"] {
          width: 100%;
          padding: 10px;
          background-color: #4a148c;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        input[type="submit"]:hover {
          background-color: #6a1b9a;
        }
      </style>
    </head>
    <body>
      <form action="/submit" method="POST">
        <h2>SIGN IN PAGE</h2>
        <input type="text" name="name" placeholder="Name" required><br>
        <input type="email" name="email" placeholder="Email" required><br>
        <input type="tel" name="phone" placeholder="Phone" required><br>
        <input type="text" name="country" placeholder="Country" required><br>
        <input type="text" name="address" placeholder="Address" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required><br>
        <input type="submit" value="Register">
      </form>
    </body>
  </html>
`;

// Server logic
const createServer = () => http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderForm());

  } else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const data = querystring.parse(body);

      // Password match check
      const passwordMatch = data.password === data.confirmPassword;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head>
            <title>Registration Result</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                padding: 30px;
                text-align: center;
              }
              div {
                background: #fff;
                padding: 20px 30px;
                border-radius: 10px;
                display: inline-block;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              }
              a {
                display: inline-block;
                margin-top: 20px;
                text-decoration: none;
                color: #4a148c;
              }
              p {
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div>
              <h2>Registration ${passwordMatch ? 'Successful' : 'Failed'}</h2>
              ${passwordMatch ? `
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>Country:</strong> ${data.country}</p>
              <p><strong>Address:</strong> ${data.address}</p>
              ` : '<p style="color:red;">Passwords do not match.</p>'}
              <a href="/">Go Back</a>
            </div>
          </body>
        </html>
      `);
    });
} else if (req.method === 'GET' && req.url.startsWith('/submit?')) {
    const url = new URL(req.url, 'http://${req.headers.host}');
  
      const data = Object.fromEntries(url.searchParams.entries());
    
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>GET Submission</title></head>
          <body>
            <h2>Submitted via GET:</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Age:</strong> ${data.email}</p>
            <p><strong>DOB:</strong> ${data.phone}</p>
            <p><strong>Address:</strong> ${data.country}</p>
            <p><strong>Pincode:</strong> ${data.address}</p>
            <p><strong>Country:</strong> ${data.password}</p>
            <p><strong>State:</strong> ${data.confirmPassword}</p>
            <a href="/">Go Back</a>
          </body>
        </html>
      `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Auto-find open port starting from 3000
function tryListen(server, port) {
  server.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠ Port ${port} in use, trying ${port + 1}...`);
      tryListen(createServer(), port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });
}

// Start the server
tryListen(createServer(), startPort);

//GET and POST method
*/


//MongoDB connection and Express server setup


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recipeWebsite')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define recipe schema
const recipeSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  ingredients: [String],
  steps: [String],
  preparationTime: String,
  cookingTime: String,
  dateAdded: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // So we can serve home.html and addrecipe.html

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/addrecipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'addrecipe.html'));
});

app.post('/add', async (req, res) => {
  try {
    const newRecipe = new Recipe({
      title: req.body.title,
      videoUrl: req.body.videoUrl,
      ingredients: req.body.ingredients.split('\n'),
      steps: req.body.steps.split('\n'),
      preparationTime: req.body.preparationTime,
      cookingTime: req.body.cookingTime
    });
    await newRecipe.save();
    res.send('<h2>✅ Recipe saved successfully!</h2><a href="/">Back to Home</a>');
  } catch (err) {
    res.status(500).send('<h2>❌ Failed to save recipe.</h2>');
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

