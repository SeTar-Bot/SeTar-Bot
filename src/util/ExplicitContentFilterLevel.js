module.exports = function (ExplicitContentFilterLevel) {
    ExplicitContentFilterLevel[ExplicitContentFilterLevel["DISABLED"] = 0] = "DISABLED";
    ExplicitContentFilterLevel[ExplicitContentFilterLevel["MEMBERS_WITHOUT_ROLES"] = 1] = "MEMBERS_WITHOUT_ROLES";
    ExplicitContentFilterLevel[ExplicitContentFilterLevel["ALL_MEMBERS"] = 2] = "ALL_MEMBERS";
};