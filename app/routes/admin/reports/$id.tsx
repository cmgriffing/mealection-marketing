import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { axiosLoader } from "~/utils/loaders/axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import { AdminPage } from "~/components/admin/AdminPage";
import { PageTitle } from "~/components/admin/PageTitle";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReportType, UserReport } from "~/utils/types";
import { Button, Tag } from "@vechaiui/react";
dayjs.extend(relativeTime);

type IndexData = {
  report: UserReport;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  console.log({ params });
  const { id } = params;
  const axios = await axiosLoader({ request });

  return redirectIfNeeded(
    axios.get(`/reports/${id}`),
    request,
    async function (request, response) {
      const report: UserReport = response.data;

      const extraData: any = {};

      if (report.reportType === ReportType.ProfileImage) {
        const presignedUrlResponse = await axios.get("/image/");
        extraData.profileImage = presignedUrlResponse.data.presignedUrl;
      }

      if (report.reportType === ReportType.MealImage) {
        const mealResponse = await axios.get("/image/");
        // extraData.mealImage = mealResponse.data.presignedUrl;
      }

      if (report.reportType === ReportType.PollName) {
        const presignedUrlResponse = await axios.get(
          `/polls/${report.extraDetails}`
        );
        extraData.profileImage = presignedUrlResponse.data.presignedUrl;
      }

      return { report, extraData };
    }
  );
};
// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Thanks",
    description:
      "Thank you for signing up for the Mealection release announcements.",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Id() {
  let { report } = useLoaderData<IndexData>();

  return (
    <AdminPage>
      <div className="mx-auto md:w-3/4 lg:w-3/5 xl:w-1/2">
        <PageTitle>Report: {report.reportId}</PageTitle>
        <div className="flex flex-row">
          <div className="report-type ">
            <Tag size="xl" variant="solid">
              {report.reportType}
            </Tag>
          </div>
          <div className="flex flex-grow"></div>
          <div className="flex flex-row space-x-2">
            <div>👤</div>
            <div>{report.userId}</div>
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="flex p-2">
            created: {dayjs(report.createdAt).from(dayjs())}
          </div>
          <div className="flex p-2">
            updated: {dayjs(report.modifiedAt).from(dayjs())}
          </div>
        </div>
        <div className="">
          {report.reportType === ReportType.ProfileImage && (
            <div className="flex flex-col"></div>
          )}
        </div>
        <div className="button-row">
          <Button.Group variant="solid" className="space-x-2 text-right w-full">
            {false && <Button>Button</Button>}
            <Button className="w-1/3" variant="solid">
              No
            </Button>
            <Button className="w-1/3" variant="solid" color="error">
              Yes
            </Button>
          </Button.Group>
        </div>
      </div>
    </AdminPage>
  );
}
