const Logger = require("@setar/logger");
const { Client, WebhookClient } = require("discord.js");

const myClient = new Client();
myClient.login();
const myWebhookClient = new WebhookClient('WEBHOOK_ID', 'WEBHOOK_TOKEN');

const MyConsole = new Logger({
 sentry: 'http://.................',
 Log: {
  Connection: myClient, 
  ConnectionData: '12345.....' // CHANNEL ID
 },
 Error: {
  Connection: myWebhookClient
 }
});

// Test Log?
MyConsole.log('this an example.')

// 1 Time Error Log with Custom Sentry?
const oneTimeError = {
  sentry: 'http://.........'
};
MyConsole.error(new Error('this an example', oneTimeError);
