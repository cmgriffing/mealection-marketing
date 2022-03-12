export enum UserRole {
  Admin = "admin",
  Standard = "standard",
}

export interface User {
  userId: string;
  email: string;
  role: UserRole;
  accessToken: string;
}

export enum ReportStatus {
  Reported = "reported",
  Resolved = "resolved",
}

export interface DatastoreRecord {
  createdAt: number;
  modifiedAt: number;
}

export interface UserReport extends DatastoreRecord {
  reportId: string;
  userId: string;
  status: ReportStatus;
  reportType: ReportType;
  extraDetails?: string;
}

export enum ReportType {
  Invite = "invite",
  ProfileImage = "profileImage",
  MealImage = "mealImage",
  PollName = "pollName",
}
