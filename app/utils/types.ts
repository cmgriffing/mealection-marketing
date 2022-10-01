import { Component, ComponentType } from "react";
import {
  HTTPClientErrorResponses,
  HTTPServerErrorResponses,
} from "./http-status";

export enum UserRole {
  Admin = "admin",
  Standard = "standard",
}

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
}

export enum SpecialUserRole {
  Admin = "admin",
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

export enum SubscriptionType {
  Monthly = "monthly",
  Yearly = "yearly",
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
  unsplashImageData?: {
    thumbUrl: string;
    imageUrl: string;
    author: string;
    authorUrl: string;
  };
}

export interface PollMeal extends DatastoreRecord {
  pollId: string;
  mealId: string;
}

export interface Restaurant extends DatastoreRecord {
  restaurantId: string;
  userId: string;
  name: string;
}

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

export interface TableTypes {
  [Tables.Users]: User;
  [Tables.Polls]: Poll;
  [Tables.Meals]: Meal;
  [Tables.Restaurants]: Restaurant;
  [Tables.Teams]: Team;
  [Tables.Teammates]: Teammate;
  [Tables.PollVotes]: PollVote;
}

export interface RouteOptions {
  path: string;
  summary: string;
  description: string;
  tags: string[];
  headers: { [key: string]: string };
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  definedErrors: (HTTPClientErrorResponses | HTTPServerErrorResponses)[];
  // Maybe we could combine the schema paths into a common interpolatable variable. (postUser)
  requestJsonSchemaPath?: string;
  responseJsonSchemaPath: string;
  errorJsonSchemaPath: string | "errorResponseSchema.json";
}

// There is probably a better place for this
export function Route(options: RouteOptions): Function {
  return () => {
    return;
  };
}

export enum PollOptionType {
  Meal = "meals",
  Restaurant = "restaurants",
}

export enum ReportType {
  Invite = "invite",
  ProfileImage = "profileImage",
  MealImage = "mealImage",
  PollName = "pollName",
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

export type UserReport = ProfileImageReport | PollNameReport | MealImageReport;

export enum BanReason {
  InappropriateImages = "inappropriateImages",
  InappropriateNames = "inappropriateNames",
  Spam = "spam",
}

export interface Ban extends DatastoreRecord {
  banId: string;
  userId: string;
  issuerId: string;
  banned: boolean;
  banReason?: BanReason;
  banDetails?: string;
  unbanRequestReason?: string;
  unbanRequestToken?: string;
}

export interface BlogPostMeta {
  default: ComponentType<{}>;
  attributes: {
    meta: Record<string, any>;
    headers: Record<string, string>;
  };
  filename: string;
}

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  content?: string;
  draft?: boolean;
};
