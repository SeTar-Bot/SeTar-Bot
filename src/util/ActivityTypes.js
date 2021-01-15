module.exports = function (ActivityTypes) {
    ActivityTypes[ActivityTypes["PLAYING"] = 0] = "PLAYING";
    ActivityTypes[ActivityTypes["STREAMING"] = 1] = "STREAMING";
    ActivityTypes[ActivityTypes["LISTENING"] = 2] = "LISTENING";
    ActivityTypes[ActivityTypes["WATCHING"] = 3] = "WATCHING";
    ActivityTypes[ActivityTypes["CUSTOM_STATUS"] = 4] = "CUSTOM_STATUS";
    ActivityTypes[ActivityTypes["COMPETING"] = 5] = "COMPETING";
};