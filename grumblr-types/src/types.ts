export enum VoteResult {
  Yes = "yes",
  No = "no",
  Favorite = "favorite",
  Veto = "veto",
}

export enum Tables {
  Users = "users",
  Polls = "polls",
  Meals = "meals",
  Restaurants = "restaurants",
  Teams = "teams",
  Teammates = "teammates",
  PollMeals = "pollMeals",
  PollRestaurants = "pollRestaurants",
  PollVotes = "pollVotes",
  Reports = "reports",
  WebSocketPollConnections = "webSocketPollConnections",
  Bans = "bans",
  Subscriptions = "subscriptions",
}

export interface UnsplashImageData {
  thumbUrl: string;
  imageUrl: string;
  author: string;
  authorUrl: string;
}

export enum SpecialUserRole {
  Admin = "admin",
  Moderator = "moderator",
}

export interface DatastoreRecord {
  createdAt: number;
  modifiedAt: number;
}

export interface User extends DatastoreRecord {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  verificationToken: string;
  verified: boolean;
  role?: SpecialUserRole;
}

export type PostUserRequest = Pick<User, "name" | "email">;

export enum BanReason {
  InappropriateImages = "inappropriateImages",
  InappropriateNames = "inappropriateNames",
  Spam = "spam",
}

export enum SubscriptionType {
  Monthly = "monthly",
  Yearly = "yearly",
  Beta = "beta",
}

export enum SubscriptionTier {
  Base = "base",
  Premium = "premium",
  Enterprise = "enterprise",
}

export enum SubscriptionPricingVersion {
  One = "1",
}

export enum Marketplace {
  Apple = "apple",
  Android = "android",
  Internal = "internal",
}

export interface Subscription extends DatastoreRecord {
  active: boolean;
  userId: string;
  subscriptionId: string;
  subscriptionType: SubscriptionType;
  subscriptionTier: SubscriptionTier;
  subscriptionVersion: SubscriptionPricingVersion;
  marketplace: Marketplace;
  productId: string;
}

export interface Poll extends DatastoreRecord {
  pollId: string;
  teamId: string;
  userId: string;
  name: string;
  pollType: PollType;
}

export enum PollType {
  Home = "home",
  Out = "out",
}

export interface Meal extends DatastoreRecord {
  mealId: string;
  userId: string;
  name: string;
  unsplashImageData?: UnsplashImageData;
}

export interface PollMeal extends DatastoreRecord {
  pollId: string;
  mealId: string;
}

export enum RestaurantType {
  Custom = "custom",
  Yelp = "yelp",
}

export interface BaseRestaurant extends DatastoreRecord {
  restaurantId: string;
  userId: string;
  name: string;
  restaurantType: RestaurantType;
}

export interface CustomRestaurant extends BaseRestaurant {
  restaurantType: RestaurantType.Custom;
  unsplashImageData?: UnsplashImageData;
}

export interface YelpRestaurant extends BaseRestaurant {
  restaurantType: RestaurantType.Yelp;
  yelpId: string;
}

export type Restaurant = YelpRestaurant | CustomRestaurant;

export interface PollRestaurant extends DatastoreRecord {
  pollId: string;
  restaurantId: string;
}

export interface Team extends DatastoreRecord {
  teamId: string;
  ownerId: string;
  name: string;
}

export interface Teammate extends DatastoreRecord {
  teamId: string;
  userId: string;
  accepted: boolean;
  inviteToken: string;
}

export interface PollVote extends DatastoreRecord {
  pollId: string;
  userId: string;
  optionType: PollOptionType;
  itemId: string;
  voteResult: VoteResult;
}

export interface WebSocketPollConnection extends DatastoreRecord {
  connectionId: string;
  pollId: string;
  userId: string;
  TTL: number;
}

export enum PollOptionType {
  Meal = "meal",
  Restaurant = "restaurant",
}

export enum ReportType {
  Invite = "invite",
  ProfileImage = "profileImage",
  MealImage = "mealImage",
  PollName = "pollName",
  MealName = "mealName",
}

export enum ReportStatus {
  Reported = "reported",
  Resolved = "resolved",
}

export enum ReportVerdict {
  Confirmed = "confirmed",
  Dismissed = "dismissed",
}

export interface BaseReport extends DatastoreRecord {
  reportId: string;
  userId: string;
  status: ReportStatus;
  reportType: ReportType;
  reporterId: string;
  reportVerdict?: ReportVerdict;
  extraDetail?: string;
  reportMeta?: Record<string, string | number>;
}

export interface ProfileImageReport extends BaseReport {
  reportType: ReportType.ProfileImage;
}

export interface PollNameReport extends BaseReport {
  reportType: ReportType.PollName;
  reportMeta: {
    pollId: string;
    originalName?: string;
  };
}

export interface MealImageReport extends BaseReport {
  reportType: ReportType.MealImage;
  reportMeta: {
    mealId: string;
  };
}

export interface MealNameReport extends BaseReport {
  reportType: ReportType.MealName;
  reportMeta: {
    mealId: string;
    originalName?: string;
  };
}

export type UserReport =
  | ProfileImageReport
  | PollNameReport
  | MealImageReport
  | MealNameReport;

export enum ModificationHistoryAction {
  Banned = "banned",
  Unbanned = "unbanned",
}

export interface ModificationHistoryEntry {
  timestamp: number;
  userId: string;
  action: ModificationHistoryAction;
}

export interface Ban extends DatastoreRecord {
  banId: string;
  userId: string;
  issuerId: string;
  banned: boolean;
  modificationHistory: ModificationHistoryEntry[];
  banReason: BanReason;
  banDetails?: string;
  unbanRequestReason?: string;
  unbanRequestToken?: string;
}

/* ---------------------------------------------------------------------
 * Requests
 *
 *
 *
 *
 *
 *
 */

export interface LoginRequest {
  /*
   * @format email
   */
  email: string;

  /*
   * @maxLength 32
   */
  password: string;
}

export interface RegisterRequest {
  /*
   * @maxLength 20
   */
  name: string;
  /*
   * @format email
   */
  email: string;

  /*
   * @minLength 32
   * @maxLength 32
   * @pattern ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$
   */
  password: string;
  verifyToken?: string;
}

export interface UpdateUserRequest {
  /*
   * @minLength 3
   * @maxLength 20
   */
  name?: string;
}

export interface UserVerificationRequest {
  verificationToken: string;
}

export interface PostPollRequest {
  teamId: string;
  /*
   * @minLength 3
   * @maxLength 20
   */
  name: string;
  pollType: PollType;
}

export type UpdatePollRequest = Omit<PostPollRequest, "teamId">;

export interface PostMealRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  name: string;
  pollId?: string;
  unsplashImageData?: {
    thumbUrl: string;
    imageUrl: string;
    author: string;
    authorUrl: string;
  } | null;
}

export type UpdateMealRequest = Omit<Partial<PostMealRequest>, "pollId">;

// This can't actually be used for ts-to-zod.
export type RestaurantRequestOmitKeys =
  | "restaurantId"
  | "userId"
  | "createdAt"
  | "modifiedAt"
  | "partitionKey"
  | "sortKey";

export interface PostRestaurantRequest {
  pollId?: string;
  restaurant:
    | Omit<
        YelpRestaurant,
        | "restaurantId"
        | "userId"
        | "createdAt"
        | "modifiedAt"
        | "partitionKey"
        | "sortKey"
      >
    | Omit<
        CustomRestaurant,
        | "restaurantId"
        | "userId"
        | "createdAt"
        | "modifiedAt"
        | "partitionKey"
        | "sortKey"
      >;
}

export type UpdateRestaurantRequest =
  | Partial<
      Omit<
        YelpRestaurant,
        | "restaurantId"
        | "userId"
        | "createdAt"
        | "modifiedAt"
        | "partitionKey"
        | "sortKey"
      >
    >
  | Partial<
      Omit<
        CustomRestaurant,
        | "restaurantId"
        | "userId"
        | "createdAt"
        | "modifiedAt"
        | "partitionKey"
        | "sortKey"
      >
    >;

export interface PostTeamRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  name: string;
}

export type UpdateTeamRequest = Partial<PostTeamRequest>;

export interface PostVoteRequest {
  voteResult: VoteResult;
}

export interface UploadImageRequest {
  fileSize: number;
}

export interface PostTeammateRequest {
  /*
   * @format email
   */
  email: string;
}

export interface PostTeammateAcceptRequest {
  inviteToken: string;
}

export interface ImageSearchRequest {
  searchQuery: string;
}

export interface RestaurantSearchRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  searchQuery: string;
  /*
   * minimum -180
   * maximum 180
   */
  latitude?: number;
  /*
   * minimum -180
   * maximum 180
   */
  longitude?: number;

  location?: string;
}

export interface GeolocationIpLookupRequest {
  /*
   * IPv4 only for now
   * @minLength 7
   * @maxLength 15
   */
  ipAddress: string;
}

export interface BaseReportRequest {
  reportType: ReportType;
  extraDetail?: string;
  reportMeta?: Record<string, string | number>;
}

export interface ProfileImageReportRequest extends BaseReportRequest {
  reportType: ReportType.ProfileImage;
}

export interface PollNameReportRequest extends BaseReportRequest {
  reportType: ReportType.PollName;
  reportMeta: {
    pollId: string;
  };
}

export interface MealImageReportRequest extends BaseReportRequest {
  reportType: ReportType.MealImage;
  reportMeta: {
    mealId: string;
  };
}

export interface ReportInviteRequest {
  inviteToken: string;
  teamId: string;
  inviterUserId: string;
  reporterUserId: string;
}

export interface ProcessReportRequest {
  reportVerdict: ReportVerdict;
}

export type ReportUserRequest =
  | ProfileImageReportRequest
  | PollNameReportRequest
  | MealImageReportRequest;

export interface BanUserRequest {
  banReason: BanReason;
  banDetails?: string;
}

export interface UnbanRequestRequest {
  unbanRequestToken: string;
  unbanRequestReason: string;
}

export interface ModifyBanRequest {
  banned: boolean;
}

/* ---------------------------------------------------------------------
 * Responses
 *
 *
 *
 *
 *
 *
 */

export interface ErrorResponse {
  message?: string;
}

export interface EmptyResponse {}

export interface PostUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    userId: string;
  };
}

export interface PostTeamResponse extends DatastoreRecord {
  teamId: string;
  userId: string;
  name: string;
}

export type PostMealResponse = Omit<
  Meal,
  "createdAt" | "modifiedAt" | "partitionKey" | "sortKey"
>;

export interface GetMealsResponse {
  meals: Meal[];
}

export type PostRestaurantResponse = Restaurant;

export interface GetRestaurantsResponse {
  restaurants: Restaurant[];
}

export type PostPollResponse = Poll;

export interface GetPollResponse extends Poll {
  mealOptions: Meal[];
  restaurantOptions: Restaurant[];
}

export interface GetPollsResponse {
  polls: Poll[];
}

export interface GetTeamsResponse {
  ownedTeams: PostTeamResponse[];
  joinedTeams: PostTeamResponse[];
}

export interface PostTeammateResponse extends DatastoreRecord {
  userId: string;
  name: string;
  email: string;
  accepted: boolean;
}

export interface GetImageResponse {
  presignedUrl: string;
}

export interface GetSubscriptionResponse {
  userId: string;
  subscriptionId: string;
  subscriptionType: string;
  subscriptionTier: string;
  subscriptionVersion: string;
  marketplace: string;
  productId: string;
  createdAt: number;
  modifiedAt: number;
}

export interface GetSubscriptionsResponse {
  subscriptions: GetSubscriptionResponse[];
}

export interface PresignedPostResponse {
  url: string;
  fields: {
    Policy: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    "X-Amz-Signature": string;
    bucket: string;
    key: string;
  };
}

export interface ImageSearchResponse {
  searchResults: {
    id: string;
    created_at: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    likes: number;
    liked_by_user: boolean;
    description: string;
    user: {
      id: string;
      username: string;
      name: string;
      first_name: string;
      last_name: string;
      instagram_username: string;
      twitter_username: string;
      portfolio_url: string;
      profile_image: {
        small: string;
        medium: string;
        large: string;
      };
      links: {
        self: string;
        html: string;
        photos: string;
        likes: string;
      };
    };
    current_user_collections?: null[] | null;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    links: {
      self: string;
      html: string;
      download: string;
    };
  }[];
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface GetPollVotesResponse {}

export interface RestaurantSearchItem {
  rating: number;
  price: string;
  phone: string;
  id: string;
  alias: string;
  is_closed: boolean;
  categories?:
    | {
        alias: string;
        title: string;
      }[]
    | null;
  review_count: number;
  name: string;
  url: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image_url: string;
  location: {
    city: string;
    country: string;
    address2: string;
    address3: string;
    state: string;
    address1: string;
    zip_code: string;
  };
  distance: number;
  transactions?: string[] | null;
}
export interface RestaurantSearchResponse {
  searchResults: RestaurantSearchItem[];
}

export interface GetUserScoreResponse {
  score: number;
  totalReports: number;
  guiltyReports: number;
  notGuiltyReports: number;
  pollsCount: number;
}

export interface AdminUserResponse {}

export interface UserBansResponse {
  bans: {
    banId: string;
    userId: string;
    issuerId: string;
    banned: boolean;
    modificationHistory: any[];
    banReason: string;
    banDetails?: string;
    unbanRequestReason?: string;
    unbanRequestToken?: string;
  }[];
}

export interface GeolocationIpLookupResponse {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  hostname: string;
}

export interface RestaurantDetailsResponse {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  url: string;
  phone: string;
  display_phone: string;
  review_count: number;
  categories?:
    | {
        alias: string;
        title: string;
      }[]
    | null;
  rating: number;
  location: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address?: string[] | null;
    cross_streets: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos?: string[] | null;
  price: string;
  hours?:
    | {
        open?:
          | {
              is_overnight: boolean;
              start: string;
              end: string;
              day: number;
            }[]
          | null;
        hours_type: string;
        is_open_now: boolean;
      }[]
    | null;
  transactions?: null[] | null;
  special_hours?:
    | {
        date: string;
        is_closed?: null;
        start: string;
        end: string;
        is_overnight: boolean;
      }[]
    | null;
}

enum IAPItemType {
  PURCHASE = 0,
  SUBSCRIPTION = 1,
}

interface IAPItemDetails {
  title: string;
  description: string;
  productId: string;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  type: IAPItemType;
  subscriptionPeriod?: string;
}

export interface Product {
  name: string;
  duration: string;
  version: number;
  iapItemDetails: IAPItemDetails;
}
