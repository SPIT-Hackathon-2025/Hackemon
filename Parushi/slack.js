const axios = require('axios');

// Your Slack Webhook URL
const WEBHOOK_URL = "https://hooks.slack.com/services/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";

// Function to send the Slack message
function sendSlackMessage(message) {
  axios
    .post(WEBHOOK_URL, { text: message })
    .then((response) => {
      if (response.status === 200) {
        console.log(`Message sent successfully: ${message}`);
      } else {
        console.log(`Failed to send message. Status code: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(`Error sending message: ${error}`);
    });
}

// Function to schedule a message at a specific time
function scheduleMessageAtTime(message, targetDateTime) {
  const currentTime = new Date();
  const delay = targetDateTime - currentTime;

  if (delay <= 0) {
    console.log("The specified time is in the past. Please provide a future time.");
    return false;  // Return false if the time is in the past
  }

  console.log(`Message scheduled in ${(delay / 1000).toFixed(2)} seconds.`);
  setTimeout(() => sendSlackMessage(message), delay);
  return true;
}

module.exports = { scheduleMessageAtTime, sendSlackMessage };
