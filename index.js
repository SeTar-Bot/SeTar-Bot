const { Client, WebhookClient } = require("discord.js");
class Logger {
    #Options = {
        sentry: false,
        Error: {
            Connection: null, //[Client | Webhook]
            ConnectionData: null //[String(ChannelID) | Array(Webhook ID & Webhook Token)]
        },
        Log: {
            Connection: null, //[Client | Webhook]
            ConnectionData: null //[String(ChannelID) | Array(Webhook ID & Webhook Token)]
        },
        Bot: {
            Connection: null, //[Client | Webhook]
            ConnectionData: null //[String(ChannelID) | Array(Webhook ID & Webhook Token)]
        }
    }
    constructor(data)
    {
        if('sentry' in data && typeof data.sentry == 'string')
            this.#Options.sentry = data.sentry;
        else this.#Options.sentry = null;

        if('Error' in data || typeof data.Error == 'object' && data.Error.Connection instanceof Client || data.Error.ConnectionData instanceof WebhookClient)
            if(data.Error.Connection instanceof Client && typeof data.Error.ConnectionData == 'string')
                this.#Options.Error = data.Error;
            else if(data.Error.Connection instanceof WebhookClient)
                this.#Options.Error = data.Error;
            else throw new Error("Error Object recived, but in a wrong way.");
        else this.#Options.Error = { Connection: false, ConnectionData: false };

        if('Log' in data || typeof data.Log == 'object')
            if(data.Log.Connection instanceof Client && typeof data.Log.ConnectionData == 'string')
                this.#Options.Log = data.Log;
            else if(data.Log.Connection instanceof WebhookClient)
                this.#Options.Log = data.Log;
            else throw new Error("Log Object recived, but in a wrong way.")
        else this.#Options.Log = { Connection: false, ConnectionData: false };

        if(!'sentry' in data && !'Error' in data && !'Log' in data)
            console.warn(`[WARN]: No Sentry, Client, Webhook recieved, Module would Act Same as the Original Console.`);
    }

    error(data, opt)
    {
        if(!data)
            throw new Error("No Data/String/Error Recieved.");
        
        if(opt && typeof opt !== 'object')
            throw new Error("Options needs to Be Object.");

        let useropt = (opt && 'sentry' in opt || 'Connection' in opt) ? opt : { sentry: this.#Options.sentry, Connection: this.#Options.Error.Connection, ConnectionData: this.#Options.Error.ConnectionData };
        
        if(useropt)
            if('sentry' in useropt && typeof useropt.sentry == 'string')
            {
                const Sentry = require("@sentry/node");
                Sentry.init({ dsn: useropt.sentry });

                Sentry.captureException(data);
            }

            if('Connection' in useropt && useropt.Connection)
                if(useropt.Connection instanceof Client && 'ConnectionData' in useropt && typeof useropt.ConnectionData == 'string')
                {
                    useropt.Connection.channels.fetch(useropt.ConnectionData)
                    .then(optChannel => {
                        optChannel.send(data.toString());
                    })
                    .catch(e => { throw e; });
                }
                else if(useropt.Connection instanceof WebhookClient)
                {
                    const optWebhook = useropt.Connection;
                    if(typeof data == 'string' || data instanceof Error)
                        optWebhook.send(data.toString());
                }

            
        console.error(data);
    }

    log(data, opt)
    {
        if(!data)
            throw new Error("No Data/String/Error Recieved.");
        
        if(opt && typeof opt !== 'object')
            throw new Error("Options needs to Be Object.");
        let useropt = (opt && 'sentry' in opt || 'Connection' in opt) ? opt : { sentry: this.#Options.sentry, Connection: this.#Options.Log.Connection, ConnectionData: this.#Options.Log.ConnectionData };

        if(useropt)
            if('Connection' in useropt && useropt.Connection)
                if(useropt.Connection instanceof Client && typeof useropt.ConnectionData == 'string')
                {
                    useropt.Connection.channels.fetch(useropt.ConnectionData)
                    .then(optChannel => {
                        optChannel.send(data.toString());
                    })
                    .catch(e => { throw e; });;
                }
                else if(useropt.Connection instanceof WebhookClient)
                {
                    const optWebhook = useropt.Connection;
                    if(typeof data == 'string' || data instanceof Error)
                        optWebhook.send(data.toString());
                }

        console.log(data);
    }
}

module.exports = Logger;
