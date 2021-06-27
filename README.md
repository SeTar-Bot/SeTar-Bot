# Logger
a Simple Logger Class that you can replace with your Own Console

## About Package
You Can log the data you want same as `console.log` but you can define to send it throw a Discord Webhook or Catch Errors with Sentry
You even can Specifiy it for only 1 times use.

## How to Use?

For Setup:
```js
const Logger = require("@setar/logger");
const MyConsole = new Logger({
 sentry: 'MY_SENTRY_STRING_URI',
 Log: {
  Connection: Client_In_Here, //You Can Pass your own Discord.js Client or Webhook Client
  ConnectionData: 'CHANNEL_ID' //Only if you passed the Discord.js Client
 },
 Error: {
  Connection: Client_In_Here, //You Can Pass your own Discord.js Client or Webhook Client
  ConnectionData: 'CHANNEL_ID' //Only if you passed the Discord.js Client
 }
});
```

For 1 Time Run:
```js
MyConsole.error('this is an Error.', {
 sentry: 'MY_SENTRY_STRING_URI', //ONLY WORKS FOR `error` Function
 Connection: Client_In_Here //You Can Pass your own Discord.js Client or Webhook Client
 ConnectionData: 'CHANNEL_ID' //Only if you passed the Discord.js Client
});
```

## More Examples?
You can find More examples in [Example.js](https://github.com/SeTar-Bot/SeTar-Bot/blob/logger/example.js)
