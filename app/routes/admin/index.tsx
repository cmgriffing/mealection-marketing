import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { Form, json } from "remix";
import { useEffect, useState } from "react";
import {
  getUserReports,
  getBugReports,
  getLastWeeksReports,
} from "~/utils/mocks";
import {
  VictoryChart,
  VictoryArea,
  VictoryStack,
  Area,
  VictoryVoronoiContainer,
} from "victory";
import { ReportType } from "../report";
import { ReportStatus, UserReport } from "grumblr-types";
import dayjs from "dayjs";
import { colors } from "../../../config/colors";
import { StackChart } from "~/components/StackChart";

import { Icon } from "@iconify/react";
import dashboardFilled from "@iconify/icons-ant-design/dashboard-filled";
import userVoice from "@iconify/icons-bxs/user-voice";
import bugIcon from "@iconify/icons-bxs/bug";
import { authenticator } from "~/services/auth.server";
import { axiosLoader } from "~/utils/loaders/axios";
import { DataFunctionArgs } from "@remix-run/server-runtime";
// import { Request } from "@remix-run/node";
import { AxiosError } from "axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import { PageTitle } from "~/components/admin/PageTitle";

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  // return redirect("/thanks");
};

export let loader: LoaderFunction = async ({ request }) => {
  const axios = await axiosLoader({ request });

  return redirectIfNeeded(
    axios.get("/reports/graphs/users"),
    request,
    async function (request, response) {
      const [{ userReports }, bugReports] = (
        await Promise.all([response, getLastWeeksReports(getBugReports)])
      ).map((mappedResponse) => mappedResponse.data);

      return {
        userReports,
        bugReports: bugReports,
      };
    }
  );
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const { userReports, bugReports, user } = useLoaderData();
  const groupedUserReports: any = {};
  userReports.forEach(
    (reportData: any) => (groupedUserReports[reportData.date] = reportData)
  );

  const totalUserReportsData = userReports.map(({ date, total }: any) => {
    return {
      x: date,
      y: total,
    };
  });

  const resolvedUserReportsData = userReports.map(({ date, resolved }: any) => {
    return {
      x: date,
      y: resolved,
    };
  });

  const groupedBugReports: any = {};
  bugReports.forEach(
    (reportData: any) => (groupedBugReports[reportData.date] = reportData)
  );

  const totalBugReportsData = bugReports.map(({ date, total }: any) => {
    return {
      x: date,
      y: total,
    };
  });

  const resolvedBugReportsData = bugReports.map(({ date, resolved }: any) => {
    return {
      x: date,
      y: resolved,
    };
  });

  return (
    <div className="relative py-4 px-8 z-0">
      <PageTitle>Dashboard</PageTitle>
      <div className="flex flex-row flex-wrap items-center justify-center">
        <Cell label="User Reports" icon={userVoice}>
          <StackChart
            keyedDataset={groupedUserReports}
            baseDataset={totalUserReportsData}
            subDatasets={[resolvedUserReportsData]}
          />
        </Cell>
        <Cell label="Bug Reports" icon={bugIcon}>
          <StackChart
            keyedDataset={groupedBugReports}
            baseDataset={totalBugReportsData}
            subDatasets={[resolvedBugReportsData]}
          />
        </Cell>
      </div>
    </div>
  );
}

function Cell({ label, icon, children }: any) {
  return (
    <div className="w-80 p-0 border border-primary-600 m-4">
      <header className="w-full bg-primary-500 px-4 py-2 m-0 flex flex-row items-center">
        <span className="mr-2 w-4">
          <Icon icon={icon} />
        </span>
        <span>{label}</span>
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}
