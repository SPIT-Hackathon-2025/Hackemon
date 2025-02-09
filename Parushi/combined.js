const { google } = require('googleapis');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const stream = require('stream');
const apikeys = require('./apikey.json'); // Your Google API keys

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = './config/credentials1.json'; // Path to your credentials

// Authorize a client with credentials
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    // If no token, call getNewToken (which will interact with user to get new token)
    return getNewToken(oAuth2Client);
  }
}

// Get and store new token after authorization
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const code = 'user_input_from_auth_page'; // Example, replace with actual code input handling
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  // Store the token to disk for later program executions
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return oAuth2Client;
}

// List the first 10 messages with attachments
async function listMessages(auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  // Fetch only the first 10 emails with attachments
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    q: 'has:attachment', // Filter to fetch only emails with attachments
    maxResults: 10, // Limit to top 10 emails
  });
  let messages = res.data.messages || [];
  if (messages.length == 0) {
    console.log('No messages found.');
  } else {
    console.log('Top 10 Messages:');
    messages.forEach((message, index) => {
      console.log(`${index + 1}. Message ID: ${message.id}`);
      getMessage(auth, message.id);
    });
  }
}

// Get the message by ID and save attachments to Google Drive
async function getMessage(auth, messageId) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });

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
      saveAttachment(auth, messageId, attachmentId, fileName);
    }
  });
}

// Save the attachment to Google Drive
async function saveAttachment(auth, messageId, attachmentId, fileName) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.attachments.get({
    userId: 'me',
    messageId: messageId,
    id: attachmentId,
  });

  // Get the base64-encoded data and decode it into a buffer
  const data = res.data.data;
  const buffer = Buffer.from(data, 'base64');  // Decode base64 into buffer

  // Now upload to Google Drive using a stream
  uploadFileToDrive(auth, buffer, fileName);
}

// Upload the attachment to Google Drive using a Readable stream
async function uploadFileToDrive(authClient, fileBuffer, fileName) {
  try {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const fileMetadata = {
      name: fileName,  // The file name will be the same as the original attachment's filename
      parents: ['1XuKTgJ9vO2dw841tlLZ9JKfHyerwifdx'],  // The folder ID where files will be uploaded
    };

    // Create a Readable stream from the buffer
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer);  // This creates a stream from the buffer

    const media = {
      mimeType: 'application/octet-stream',  // Default MIME type for raw binary data; change if necessary
      body: readableStream,  // Upload the stream directly
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log(`File uploaded to Google Drive with ID: ${response.data.id}`);
  } catch (err) {
    console.log('Error uploading attachment to Google Drive:', err);
  }
}

// Start the process when invoked
async function startProcess() {
  try {
    const auth = await authorize(JSON.parse(fs.readFileSync(CREDENTIALS_PATH)));
    console.log("Authenticated to Google services");
    listMessages(auth);
  } catch (error) {
    console.error("Error starting the process:", error);
  }
}

// Export startProcess function to be called in index.js
module.exports = { startProcess };
