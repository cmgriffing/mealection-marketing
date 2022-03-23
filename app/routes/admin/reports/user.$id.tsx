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
} from "~/utils/types";
import { PageContainer } from "~/components/PageContainer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { gradeColorMap, scoreToGrade } from "~/utils/grades";
dayjs.extend(relativeTime);
import Color from "color";
import { colors } from "../../../../config/colors";
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
          <div className="left-column w-full md:w-1/3 text-center p-2">
            <div className="relative inline-block mb-8">
              <SmartImage
                presignedUrl={presignedUrl}
                placeholderKey={user.userId}
                placeholderType="beam"
                className="m-auto rounded w-40"
              />

              <div
                className="absolute w-16 h-16 flex items-center justify-center rounded-full text-4xl font-bold m-auto"
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
              <div className="text-center w-36 mx-auto">
                <div className="text-left">
                  Joined:
                  <span className="font-bold ml-2">
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
                  <h3 className="text-left font-bold p-2">Bans</h3>
                  <ol className="w-full">
                    {bans.map((ban) => (
                      <li className="flex flex-row w-full px-4 py-2">
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
          <div className="right-column  w-full md:w-2/3 flex flex-col flex-grow p-2">
            <h1 className="text-md">
              Name: <span className="font-bold text-2xl">{user.name}</span>
            </h1>
            <h2 className="text-md">
              User ID: <span className="font-bold text-xl">{user.userId}</span>
            </h2>
            {bans
              .filter((ban) => ban.banned && ban.unbanRequestReason)
              .map((ban) => (
                <Form className="p-2" method="post">
                  <input type="hidden" name="banId" value={ban.banId} />
                  <div className="p-2 bg-error-600 rounded">
                    <h3 className="text-white">Unban Request:</h3>
                    <div className="p-4 bg-gray-100 italic text-gray-900">
                      {ban.unbanRequestReason}
                    </div>
                    <div className="flex flex-row justify-end mt-2">
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
                    <td className="pl-4 p-2 text-center">
                      <Tag
                        size="xl"
                        color="primary"
                        variant="solid"
                        className="report-type-tag cursor-pointer text-center w-full items-center justify-center"
                      >
                        {Case.title(item.reportType).replace("Image", "📷")}
                      </Tag>
                    </td>
                    <td className="p-2 text-center">
                      <Tag color={color} variant="solid" className="">
                        <span className="capitalize w-20">{item.status}</span>

                        {item.reportVerdict === ReportVerdict.Dismissed && (
                          <span>✓</span>
                        )}

                        {item.reportVerdict === ReportVerdict.Confirmed && (
                          <span>𐄂</span>
                        )}
                      </Tag>
                    </td>
                    <td className="pr-4 p-2 text-right">
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
                  <td className="pl-4 p-2">{item.name}</td>
                  <td className="flex flex-grow"></td>
                  <td className="pr-4 p-2 text-right">
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
                  <td className="pl-4 p-2">{item.name}</td>
                  <td className="flex flex-grow"></td>
                  <td className="pr-4 p-2 text-right">
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
                  <td className="pl-4 p-2">{item.name}</td>
                  <td className="flex flex-grow"></td>
                  <td className="pr-4 p-2 text-right">
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
