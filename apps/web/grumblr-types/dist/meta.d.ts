import { Meal, Poll, PollVote, Restaurant, Tables, Team, Teammate, User } from "./types";
export interface TableTypes {
    [Tables.Users]: User;
    [Tables.Polls]: Poll;
    [Tables.Meals]: Meal;
    [Tables.Restaurants]: Restaurant;
    [Tables.Teams]: Team;
    [Tables.Teammates]: Teammate;
    [Tables.PollVotes]: PollVote;
}
//# sourceMappingURL=meta.d.ts.map