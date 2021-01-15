module.exports = function (VerificationLevel) {
    VerificationLevel[VerificationLevel["NONE"] = 0] = "NONE";
    VerificationLevel[VerificationLevel["LOW"] = 1] = "LOW";
    VerificationLevel[VerificationLevel["MEDIUM"] = 2] = "MEDIUM";
    VerificationLevel[VerificationLevel["HIGH"] = 3] = "HIGH";
    VerificationLevel[VerificationLevel["VERY_HIGH"] = 4] = "VERY_HIGH";
};