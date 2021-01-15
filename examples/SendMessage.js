const Discord = require("../src/index");
const client = new Discord.Client();
client.Auth('<YOUR_BOT_TOKEN>');

const Routes = Discord.Routes;
client.Request('POST', Routes.Channel('<CHANNEL_ID>') + '/messages', { content: '<YOUR_MESSAGE>' });