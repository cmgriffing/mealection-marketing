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
import Avatar from "boring-avatars";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Meal,
  Poll,
  ReportStatus,
  ReportType,
  ReportVerdict,
  UserReport,
} from "grumblr-types";
import { Button, Tag } from "@vechaiui/react";
import { colorPaletteFromId } from "~/utils/color-palette-from-id";
import { colors } from "../../../../config/colors";
import { gradeColorMap, scoreToGrade } from "~/utils/grades";
import { ExegeteButton } from "~/tsbs/ExegeteButton";
import Case from "case";

dayjs.extend(relativeTime);

type IndexData = {
  report: UserReport;
  extraData: {
    poll?: Poll;
    meal?: Meal;
    presignedUrl?: string;
  };
  userScore: number;
};

export let loader: LoaderFunction = async (loaderContext) => {
  const { request, params } = loaderContext;
  const { id } = params;
  const axios = await axiosLoader(loaderContext);

  return redirectIfNeeded(
    axios.get(`/reports/${id}`),
    request,
    async function (request, response) {
      const report: UserReport = response.data;

      const extraData: any = {};

      const userScoreResponse = await axios.get(
        `/admin/users/${report.userId}/score`
      );

      const userScore = userScoreResponse.data.score;
      console.log({ userScore });

      if (report.reportType === ReportType.ProfileImage) {
        const presignedUrlResponse = await axios.post(`/admin/image`, {
          imageUrl: `users/${report.userId}.jpg`,
        });

        const headResponse = await fetch(
          presignedUrlResponse.data.presignedHeadUrl,
          {
            method: "HEAD",
          }
        ).catch((error) => {
          console.log("Error fetching head.", error);
        });

        if (headResponse?.status === 200) {
          extraData.presignedUrl = presignedUrlResponse.data.presignedGetUrl;
        }
      }

      if (report.reportType === ReportType.MealImage) {
        const [presignedUrlResponse, mealResponse] = await Promise.all([
          axios.post("/admin/image", {
            imageUrl: `meals/${report.reportMeta.mealId}.jpg`,
          }),
          axios.get(`/meals/${report?.reportMeta?.mealId}`),
        ]);

        extraData.meal = mealResponse.data;

        const headRequest = await axios
          .head(presignedUrlResponse.data.presignedHeadUrl)
          .catch((error) => {
            console.log("Error fetching head.", error);
          });

        if (headRequest) {
          extraData.presignedUrl = presignedUrlResponse.data.presignedUrl;
        }
      }

      if (report.reportType === ReportType.PollName) {
        const pollResponse = await axios.get(
          `/polls/${report.reportMeta.pollId}`
        );
        extraData.poll = pollResponse.data;
        // extraData.profileImage = presignedUrlResponse.data.presignedUrl;
      }

      return { report, extraData, userScore };
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

export let action: ActionFunction = async function (loaderContext) {
  const { request, params } = loaderContext;
  const body = await request.formData();
  const axios = await axiosLoader(loaderContext);

  const { id } = params;

  const result = await axios.post(`/admin/reports/${id}`, {
    reportVerdict: body.get("reportVerdict"),
  });

  if (body.get("previousRoute")) {
    return redirect(decodeURIComponent(body.get("previousRoute") as string));
  } else {
    return redirect("/admin/reports");
  }
};

// https://remix.run/guides/routing#index-routes
export default function Id() {
  let { report, extraData, userScore } = useLoaderData<IndexData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const grade = scoreToGrade(userScore);

  return (
    <AdminPage>
      <div className="mx-auto md:w-3/4 lg:w-3/5 xl:w-1/2">
        <PageTitle>
          Report: <span className="font-bold">{report.reportId}</span>
        </PageTitle>
        <div className="flex flex-row">
          <div className="report-type text-xl flex flex-row items-center">
            <span>Type: </span>
            <span className="capitalize font-bold ml-2">
              {Case.sentence(report.reportType)}
            </span>
          </div>
          <div className="flex flex-grow"></div>
          <Link
            to={`/admin/reports/user/${report.userId}`}
            className="floating-link flex flex-row space-x-2 rounded items-center justify-center p-2"
            style={{ background: `${gradeColorMap[grade]}` }}
          >
            <div className="bg-white rounded py-1 px-2">User: </div>
            <div className="font-bold">{report.userId}</div>

            <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
              {grade}
            </div>
          </Link>
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
            <div className="flex flex-col items-center w-full">
              {!!extraData.presignedUrl && (
                <img className="w-96 h-auto" src={extraData.presignedUrl} />
              )}

              {!extraData.presignedUrl && (
                <Avatar
                  size={250}
                  variant="beam"
                  square={true}
                  name={report.userId}
                  colors={colorPaletteFromId(report.userId)}
                />
              )}

              {report.status !== ReportStatus.Resolved && (
                <p className="text-4xl m-8">Is this image offensive?</p>
              )}
            </div>
          )}

          {report.reportType === ReportType.MealImage && (
            <div className="flex flex-col items-center w-full">
              {!!extraData.presignedUrl && (
                <img className="w-96 h-auto" src={extraData.presignedUrl} />
              )}
              {!!extraData.meal?.unsplashImageData && (
                <img
                  className="w-96 h-auto"
                  src={extraData.meal.unsplashImageData.imageUrl}
                />
              )}

              {!extraData.presignedUrl &&
                !extraData.meal?.unsplashImageData && (
                  <Avatar
                    size={250}
                    square={true}
                    variant="bauhaus"
                    name={extraData?.meal?.mealId}
                    colors={colorPaletteFromId(extraData?.meal?.mealId || "")}
                  />
                )}
              {report.status !== ReportStatus.Resolved && (
                <p className="m-8 text-4xl">Is this image offensive?</p>
              )}
            </div>
          )}

          {report.reportType === ReportType.PollName &&
            report.status === ReportStatus.Reported && (
              <div className="flex flex-col text-center text-4xl p-8">
                Poll Name: {extraData?.poll?.name}
                <p className="m-8 text-4xl">Is this poll name offensive?</p>
              </div>
            )}
          {report.reportType === ReportType.PollName &&
            report.status === ReportStatus.Resolved && (
              <div className="flex flex-col text-center text-4xl p-8">
                Poll Name: {report?.reportMeta?.originalName}
              </div>
            )}

          {report.reportType === ReportType.MealName &&
            report.status === ReportStatus.Reported && (
              <div className="flex flex-col text-center text-4xl p-8">
                Meal Name: {extraData?.meal?.name}
                <p className="m-8 text-4xl">Is this meal name offensive?</p>
              </div>
            )}
          {report.reportType === ReportType.MealName &&
            report.status === ReportStatus.Resolved && (
              <div className="flex flex-col text-center text-4xl p-8">
                Meal Name: {report?.reportMeta?.originalName}
              </div>
            )}
        </div>
        {report.status !== ReportStatus.Resolved && (
          <Form className="button-row flex flex-row justify-end" method="post">
            <input
              name="previousRoute"
              type="hidden"
              value={searchParams.get("previousRoute") || ""}
            />
            {false && <Button>Button</Button>}
            <div className="w-1/3 p-4">
              <ExegeteButton
                value={ReportVerdict.Dismissed}
                name="reportVerdict"
                className="w-full"
                variant="solid"
              >
                No
              </ExegeteButton>
            </div>

            <div className="w-1/3 p-4">
              <ExegeteButton
                className="w-full"
                variant="solid"
                color="error"
                value={ReportVerdict.Confirmed}
                name="reportVerdict"
              >
                Yes
              </ExegeteButton>
            </div>
          </Form>
        )}
      </div>
    </AdminPage>
  );
}
