const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Static files (CSS, Images, JS) ke liye public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/solutions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'solutions.html'));
});

app.get('/people', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'people.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Local ke liye listen aur Vercel ke liye export
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;