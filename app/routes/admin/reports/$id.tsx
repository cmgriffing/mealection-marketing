import {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  redirect,
  useSearchParams,
} from "remix";
import { useLoaderData, json, Link, Form } from "remix";
import { axiosLoader } from "~/utils/loaders/axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import { AdminPage } from "~/components/admin/AdminPage";
import { PageTitle } from "~/components/admin/PageTitle";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Meal,
  Poll,
  ReportStatus,
  ReportType,
  ReportVerdict,
  UserReport,
} from "~/utils/types";
import { Button, Tag } from "@vechaiui/react";
dayjs.extend(relativeTime);

type IndexData = {
  report: UserReport;
  extraData: {
    poll?: Poll;
    meal?: Meal;
    presignedUrl?: string;
  };
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
        const presignedUrlResponse = await axios.post("/admin/image", {
          imageUrl: `users/${report.userId}.jpg`,
        });
        extraData.presignedUrl = presignedUrlResponse.data.presignedUrl;
      }

      if (report.reportType === ReportType.MealImage) {
        const presignedUrlResponse = await axios.post("/admin/image", {
          imageUrl: `meals/${report.reportMeta.mealId}.jpg`,
        });
        const mealResponse = await axios.get(
          `/meals/${report?.reportMeta?.mealId}`
        );
        extraData.meal = mealResponse.data;
        extraData.presignedUrl = presignedUrlResponse.data.presignedUrl;
      }

      if (report.reportType === ReportType.PollName) {
        const pollResponse = await axios.get(
          `/polls/${report.reportMeta.pollId}`
        );
        extraData.poll = pollResponse.data;
        // extraData.profileImage = presignedUrlResponse.data.presignedUrl;
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

export let action: ActionFunction = async function ({ request, params }) {
  const body = await request.formData();
  const axios = await axiosLoader({ request });

  const { id } = params;

  const result = await axios.post(`/reports/${id}`, {
    reportVerdict: body.get("reportVerdict"),
  });

  console.log({ result });

  if (body.get("previousRoute")) {
    return redirect(decodeURIComponent(body.get("previousRoute") as string));
  } else {
    return redirect("/admin/reports");
  }
};

// https://remix.run/guides/routing#index-routes
export default function Id() {
  let { report, extraData } = useLoaderData<IndexData>();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log({ report, extraData });

  return (
    <AdminPage>
      <div className="mx-auto md:w-3/4 lg:w-3/5 xl:w-1/2">
        <PageTitle>Report: {report.reportId}</PageTitle>
        <div className="flex flex-row">
          <div className="report-type text-xl">
            <span>Type: </span>
            <span className="capitalize font-bold">{report.reportType}</span>
          </div>
          <div className="flex flex-grow"></div>
          <div className="flex flex-row space-x-2">
            <div>👤</div>
            <div>{report.userId}</div>
          </div>
        </div>
        <div className="flex flex-row w-full mt-1 items-center">
          <div className="">
            <div className="flex mr-2">
              created:{" "}
              <span className="font-bold ml-2">
                {dayjs(report.createdAt).from(dayjs())}
              </span>
            </div>
            <div className="flex mr-2">
              updated:{" "}
              <span className="ml-2 font-bold">
                {dayjs(report.modifiedAt).from(dayjs())}
              </span>
            </div>
          </div>
          <div className="flex flex-grow"></div>
          <div>
            <Tag
              size="xl"
              variant="solid"
              className="capitalize"
              color={
                report.status === ReportStatus.Resolved ? "success" : "error"
              }
              style={{
                opacity: report.status === ReportStatus.Resolved ? 0.42 : 1,
              }}
            >
              {report.status}
            </Tag>
          </div>
        </div>
        <div className="">
          {report.reportType === ReportType.ProfileImage && (
            <div className="flex flex-col">
              <img src={extraData.presignedUrl} />
            </div>
          )}

          {report.reportType === ReportType.MealImage && (
            <div className="flex flex-col">
              {!extraData.meal?.unsplashImageData && (
                <>
                  <img src={extraData.presignedUrl} />
                </>
              )}
              {!!extraData.meal?.unsplashImageData && (
                <>
                  <img src={extraData.meal.unsplashImageData.imageUrl} />
                </>
              )}
            </div>
          )}

          {report.reportType === ReportType.PollName &&
            report.status === ReportStatus.Reported && (
              <div className="flex flex-col text-center text-4xl p-8">
                Poll Name: {extraData?.poll?.name}
                <p className="m-8">Is this poll name offensive?</p>
              </div>
            )}
          {report.reportType === ReportType.PollName &&
            report.status === ReportStatus.Resolved && (
              <div className="flex flex-col text-center text-4xl p-8">
                Poll Name: {report.reportMeta.originalName}
              </div>
            )}
        </div>
        {report.status !== ReportStatus.Resolved && (
          <div className="button-row flex flex-row justify-end">
            {false && <Button>Button</Button>}
            <Form className="block w-1/3 p-4" method="post">
              <input
                name="reportVerdict"
                type="hidden"
                value={ReportVerdict.Dismissed}
              />
              <input
                name="previousRoute"
                type="hidden"
                value={searchParams.get("previousRoute") || ""}
              />
              <Button className="w-full" variant="solid">
                No
              </Button>
            </Form>
            <Form className="block w-1/3 p-4" method="post">
              <input
                name="reportVerdict"
                type="hidden"
                value={ReportVerdict.Confirmed}
              />
              <input
                name="previousRoute"
                type="hidden"
                value={searchParams.get("previousRoute") || ""}
              />
              <Button className="w-full" variant="solid" color="error">
                Yes
              </Button>
            </Form>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
