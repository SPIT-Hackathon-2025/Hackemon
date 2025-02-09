const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const apikeys = require('./apikey.json'); // Your Google API keys
const { scheduleMessageAtTime } = require('./slack.js'); // Import scheduler function
const { startProcess } = require('./combined.js'); // Import your existing functions
const cors = require('cors')({ origin: true });

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors);

// API endpoint to handle button click
app.post('/upload-attachments', async (req, res) => {
  try {
    // Authorize and initiate the Google API functions
    const authClient = await startProcess();

    // Now trigger the message fetching/uploading only when the API is called
    // await listMessages(authClient);

    res.status(200).send('Request received. Processing...');
  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/schedule-message', (req, res) => {
    const { message, date, time } = req.body;
  
    if (!message || !date || !time) {
      return res.status(400).json({ error: "Please provide message, date (YYYY-MM-DD), and time (HH:MM)" });
    }
  
    try {
      const targetDateTime = new Date(`${date}T${time}:00`);
  
      if (isNaN(targetDateTime)) { 
        return res.status(400).json({ error: "Invalid date or time format." });
      }
  
      const scheduled = scheduleMessageAtTime(message, targetDateTime);
  
      if (!scheduled) {
        return res.status(400).json({ error: "The specified time is in the past. Provide a future time." });
      }
  
      res.status(200).json({ success: `Message scheduled for ${date} at ${time}` });
    } catch (error) {
        console.log(error)
      res.status(400).json({ error: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});



    
    // Start the Express server
    // app.listen(PORT, () => {
    //   console.log(`Server running on http://localhost:${PORT}`);
    // });
    