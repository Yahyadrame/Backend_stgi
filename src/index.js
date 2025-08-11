const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' })); // Autorise les requêtes depuis Next.js
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});