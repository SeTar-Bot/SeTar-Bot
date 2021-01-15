module.exports = function (DefaultMessageNotificationLevel) {
    DefaultMessageNotificationLevel[DefaultMessageNotificationLevel["ALL_MESSAGES"] = 0] = "ALL_MESSAGES";
    DefaultMessageNotificationLevel[DefaultMessageNotificationLevel["ONLY_MENTIONS"] = 1] = "ONLY_MENTIONS";
};