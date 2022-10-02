"use strict";
exports.__esModule = true;
exports.ModificationHistoryAction = exports.ReportVerdict = exports.ReportStatus = exports.ReportType = exports.PollOptionType = exports.RestaurantType = exports.PollType = exports.Marketplace = exports.SubscriptionPricingVersion = exports.SubscriptionTier = exports.SubscriptionType = exports.BanReason = exports.SpecialUserRole = exports.Tables = exports.VoteResult = void 0;
var VoteResult;
(function (VoteResult) {
    VoteResult["Yes"] = "yes";
    VoteResult["No"] = "no";
    VoteResult["Favorite"] = "favorite";
    VoteResult["Veto"] = "veto";
})(VoteResult = exports.VoteResult || (exports.VoteResult = {}));
var Tables;
(function (Tables) {
    Tables["Users"] = "users";
    Tables["Polls"] = "polls";
    Tables["Meals"] = "meals";
    Tables["Restaurants"] = "restaurants";
    Tables["Teams"] = "teams";
    Tables["Teammates"] = "teammates";
    Tables["PollMeals"] = "pollMeals";
    Tables["PollRestaurants"] = "pollRestaurants";
    Tables["PollVotes"] = "pollVotes";
    Tables["Reports"] = "reports";
    Tables["WebSocketPollConnections"] = "webSocketPollConnections";
    Tables["Bans"] = "bans";
    Tables["Subscriptions"] = "subscriptions";
})(Tables = exports.Tables || (exports.Tables = {}));
var SpecialUserRole;
(function (SpecialUserRole) {
    SpecialUserRole["Admin"] = "admin";
    SpecialUserRole["Moderator"] = "moderator";
})(SpecialUserRole = exports.SpecialUserRole || (exports.SpecialUserRole = {}));
var BanReason;
(function (BanReason) {
    BanReason["InappropriateImages"] = "inappropriateImages";
    BanReason["InappropriateNames"] = "inappropriateNames";
    BanReason["Spam"] = "spam";
})(BanReason = exports.BanReason || (exports.BanReason = {}));
var SubscriptionType;
(function (SubscriptionType) {
    SubscriptionType["Monthly"] = "monthly";
    SubscriptionType["Yearly"] = "yearly";
    SubscriptionType["Beta"] = "beta";
})(SubscriptionType = exports.SubscriptionType || (exports.SubscriptionType = {}));
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["Base"] = "base";
    SubscriptionTier["Premium"] = "premium";
    SubscriptionTier["Enterprise"] = "enterprise";
})(SubscriptionTier = exports.SubscriptionTier || (exports.SubscriptionTier = {}));
var SubscriptionPricingVersion;
(function (SubscriptionPricingVersion) {
    SubscriptionPricingVersion["One"] = "1";
})(SubscriptionPricingVersion = exports.SubscriptionPricingVersion || (exports.SubscriptionPricingVersion = {}));
var Marketplace;
(function (Marketplace) {
    Marketplace["Apple"] = "apple";
    Marketplace["Android"] = "android";
    Marketplace["Internal"] = "internal";
})(Marketplace = exports.Marketplace || (exports.Marketplace = {}));
var PollType;
(function (PollType) {
    PollType["Home"] = "home";
    PollType["Out"] = "out";
})(PollType = exports.PollType || (exports.PollType = {}));
var RestaurantType;
(function (RestaurantType) {
    RestaurantType["Custom"] = "custom";
    RestaurantType["Yelp"] = "yelp";
})(RestaurantType = exports.RestaurantType || (exports.RestaurantType = {}));
var PollOptionType;
(function (PollOptionType) {
    PollOptionType["Meal"] = "meal";
    PollOptionType["Restaurant"] = "restaurant";
})(PollOptionType = exports.PollOptionType || (exports.PollOptionType = {}));
var ReportType;
(function (ReportType) {
    ReportType["Invite"] = "invite";
    ReportType["ProfileImage"] = "profileImage";
    ReportType["MealImage"] = "mealImage";
    ReportType["PollName"] = "pollName";
    ReportType["MealName"] = "mealName";
})(ReportType = exports.ReportType || (exports.ReportType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["Reported"] = "reported";
    ReportStatus["Resolved"] = "resolved";
})(ReportStatus = exports.ReportStatus || (exports.ReportStatus = {}));
var ReportVerdict;
(function (ReportVerdict) {
    ReportVerdict["Confirmed"] = "confirmed";
    ReportVerdict["Dismissed"] = "dismissed";
})(ReportVerdict = exports.ReportVerdict || (exports.ReportVerdict = {}));
var ModificationHistoryAction;
(function (ModificationHistoryAction) {
    ModificationHistoryAction["Banned"] = "banned";
    ModificationHistoryAction["Unbanned"] = "unbanned";
})(ModificationHistoryAction = exports.ModificationHistoryAction || (exports.ModificationHistoryAction = {}));
var IAPItemType;
(function (IAPItemType) {
    IAPItemType[IAPItemType["PURCHASE"] = 0] = "PURCHASE";
    IAPItemType[IAPItemType["SUBSCRIPTION"] = 1] = "SUBSCRIPTION";
})(IAPItemType || (IAPItemType = {}));
