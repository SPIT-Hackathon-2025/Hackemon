const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {OAuth2Client} = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = './config/credentials1.json'; // Path to your credentials

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load client secrets
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) {
    console.log('Error loading client secret file:', err);
    return;
  }
  authorize(JSON.parse(content), listMessages);
});

// Authorize a client with credentials
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// Get and store new token after authorization
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  rl.question('Enter the code from that page here: ', (code) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          console.log(err);
        }
      });
      callback(oAuth2Client);
    });
  });
}

// List the first 10 messages and save attachments
function listMessages(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const savePath = path.join(__dirname, 'attachments');
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  // Fetch only the first 10 emails
  gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    q: 'has:attachment', // Filter to fetch only emails with attachments
    maxResults: 10, // Limit to top 10 emails
  }, (err, res) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    let messages = res.data.messages || [];
    if (messages.length == 0) {
      console.log('No messages found.');
    } else {
      // Explicitly slice the first 10 emails
      messages = messages.slice(0, 10);
      console.log('Top 10 Messages:');
      messages.forEach((message, index) => {
        console.log(`${index + 1}. Message ID: ${message.id}`);
        getMessage(auth, message.id);
      });
    }
  });
}

// Get the message by ID and save attachments
function getMessage(auth, messageId) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  }, (err, res) => {
    if (err) {
      console.log('Error retrieving message:', err);
      return;
    }

    const message = res.data;
    const subject = message.payload.headers.find(header => header.name === 'Subject')?.value || 'No Subject';
    const from = message.payload.headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
    const date = message.payload.headers.find(header => header.name === 'Date')?.value || 'No Date';

    console.log(`From: ${from}\nSubject: ${subject}\nDate: ${date}\n`);

    // Look for attachments
    message.payload.parts.forEach(part => {
      if (part.filename && part.body.attachmentId) {
        const attachmentId = part.body.attachmentId;
        const fileName = decodeURIComponent(part.filename);
        saveAttachment(auth, attachmentId, fileName);
      }
    });
  });
}

// Save the attachment to the local system
function saveAttachment(auth, attachmentId, fileName) {
  const gmail = google.gmail({version: 'v1', auth});
  const savePath = path.join(__dirname, 'attachments', fileName);

  gmail.users.messages.attachments.get({
    userId: 'me',
    messageId: attachmentId,
    id: attachmentId,
  }, (err, res) => {
    if (err) {
      console.log('Error retrieving attachment:', err);
      return;
    }

    const data = res.data.data;
    const buffer = Buffer.from(data, 'base64');

    fs.writeFile(savePath, buffer, (err) => {
      if (err) {
        console.log(`Failed to save ${fileName}: ${err}`);
      } else {
        console.log(`Attachment saved: ${fileName}`);
      }
    });
  });
}
