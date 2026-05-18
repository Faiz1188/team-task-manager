const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 4000;

// Serve static Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — React Router handles all client-side routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend served on port ${PORT}`);
});
