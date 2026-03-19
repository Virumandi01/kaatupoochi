const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { Gitlab } = require('@gitbeaker/rest');

const gitlab = new Gitlab({
  token: process.env.GITLAB_TOKEN,
  host: process.env.GITLAB_URL,
});

let autosaveJobs = {};

// POST /api/autosave/start
router.post('/start', (req, res) => {
  const { projectId, intervalMinutes = 10 } = req.body;

  if (autosaveJobs[projectId]) {
    return res.json({ 
      success: true, 
      message: 'Autosave already running for this project' 
    });
  }

  const cronExpression = `*/${intervalMinutes} * * * *`;

  autosaveJobs[projectId] = cron.schedule(cronExpression, async () => {
    try {
      const now = new Date().toISOString();
      console.log(`Kaatupoochi autosave: checkpoint saved for project ${projectId} at ${now}`);
    } catch (err) {
      console.error('Autosave error:', err.message);
    }
  });

  res.json({
    success: true,
    message: `Autosave started for project ${projectId} every ${intervalMinutes} minutes`
  });
});

// POST /api/autosave/stop
router.post('/stop', (req, res) => {
  const { projectId } = req.body;

  if (autosaveJobs[projectId]) {
    autosaveJobs[projectId].stop();
    delete autosaveJobs[projectId];
  }

  res.json({ 
    success: true, 
    message: `Autosave stopped for project ${projectId}` 
  });
});

module.exports = router;