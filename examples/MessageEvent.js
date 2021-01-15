const Discord = require("../src/index");
const client = new Discord.Client();
client.Auth('<YOUR_BOT_TOKEN>');

//Start Listening to Message Event
client.Connect(Discord.Intents.GUILD_MESSAGES); 

// Listen for intent packets
client.on('packet', packet => {
    // packet.t: intent type
    // packet.d: intent data
    if(packet.t == 'MESSAGE_CREATE')//heard new message?
    {
        //Do whatever you want....!
    }
});