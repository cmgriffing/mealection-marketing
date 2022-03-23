import {
  MetaFunction,
  LoaderFunction,
  redirect,
  ActionFunction,
  Form,
} from "remix";
import { useLoaderData, json, Link } from "remix";
import { AdminPage } from "~/components/admin/AdminPage";
import { SmartImage } from "~/components/admin/SmartImage";
import { axiosLoader } from "~/utils/loaders/axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import {
  BanReason,
  Meal,
  Poll,
  ReportStatus,
  ReportVerdict,
  Restaurant,
  User,
  UserReport,
} from "grumblr-types";
import { PageContainer } from "~/components/PageContainer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { gradeColorMap, scoreToGrade } from "~/utils/grades";
dayjs.extend(relativeTime);
import Color from "color";
import { colors } from "../../../../config/colors";
import { Button, FormLabel, Select, Tag, Textarea } from "@vechaiui/react";
import Case from "case";
import { presignedUrlLoader } from "~/utils/loaders/presigned-url";
import { ExegeteButton } from "~/tsbs/ExegeteButton";

type IndexData = {
  userData: {
    user: User;
    polls: Poll[];
    reports: UserReport[];
    meals: Meal[];
    restaurants: Restaurant[];
    score: number;
    totalReports: number;
    guiltyReports: number;
    notGuiltyReports: number;
    pollsCount: number;
  };
  presignedUrl: string;
};

export let loader: LoaderFunction = async (loaderContext) => {
  const { request, params } = loaderContext;
  const { id } = params;
  const axios = await axiosLoader(loaderContext);

  return redirectIfNeeded(
    axios.get(`/admin/users/${id}`),
    request,
    async function (request, response) {
      const userData = response.data;

      const presignedUrl = await presignedUrlLoader(
        loaderContext,
        `users/${userData?.user?.userId}.jpg`
      );
      console.log({ presignedUrl });

      return { userData, presignedUrl };
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
  const banReason = body.get("banReason");
  const banDetails = body.get("banDetails");

  const { id } = params;

  const result = await axios.post(`/admin/users/${id}/bans`, {
    banReason,
    banDetails,
  });

  return redirect(`/admin/reports/user/${id}`);
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();

  const {
    userData: { user, polls, reports, meals, restaurants, score },
    presignedUrl,
  } = data;

  const grade = scoreToGrade(score);
  const gradeColor = gradeColorMap[grade];

  return (
    <AdminPage>
      <PageContainer>
        <div className="flex flex-row flex-wrap items-start justify-center mb-4">
          <div className="left-column relative md:w-auto text-center p-2 w-40">
            <SmartImage
              presignedUrl={presignedUrl}
              placeholderKey={user.userId}
              placeholderType="beam"
              className="m-auto rounded w-40"
            />
            <div
              className="absolute w-16 h-16 flex items-center justify-center rounded-full text-4xl font-bold m-auto bottom-0 right-0"
              style={{
                backgroundColor: gradeColor,
                color: Color(gradeColor).isDark() ? "white" : "black",
              }}
            >
              {grade}
            </div>
          </div>
          <div className="right-column w-full flex flex-col pt-4 sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto lg:mx-4">
            <h1 className="text-md">
              Name: <span className="font-bold text-2xl">{user.name}</span>
            </h1>
            <h2 className="text-md">
              User ID: <span className="font-bold text-xl">{user.userId}</span>
            </h2>

            <div className="text-left">
              Joined:
              <span className="font-bold ml-2">
                {dayjs(user.createdAt).format("MM/DD/YYYY")}
              </span>
              <span className="text-opacity-50">
                ({dayjs().to(dayjs(user.createdAt))})
              </span>
            </div>
          </div>
        </div>
        <Form
          method="post"
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto"
        >
          <FormLabel htmlFor="ban-reason">Reason for ban:</FormLabel>
          <Select
            name="banReason"
            id="ban-reason"
            placeholder="Select reason..."
            className="mb-2"
            required={true}
          >
            {Object.values(BanReason).map((reason) => {
              return <option>{Case.title(Case.sentence(reason))}</option>;
            })}
          </Select>

          <FormLabel htmlFor="ban-details">Moderator notes:</FormLabel>
          <Textarea name="banDetails" id="ban-details" className="mb-2" />

          <div className="text-right">
            <Link
              to={`/admin/reports/user/${user.userId}`}
              className="btn mr-6"
            >
              Cancel
            </Link>

            <ExegeteButton variant="solid" color="error">
              Ban User
            </ExegeteButton>
          </div>
        </Form>
      </PageContainer>
    </AdminPage>
  );
}

function CustomDetails({ label, items, itemContent }: any) {
  return (
    <details className="custom-details m-2 bg-primary-300 rounded border border-primary-300">
      <summary className="flex flex-row items-center p-2">
        <div className="pl-2">{label}</div>
        <div className="flex flex-grow"></div>
        <div className="bg-white font-bold w-8 h-8 flex items-center justify-center rounded-full">
          {items.length}
        </div>
      </summary>

      <table className="w-full">
        <tbody>
          {items.map((item: any, index: number) => (
            <tr
              key={index}
              className={` px-4 py-2 ${
                index % 2 === 0 ? "bg-primary-200" : "bg-primary-300"
              }`}
            >
              {itemContent(item)}
            </tr>
          ))}
          {!items.length && (
            <tr
              key="not-found"
              className="flex flex-row items-center justify-center"
            >
              <td></td>
              <td>No {label} found</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </details>
  );
}
