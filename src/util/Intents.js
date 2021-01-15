module.exports = function (Intents) {
    Intents[Intents["SYSTEM_ONLY"] = 0] = "SYSTEM_ONLY";
    Intents[Intents["GUILDS"] = 1] = "GUILDS";
    Intents[Intents["GUILD_MEMBERS"] = 2] = "GUILD_MEMBERS";
    Intents[Intents["GUILD_BANS"] = 4] = "GUILD_BANS";
    Intents[Intents["GUILD_EMOJIS"] = 8] = "GUILD_EMOJIS";
    Intents[Intents["GUILD_INTEGRATIONS"] = 16] = "GUILD_INTEGRATIONS";
    Intents[Intents["GUILD_WEBHOOKS"] = 32] = "GUILD_WEBHOOKS";
    Intents[Intents["GUILD_INVITES"] = 64] = "GUILD_INVITES";
    Intents[Intents["GUILD_VOICE_STATES"] = 128] = "GUILD_VOICE_STATES";
    Intents[Intents["GUILD_PRESENCES"] = 256] = "GUILD_PRESENCES";
    Intents[Intents["GUILD_MESSAGES"] = 512] = "GUILD_MESSAGES";
    Intents[Intents["GUILD_MESSAGE_REACTIONS"] = 1024] = "GUILD_MESSAGE_REACTIONS";
    Intents[Intents["GUILD_MESSAGE_TYPING"] = 2048] = "GUILD_MESSAGE_TYPING";
    Intents[Intents["DIRECT_MESSAGES"] = 4096] = "DIRECT_MESSAGES";
    Intents[Intents["DIRECT_MESSAGE_REACTIONS"] = 8192] = "DIRECT_MESSAGE_REACTIONS";
    Intents[Intents["DIRECT_MESSAGE_TYPING"] = 16384] = "DIRECT_MESSAGE_TYPING";
};