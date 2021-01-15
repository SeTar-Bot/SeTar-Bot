# Setar.js
a Module to interact with discord api, Creating discord bots!

## Examples
for making sure that you installed package right you can run `npm test` and see setar.js Version on your console!

#### Sending Message to Channel
```js
const Discord = require("../src/index"); // or 'setar.js'
const client = new Discord.Client();
client.Auth('<YOUR_BOT_TOKEN>');

const Routes = Discord.Routes;
client.Request('POST', Routes.Channel('<CHANNEL_ID>') + '/messages', { content: '<YOUR_MESSAGE>' });
```

#### Message Event and other Events
in setar.js, we have to force and make connection to the discord gateway by `Connect` function and this is what makes our bot/lib faster and better!
by default, the connection is only connected to the interaction that you know as **Slash Commands**

```js
const Discord = require("../src/index"); // or 'setar.js'
const client = new Discord.Client();
client.Auth('<YOUR_BOT_TOKEN>');

//Start Listening to Message Event
client.Connect(Discord.Intents.GUILD_MESSAGES); 

// Listen for intent packets
client.on('packet', packet => {
    // packet.t: intent type
    // packet.d: intent data
    if(packet.t == 'MESSAGE_CREATE') //heard new message?
    {
        //Do whatever you want....!
    }   
});
```

# Documentation
maybe when we had time for it....

# Support
feel free to ask your question on our official discord server

<a href="https://discord.gg/GBDkr9T"><img align="right" src="https://discord.com/api/guilds/721126627165077545/widget.png?style=banner1" alt="discord_invite"></a>
