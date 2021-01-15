module.exports = function (PremiumTier) {
    PremiumTier[PremiumTier["NONE"] = 0] = "NONE";
    PremiumTier[PremiumTier["TIER_1"] = 1] = "TIER_1";
    PremiumTier[PremiumTier["TIER_2"] = 2] = "TIER_2";
    PremiumTier[PremiumTier["TIER_3"] = 3] = "TIER_3";
};