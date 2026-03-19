require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const commitsRoute = require('./gitlab-api/commits');
const explainRoute = require('./claude-ai/explain');
const autosaveRoute = require('./autosave/autosave');

app.use('/api/commits', commitsRoute);
app.use('/api/explain', explainRoute);
app.use('/api/autosave', autosaveRoute);

app.get('/', (req, res) => {
  res.json({ 
    status: 'Kaatupoochi is alive!',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kaatupoochi backend running on port ${PORT}`);
});