import { MetaFunction, LoaderFunction, Form, ActionFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { AdminPage } from "~/components/admin/AdminPage";
import { SmartImage } from "~/components/admin/SmartImage";
import { axiosLoader } from "~/utils/loaders/axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import {
  Ban,
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
import { colors } from "../../../config/colors";
import { Button, Tag } from "@vechaiui/react";
import Case from "case";
import { presignedUrlLoader } from "~/utils/loaders/presigned-url";
import { ExegeteButton } from "~/tsbs/ExegeteButton";
import { useEffect, useState } from "react";

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
  bans: Ban[];
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

      const userId = userData?.user?.userId;

      const [presignedUrl, bansResponse] = await Promise.all([
        presignedUrlLoader(loaderContext, `users/${userId}.jpg`),
        axios.get(`/admin/users/${userId}/bans`),
      ]);
      console.log({ presignedUrl });

      return { userData, presignedUrl, bans: bansResponse.data.bans };
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
  const banId = body.get("banId");

  const { id } = params;

  const result = await axios.patch(`/admin/users/${id}/bans/${banId}`, {
    banned: false,
  });

  return {};
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();

  const {
    userData: { user, polls, reports, meals, restaurants, score },
    presignedUrl,
    bans,
  } = data;

  const [isBanned, setIsBanned] = useState(
    !!bans.find((ban: Ban) => ban.banned)
  );

  useEffect(() => {
    setIsBanned(!!bans.find((ban: Ban) => ban.banned));
  }, [bans]);

  const grade = scoreToGrade(score);
  const gradeColor = gradeColorMap[grade];

  return (
    <AdminPage>
      <PageContainer>
        <div className="flex flex-row flex-wrap">
          <div className="left-column w-full p-2 text-center md:w-1/3">
            <div className="relative mb-8 inline-block">
              <SmartImage
                presignedUrl={presignedUrl}
                placeholderKey={user.userId}
                placeholderType="beam"
                className="m-auto w-40 rounded"
              />

              <div
                className="absolute m-auto flex h-16 w-16 items-center justify-center rounded-full text-4xl font-bold"
                style={{
                  backgroundColor: gradeColor,
                  color: Color(gradeColor).isDark() ? "white" : "black",
                  bottom: "-1rem",
                  right: "-1rem",
                }}
              >
                {grade}
              </div>
            </div>
            <div>
              <div className="mx-auto w-36 text-center">
                <div className="text-left">
                  Joined:
                  <span className="ml-2 font-bold">
                    {dayjs(user.createdAt).format("MM/DD/YYYY")}
                  </span>
                </div>
                <div>
                  <div className="text-opacity-50">
                    ({dayjs().to(dayjs(user.createdAt))})
                  </div>
                </div>
              </div>
              {!isBanned && (
                <Link to={`/admin/reports/user/${user.userId}/ban`}>
                  <Button className="my-2 w-full" color="error" variant="solid">
                    Ban User
                  </Button>
                </Link>
              )}

              {isBanned && (
                <Button
                  className="my-2 w-full"
                  color="gray"
                  variant="solid"
                  disabled
                >
                  Banned
                </Button>
              )}
              {!!bans.length && (
                <>
                  <h3 className="p-2 text-left font-bold">Bans</h3>
                  <ol className="w-full">
                    {bans.map((ban) => (
                      <li className="flex w-full flex-row px-4 py-2">
                        <span>{dayjs(ban.createdAt).from(dayjs())}</span>
                        <span className="flex flex-grow"></span>
                        <span
                          className={`text-right ${
                            ban.banned ? "text-error-600" : "text-gray-400"
                          }`}
                        >
                          {ban.banned ? "Active" : "Reversed"}
                        </span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>
          <div className="right-column  flex w-full flex-grow flex-col p-2 md:w-2/3">
            <h1 className="text-md">
              Name: <span className="text-2xl font-bold">{user.name}</span>
            </h1>
            <h2 className="text-md">
              User ID: <span className="text-xl font-bold">{user.userId}</span>
            </h2>
            {bans
              .filter((ban) => ban.banned && ban.unbanRequestReason)
              .map((ban) => (
                <Form className="p-2" method="post">
                  <input type="hidden" name="banId" value={ban.banId} />
                  <div className="bg-error-600 rounded p-2">
                    <h3 className="text-white">Unban Request:</h3>
                    <div className="bg-gray-100 p-4 italic text-gray-900">
                      {ban.unbanRequestReason}
                    </div>
                    <div className="mt-2 flex flex-row justify-end">
                      <Button variant="solid">Remove Ban</Button>
                    </div>
                  </div>
                </Form>
              ))}

            <CustomDetails
              label="Reports"
              items={reports}
              itemContent={(item: any) => {
                let color = "gray";

                if (item.reportVerdict === ReportVerdict.Confirmed) {
                  color = "error";
                }

                if (item.reportVerdict === ReportVerdict.Dismissed) {
                  color = "success";
                }

                return (
                  <>
                    <td className="p-2 pl-4 text-center">
                      <Tag
                        size="xl"
                        color="primary"
                        variant="solid"
                        className="report-type-tag w-full cursor-pointer items-center justify-center text-center"
                      >
                        {Case.title(item.reportType).replace("Image", "📷")}
                      </Tag>
                    </td>
                    <td className="p-2 text-center">
                      <Tag color={color} variant="solid" className="">
                        <span className="w-20 capitalize">{item.status}</span>

                        {item.reportVerdict === ReportVerdict.Dismissed && (
                          <span>✓</span>
                        )}

                        {item.reportVerdict === ReportVerdict.Confirmed && (
                          <span>𐄂</span>
                        )}
                      </Tag>
                    </td>
                    <td className="p-2 pr-4 text-right">
                      {dayjs().to(item.createdAt)}
                    </td>
                  </>
                );
              }}
            />

            <CustomDetails
              label="Polls"
              items={polls}
              itemContent={(item: any) => (
                <>
                  <td className="p-2 pl-4">{item.name}</td>
                  <td className="flex flex-grow"></td>
                  <td className="p-2 pr-4 text-right">
                    {dayjs().to(item.createdAt)}
                  </td>
                </>
              )}
            />

            <CustomDetails
              label="Meals"
              items={meals}
              itemContent={(item: any) => (
                <>
                  <td className="p-2 pl-4">{item.name}</td>
                  <td className="flex flex-grow"></td>
                  <td className="p-2 pr-4 text-right">
                    {dayjs().to(item.createdAt)}
                  </td>
                </>
              )}
            />

            <CustomDetails
              label="Restaurants"
              items={restaurants}
              itemContent={(item: any) => (
                <>
                  <td className="p-2 pl-4">{item.name}</td>
                  <td className="flex flex-grow"></td>
                  <td className="p-2 pr-4 text-right">
                    {dayjs().to(item.createdAt)}
                  </td>
                </>
              )}
            />
          </div>
        </div>
      </PageContainer>
    </AdminPage>
  );
}

function CustomDetails({ label, items, itemContent }: any) {
  return (
    <details className="custom-details bg-primary-300 border-primary-300 m-2 rounded border">
      <summary className="flex flex-row items-center p-2">
        <div className="pl-2">{label}</div>
        <div className="flex flex-grow"></div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold">
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
