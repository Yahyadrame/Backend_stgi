const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();

// Configuration CORS 
const allowedOrigins = [
  'http://localhost:3000',      // Développement local
  'http://13.38.105.133',       // Frontend en production (HTTP)
  'https://13.38.105.133'       // Frontend en production (HTTPS si configuré)
];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});