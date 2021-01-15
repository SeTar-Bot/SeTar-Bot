exports.OPCode = function (OPCode) {
    OPCode[OPCode["DISPATCH"] = 0] = "DISPATCH";
    OPCode[OPCode["HEARTBEAT"] = 1] = "HEARTBEAT";
    OPCode[OPCode["IDENTIFY"] = 2] = "IDENTIFY";
    OPCode[OPCode["PRESENCE_UPDATE"] = 3] = "PRESENCE_UPDATE";
    OPCode[OPCode["VOICE_STATE_UPDATE"] = 4] = "VOICE_STATE_UPDATE";
    OPCode[OPCode["RESUME"] = 6] = "RESUME";
    OPCode[OPCode["RECONNECT"] = 7] = "RECONNECT";
    OPCode[OPCode["REQUEST_GUILD_MEMBERS"] = 8] = "REQUEST_GUILD_MEMBERS";
    OPCode[OPCode["INVALID_SESSION"] = 9] = "INVALID_SESSION";
    OPCode[OPCode["HELLO"] = 10] = "HELLO";
    OPCode[OPCode["HEARTBEAT_ACK"] = 11] = "HEARTBEAT_ACK";
};