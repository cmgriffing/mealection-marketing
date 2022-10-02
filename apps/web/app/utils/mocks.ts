import { rand, seed } from "@ngneat/falso";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { ReportStatus, UserReport } from "./types";

seed("some-constant-seed");

export async function getUserReports() {
  const now = dayjs();

  const userReports = new Array(200)
    .fill("")
    .map(() => {
      const timestamp =
        now
          .subtract(rand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), "day")
          .unix() * 1000;
      return {
        reportId: nanoid(),
        status:
          rand([0, 1]) === 1 ? ReportStatus.Reported : ReportStatus.Resolved,
        timestamp,
      };
    })
    .sort((reportA, reportB) => {
      return reportA.timestamp - reportB.timestamp;
    });

  return userReports;
}

export async function getLastWeeksReports(getReports: Function) {
  const reports = await getReports();

  const now = dayjs();
  const previousTotalReports = reports.filter(
    (report: any) =>
      dayjs(now).subtract(7, "days").unix() * 1000 > report.timestamp
  );

  const previousResolvedReports = previousTotalReports.filter(
    (report: any) => report.status === ReportStatus.Resolved
  );

  let runningTotal = previousTotalReports.length;
  let runningResolved = previousResolvedReports.length;

  const groupedResults: any = {};
  reports.forEach((report: any) => {
    const date = dayjs(report.timestamp).format("MM/DD");
    if (!groupedResults[date]) {
      groupedResults[date] = [];
    }
    groupedResults[date].push(report);
  });

  return {
    data: [7, 6, 5, 4, 3, 2, 1]
      .map((daysAgo) => now.subtract(daysAgo, "days").format("MM/DD"))
      .map((date) => {
        if (!groupedResults[date]) {
          groupedResults[date] = [];
        }
        const dailyTotal = groupedResults[date].length;
        const dailyResolved = groupedResults[date].filter(
          (report: any) => report.status === ReportStatus.Resolved
        ).length;

        runningTotal += dailyTotal;
        runningResolved += dailyResolved;

        return {
          date,
          total: runningTotal,
          dailyTotal,
          resolved: runningResolved,
          dailyResolved,
        };
      }),
  };
}

export async function getBugReports() {
  const now = dayjs();

  const timestamp =
    now
      .subtract(rand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), "day")
      .unix() * 1000;

  const bugReports = new Array(100)
    .fill("")
    .map(() => {
      return {
        reportId: nanoid(),
        status:
          rand([0, 1]) === 1 ? ReportStatus.Reported : ReportStatus.Resolved,
        timestamp,
      };
    })
    .sort((reportA, reportB) => {
      return reportA.timestamp - reportB.timestamp;
    });

  return bugReports;
}
