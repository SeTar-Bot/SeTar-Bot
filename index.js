let MySql = require('mysql');
const { MessageEmbed, Client } = require("discord.js");
const fs = require("fs");
const { jVar } = require("json-variables");
var mysqlDump = require('mysqldump');
const moment = require("moment");
const { resolve } = require('path');
const jVarSettings = {
    heads: '{{',
    tails: '}}'
};

class Database {
    #config = {
        host: process.env.DB_IP,
	    user: process.env.DB_USER,
	    password: process.env.DB_PASS,
	    database: process.env.DB_DBT,
    };
    #options = {
        emitter: false,
        client: null,
        logger: null,
        file: null,
        reconnect: true
    };
    #Info = {
        guilds: null,
        users: null,
        bot: null,
        setup: false
    };
    #client;
    #Connection;
    state;
    constructor(configObject, options)
    {
        //SETUP DATA
        if(configObject)
            this.#config = configObject;
        if(options)
            this.#options = options;

        //Handle Typings
        if(options && 'logger' in options && typeof options.emitter !== 'boolean')
            throw new Error("Logger needs to be an Object");
        if(options && 'reconnect' in options && typeof options.emitter !== 'boolean')
            throw new Error("Reconnect needs to be boolean");
        if(options && 'file' in options && typeof options.emitter !== 'boolean')
            throw new Error("File needs to be an Object");
        if(options && 'emitter' in options && typeof options.emitter !== 'boolean')
            throw new Error("Emitter needs to be boolean");
        if(options && 'client' in options && !options.client instanceof Client)
            throw new Error("The Discord.js Client is invalid.");

        if(options && 'emitter' in options && options.emitter == true && !'client' in options)
            throw new Error('For turning emitter on, you need a Discord.js Client as the EventEmitter');

        if(!configObject && !process.env.DB_IP || !process.env.DB_USER || !process.env.DB_PASS)
            throw new Error("No Config Object neither DB Information on env found.");
        this.#client = MySql.createConnection(this.#config);

        this.#Connection = (recon) => {
            this.#client.connect( (err) => {
                if(err)
                {
                    if(this.#options.logger)
                        this.#options.logger.error(err);
                    else
                        throw err;
                }
                this.state = {
                    stats: this.#client.state,
                    connected: (this.#client.state == "authenticated"),
                    connection: this.#client
                };
            });
            if(recon)
                this.#client.on("error", (err) => {
                    if(err.code === 'PROTOCOL_CONNECTION_LOST')
                        this.#Connection(recon);
                });
            }
        this.#Connection(this.#options.reconnect);
    }

    Setup(nameObj)
    {
        if(!nameObj || typeof nameObj !== 'object') throw new Error("Input is required [Must be Object].");
        if(!nameObj.guilds || !nameObj.users || !nameObj.bot) throw new Error("Object needs all of requirements [guilds/users/bot].");
        this.#Info = nameObj;
    }

    async Backup()
    {
        const time = moment(new Date()).format('YYYY-MM-DD');
        const fileAddress = `Backup_${time}.sql`;
        await mysqlDump(
            {
                connection: this.#config,
                dumpToFile: `./${fileAddress}`,
            }
        );
        var stats = fs.statSync(fileAddress);
        var fileSizeInBytes = stats["size"];
        var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
        return new Promise((resolve, reject) => {
            if(fileSizeInMegabytes <= 8 ){
                //good to go
                let result = new MessageEmbed()
                    .attachFiles([`./${fileAddress}`])
                    .setDescription(`MYSQL Backup as [${this.Config.database}]`);
                resolve({ msg: result, file: fileAddress});
            }
            else
            {
                //Upload To Web-Host
                if(this.#options.logger && this.#options.emitter)
                {
                    this.#options.logger.error("File Size is more than 8mb, can't upload to the web-host at this version.");
                    this.#options.client.emit("error", { message: "File Size is more than 8mb, can't upload to the web-host at this version.", from: "Backup"});
                }
                else if(this.#options.logger)
                    this.#options.logger.error("File Size is more than 8mb, can't upload to the web-host at this version.");
                else if(this.#options.emitter)
                    this.#options.client.emit("error", { message: "File Size is more than 8mb, can't upload to the web-host at this version.", from: "Backup"});
                
                reject(new Error("File Size is more than 8mb, can't upload to the web-host at this version."));
            }
        });
    }

    async Sync(emit = true)
    {
        if(!this.#options.client) throw new Error("a Discord.js Client is required to Sync Database with it.");
        if(!this.#options.file) console.warn('[Warning]: Settings file not found.\nPresence sync is not gonna happen.');

        let dbrs_1, dbrs_2;
        let result = {
            synced: null,
            addedGuilds: null,
            removedGuilds: null
        };
        const myStatus = this.#options.client.presence.status;
        this.Info(3, true).then( async botInfo => {

            //Sync Presence & Status
            if(botInfo.botStatus !== myStatus)
                dbrs_1 = await this.Set('Bot', 'Activity', myAcIndex);

            if(this.#options.file && this.#options.client.presence.activities.length > 0)
            {
                const myActivity = this.#options.client.presence.activities[0];
                const myAcIndex = this.#options.file.Activities.findIndex( ({name}) => name === myActivity.name);
            
                if(myAcIndex >= 0 && botInfo.activity.index !== myAcIndex)
                    dbrs_2 = await this.Set('Bot', 'Activity', myAcIndex);
            }
            
            //Sync Guilds
            if(this.#options.client.guilds.cache.size !== botInfo.guilds)
            {
                const dbGuilds = await this.Global(this.#Info.guilds, 'id');
                const clientGuilds = this.#options.client.guilds.cache.map(e => e.id);
                const newGuilds = clientGuilds.filter(e => !dbGuildIds.includes(e));
                const oldGuilds = dbGuilds.filter(e => !clientGuildIds.includes(e));

                if(newGuilds.length > 0)
                {
                    result.synced = true;
                    result.addedGuilds = newGuilds.length;
                    newGuilds.forEach(n => {
                        setTimeout(async () => {
                            await module.exports.insert(this.#Info.guilds, ['id'], [n]);
                            let tempg = this.#options.client.guilds.cache.get(n);
                            tempg.old = true;
                            if(emit)
                                this.#options.client.emit('guildCreate', tempg);
                        }, 1000);
                    });
                }
                else if(oldGuilds.length > 0)
                {
                    result.synced = true;
                    result.removedGuilds = oldGuilds.length;
                    oldGuilds.forEach(n => {
                        setTimeout(async () => {
                            await module.exports.delete(this.#Info.guilds, ['id', n]);
                        }, 1000);
                    });
                    let tempg = { count: oldGuilds.length };
                    tempg.old = true;
                    if(emit)
                        this.#options.client.emit('guildDelete', tempg);
                }
            }
            return result;
        });
    }

    async Info(type, input)
    {
        if(!type || !input) throw new Error("a Type/Key is required.");
        if(this.#Info.hasOwnProperty("setup")) throw new Error("You need to setup table information before asking for information.");
        let myopt, result;
        switch (type) {
            case 1:
                //Guild
                myopt = ['id', input.id];
                let isVip = Boolean(await this.Get('vip', this.#Info.guilds, myopt));
                let hasCooldown = Boolean(await this.Get('cooldown', this.#Info.guilds, myopt));
                let lang = await this.Get('lang', this.#Info.guilds, myopt);
                let prefix = await this.Get('prefix', this.#Info.guilds, myopt);
                let channelid = await this.Get('cid', this.#Info.guilds, myopt);
                let msgid = await this.Get('mid', this.#Info.guilds, myopt);
                let playerid = await this.Get('pid', this.#Info.guilds, myopt);

                result = {
                    guild: input.id,
                    isVip: isVip,
                    onCooldown: hasCooldown,
                    prefix: prefix,
                    language: lang,
                    channel: channelid,
                    message: msgid,
                    controller: playerid,
                    fromChannel: null
                };
                return result;
            break;
        
            case 2:
                //User
                myopt = ['id', input.id];
                let uisVip = Boolean(await this.Get('vip', this.#Info.users, myopt));
                let uplaylist = await this.Get('playlist', this.#Info.users, myopt);
                let uperm = await this.Get('perm', this.#Info.users, myopt);
                let uisBlocked = !Boolean(uperm);
                let hasVoted = this.#options.client ? await this.#options.client.hasVoted(input.id) : null ;

                result = {
                    isVip: uisVip,
                    isBlocked: uisBlocked,
                    isVoted: hasVoted,
                    perm: uperm,
                    playlist: JSON.parse(uplaylist)
                };
                return result;
            break;
            
            case 3:
                //Bot
                let serverCount = await this.Query('SELECT COUNT(*) FROM '+this.#Info.guilds);
                let userCount = await this.Query('SELECT COUNT(*) FROM '+this.#Info.users);
                let botStatus = await this.Get('Status', 'Bot');
                let botActivityIndex = await this.Get('Activity', 'Bot');
                let ActivityObject;
                if(this.#options.file)
                {
                    ActivityObject = this.#options.file.Activities[botActivityIndex];
                    if (botActivityIndex <= 1)
                    {
                        const myVars = {
                            users: userCount[0]['COUNT(*)'],
                            servers: serverCount[0]['COUNT(*)']
                        };
                        ActivityObject.vars = myVars;
                        ActivityObject = jVar(this.#options.file.Activities[botActivityIndex], jVarSettings);
                        delete ActivityObject['vars'];
                    }
                }
                    let AllPrefixes = await this.Global('v2_GUILDS', 'prefix');

                    result = {
                        guilds: serverCount[0]['COUNT(*)'],
                        users: userCount[0]['COUNT(*)'],
                        prefixes: AllPrefixes,
                        status: botStatus,
                        activity:
                        {
                            index: botActivityIndex,
                            main: this.#options.file ? ActivityObject : null,
                        }
                    };
                return result;
            break;

            default:
                throw new Error("UnSupported Type recived.");
            break;
        }
    }

    Query(sql, options)
    {
        if(!this.#client || !this.state.connected) throw new Error("There is no connection to the database.");
        if(!sql) throw new Error("a SQL Command is required.");
        if(options && typeof options !== "object") throw new Error("Options can only be object.");
        let eventObjs;
        if(options)
            return new Promise((resolve, reject) => {
                this.#client.query(sql, options, (err, result) => {
                    if(err)
                    {
                        if(this.#options.emitter)
                            this.#options.client.emit("db_error", err);
                        reject(err);
                    }
                    else
                    {

                        eventObjs = {
                            query: sql,
                            options: options,
                            affects: result.affectedRows,
                            changes: result.changedRows,
                            warning: result.warningCount,
                            ServerStatus: this.state
                        };
                        if(this.#options.emitter)
                            this.#options.client.emit("db_query", eventObjs);
                        resolve(result);
                    }
                });
            });
        else
            return new Promise((resolve, reject) => {
                this.#client.query(sql, (err, result) => {
                    if(err)
                    {
                        if(this.#options.emitter)
                            this.#options.client.emit("db_error", err);
                        reject(err);
                    }
                    else
                    {
                        eventObjs = {
                            query: sql,
                            options: options,
                            affects: result.affectedRows,
                            changes: result.changedRows,
                            warning: result.warningCount,
                            ServerStatus: this.state,
                            result: result
                        };
                        if(this.#options.emitter)
                            this.#options.client.emit("db_query", eventObjs);
                        resolve(result);
                    }
                });
            });
    }

    Get(key, table, options)
    {
        let sql, myKey;
        myKey = key ? key : "*";
        if(!table) throw new Error("a Table is required.");
        sql = `SELECT ${myKey} FROM ${table}`;
        if(options)
            sql = sql + `WHERE \`${options[0]}\` = '${options[1]}'`;
        sql = sql + ";";
        return new Promise((resolve, reject) => {
            this.#client.query(sql, (err, result) => {
                if(err)
                    {
                        if(this.#options.emitter)
                            this.#options.client.emit("db_error", err);
                        reject(err);
                    }
                    else
                    {
                        eventObjs = {
                            query: sql,
                            affects: result.affectedRows,
                            changes: result.changedRows,
                            warning: result.warningCount,
                            ServerStatus: this.state,
                            result: result
                        };
                        if(this.#options.emitter)
                            this.#options.client.emit("db_get", eventObjs);
                        if(result.length == 1)
                            resolve(result[0][myKey]);
                        else if(result.length > 1 && myinput != "*")
                        {
                            let myres = [];
                            result.forEach(e => {
                                myres.push(e[myinput]);
                            });
                            resolve(myres);
                        }
                        else
                            resolve(result);
                    }
            });
        });
    }

    Set(key, input, table, options)
    {
        let sql;
        if(!input || !key || !table)
            throw new Error("an input/key/table is required.");
        sql = `UPDATE ${table} SET ${key} = ?`;
        sql = options ? sql + `\`WHERE ${options[0]}\` = '${options[1]}';` : sql + ";";

        return new Promise((resolve, reject) => {
            this.#client.query(sql, [input], (err, result) => {
                if(err)
                {
                    if(this.#options.emitter)
                        this.#options.client.emit("db_error", err);
                    reject(err);
                }
                else
                {
                    eventObjs = {
                        query: sql,
                        affects: result.affectedRows,
                        changes: result.changedRows,
                        warning: result.warningCount,
                        ServerStatus: this.state,
                        result: result
                    };
                    if(this.#options.emitter)
                        this.#options.client.emit("db_set", eventObjs);
                    resolve(result);
                }
            });
        });
    }

    Insert(table, columens, data)
    {
        if(!table || !columens || !data || typeof table !== 'string' || typeof columens !== 'object' || typeof data !== 'object')
            throw new Error("Table/Columens/Data didn't recived or was invalid.");

        let sql = `INSERT IGNORE INTO ${table} (`;
        columens.forEach(c => {
            if(c == columens[columens.length]) sql = sql + `${c}) VALUES (`;
            else sql = sql + `${c}, `;
        });
        data.forEach(d => {
            if(d == data[data.length]) sql = sql + `'${d}');`;
            else sql = sql + `'${d}', `;
        });

        return new Promise((resolve, reject) => {
            this.#client.query(sql, function(err, result){
                if(err)
                {
                    if(this.#options.emitter)
                        this.#options.client.emit("db_error", err);
                    reject(err);
                }
                else
                {
                    eventObjs = {
                        query: sql,
                        affects: result.affectedRows,
                        changes: result.changedRows,
                        warning: result.warningCount,
                        ServerStatus: this.state,
                        result: result
                    };
                    if(this.#options.emitter)
                        this.#options.client.emit("db_insert", eventObjs);
                    resolve(result);
                }
            });
        });
    }

    Delete(table, options)
    {
        let sql, myopt;
        if(!table) throw new Error("a Table is required.");
        sql = `DELETE FROM ${table} WHERE `;
        sql = options ? sql + `\`${options[0]}\` = '${options[1]};'` : sql + "1;";

        return new Promise((resolve, reject) => {
            this.#client.query(sql, (err, result) => {
                if(err)
                {
                    if(this.#options.emitter)
                        this.#options.client.emit("db_error", err);
                    reject(err);
                }
                else
                {
                    eventObjs = {
                        query: sql,
                        affects: result.affectedRows,
                        changes: result.changedRows,
                        warning: result.warningCount,
                        ServerStatus: this.state,
                        result: result
                    };
                    if(this.#options.emitter)
                        this.#options.client.emit("db_delete", eventObjs);
                    resolve(result);
                }
            });
        });
    }

    Global(table, key, options)
    {
        if(!table || !key) throw new Error("a Table/Key is required.");
        let sql = `SELECT ${key} FROM ${table}`;
        sql = options ? sql + ` WHERE \`${options[0]}\` = '${options[1]}';` : sql + ";";

        return new Promise((resolve, reject) => {
            this.#client.query(sql, (err, result) => {
                if(err)
                {
                    if(this.#options.emitter)
                        this.#options.client.emit("db_error", err);
                    reject(err);
                }
                else
                {
                    eventObjs = {
                        query: sql,
                        affects: result.affectedRows,
                        changes: result.changedRows,
                        warning: result.warningCount,
                        ServerStatus: this.state,
                        result: result
                    };
                    if(this.#options.emitter)
                        this.#options.client.emit("db_global", eventObjs);
                    resolve(result);
                }
            });
        });
    }
    
}
module.exports = Database;
