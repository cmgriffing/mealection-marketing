import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
  LoaderFunction,
  useLoaderData,
  Link,
  useSearchParams,
  LinksFunction,
  useLocation,
} from "remix";
import { Form, json } from "remix";
import heroImage from "../../images/hero.jpg";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { axiosLoader } from "~/utils/loaders/axios";
import { redirectIfNeeded } from "~/utils/redirectIfNeeded";
import { getLastWeeksReports, getBugReports } from "~/utils/mocks";
import { ReportStatus, ReportType, UserReport } from "grumblr-types";
import { Button, Select, Tag } from "@vechaiui/react";
// import dayjs = require("dayjs");
import Case from "case";
import { Icon } from "@iconify/react";
import chevronDoubleDown from "@iconify/icons-bi/chevron-double-down";
import chevronDoubleUp from "@iconify/icons-bi/chevron-double-up";
import userTableStyles from "~/styles/admin/user.css";
import { PageTitle } from "~/components/admin/PageTitle";
import { AdminPage } from "~/components/admin/AdminPage";
import { RemixLinkProps } from "@remix-run/react/components";
import { Props } from "@headlessui/react/dist/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: userTableStyles }];
};

// export let action: ActionFunction = async ({ request }) => {
//   let formData = await request.formData();

//   // return redirect("/thanks");
// };

enum CommonFilter {
  ALL = "all",
}

enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

interface Filters {
  status?: ReportStatus | CommonFilter.ALL;
  createdAt?: SortOrder;
  reportType?: ReportType | CommonFilter.ALL;
}

const defaultFilters: Filters = {
  status: CommonFilter.ALL,
  createdAt: SortOrder.DESC,
  reportType: CommonFilter.ALL,
};

export let loader: LoaderFunction = async (foo) => {
  const { request } = foo;

  const url = new URL(request.url);
  const searchParams: any = {};
  for (const [key, value] of url.searchParams) {
    searchParams[key] = value;
  }

  const filters: Filters = {
    ...defaultFilters,
    ...searchParams,
  };

  const axios = await axiosLoader({ request });

  return redirectIfNeeded(
    axios.get("/reports/user"),
    request,
    async function (request, response) {
      let userReports: UserReport[] = response.data;
      if (filters.status !== CommonFilter.ALL) {
        userReports = userReports.filter(
          (report) => report.status === filters.status
        );
      }

      if (filters.reportType !== CommonFilter.ALL) {
        userReports = userReports.filter(
          (report) => report.reportType === filters.reportType
        );
      }

      userReports = userReports.sort((reportA, reportB) => {
        if (filters.createdAt === SortOrder.ASC) {
          return reportA.createdAt - reportB.createdAt;
        } else {
          return reportB.createdAt - reportA.createdAt;
        }
      });

      return {
        userReports,
        filters,
      };
    }
  );
};

// https://remix.run/guides/routing#index-routes
export default function UserReports() {
  const transition = useTransition();
  const actionData = useActionData();
  const { userReports, filters } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  // const [showingFilters, setShowingFilters] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!actionData);
  }, [actionData]);

  const setCleanSearchParams = useRef(function (
    newParam: keyof Filters,
    rawFilters: Filters,
    submitSearchParams: Function
  ) {
    return function (change: ChangeEvent) {
      const newFilters: any = {};

      Object.keys(defaultFilters).forEach((key) => {
        const filterKey = key as keyof Filters;
        if (rawFilters[filterKey] !== defaultFilters[filterKey]) {
          newFilters[filterKey] = rawFilters[filterKey];
        }
      });

      const { value } = change.currentTarget as any;

      if (defaultFilters[newParam] !== value) {
        newFilters[newParam] = value;
      } else {
        delete newFilters[newParam];
      }

      submitSearchParams(newFilters);
    };
  }).current;

  return (
    <div>
      <input
        className="filters-toggle hidden"
        type="checkbox"
        name="filters-toggle"
        id="filters-toggle"
      />
      <div className="filters-wrapper bg-primary-300 md:hidden z-10">
        <div className="relative">
          <div className="w-full py-2 px-8">
            <form method="GET">
              <div className="flex w-full flex-wrap">
                <div className="flex flex-col w-1/2 p-2">
                  <label>Status: </label>

                  <Select
                    name="status"
                    className="pr-0"
                    value={filters.status}
                    onChange={setCleanSearchParams(
                      "status",
                      filters,
                      setSearchParams
                    )}
                  >
                    <option value={CommonFilter.ALL}>All</option>
                    <option value={ReportStatus.Reported}>Reported</option>
                    <option value={ReportStatus.Resolved}>Resolved</option>
                  </Select>
                </div>

                <div className="flex flex-col w-1/2 p-2">
                  <label>Created: </label>

                  <Select
                    name="createdAt"
                    className="pr-0"
                    value={filters.createdAt}
                    onChange={setCleanSearchParams(
                      "createdAt",
                      filters,
                      setSearchParams
                    )}
                  >
                    <option value={SortOrder.DESC}>↓ Desc</option>
                    <option value={SortOrder.ASC}>↑ Asc</option>
                  </Select>
                </div>

                <div className="flex flex-col w-1/2 p-2">
                  <label>Type: </label>

                  <Select
                    name="reportType"
                    className="pr-0"
                    value={filters.reportType}
                    onChange={setCleanSearchParams(
                      "reportType",
                      filters,
                      setSearchParams
                    )}
                  >
                    <option value={CommonFilter.ALL}>All</option>
                    {Object.values(ReportType).map((reportType) => (
                      <option value={reportType} key={reportType}>
                        {Case.title(reportType).replace("Image", "📷")}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <noscript className="block text-center p-2">
                <Button
                  className="w-1/2 m-auto "
                  color="primary"
                  variant="solid"
                  type="submit"
                >
                  Update Filters
                </Button>
              </noscript>
            </form>
          </div>
        </div>
      </div>

      <div className="filters-button md:hidden flex flex-row justify-end w-full">
        <div className=" bg-primary-300 z-10">
          <label
            htmlFor="filters-toggle"
            className="flex flex-row items-center px-4 py-2"
          >
            <span className="chevron-up mr-2">▲ </span>
            <span className="chevron-down mr-2">▼ </span>
            Filters
          </label>
        </div>
      </div>
      <AdminPage>
        <PageTitle>User Reports</PageTitle>

        <form className="hidden md:block" method="GET">
          <noscript className="block w-full text-center">
            <h2 className="">
              JS Failed to load. Use the button below to update filters.
            </h2>
            <Button
              className="mx-auto my-6"
              type="submit"
              color="primary"
              variant="solid"
            >
              Update Filters
            </Button>
          </noscript>

          <table className="m-auto">
            <thead className="">
              <tr className="text-left pb-4">
                <th className="table-cell-status pb-4 ">
                  <div className="inline-block relative pr-2">
                    <span className="th-head-label">Status</span>
                    <Select
                      size="xs"
                      name="status"
                      className="w-24 absolute top-0 left-full pr-0"
                      style={{
                        width:
                          filters.status === CommonFilter.ALL
                            ? "3.5rem"
                            : undefined,
                      }}
                      value={filters.status}
                      onChange={setCleanSearchParams(
                        "status",
                        filters,
                        setSearchParams
                      )}
                    >
                      <option value={CommonFilter.ALL}>All</option>
                      <option value={ReportStatus.Reported}>Reported</option>
                      <option value={ReportStatus.Resolved}>Resolved</option>
                    </Select>
                  </div>
                </th>
                <th className="table-cell-created pb-4">
                  <div className="inline-block relative  pr-2">
                    <span className="th-head-label">Created</span>
                    <Select
                      name="createdAt"
                      className="w-12 absolute top-0 left-full pr-0"
                      value={filters.createdAt}
                      size="xs"
                      onChange={setCleanSearchParams(
                        "createdAt",
                        filters,
                        setSearchParams
                      )}
                    >
                      <option value={SortOrder.DESC}>↓</option>
                      <option value={SortOrder.ASC}>↑</option>
                    </Select>
                  </div>
                </th>
                <th className="table-cell-report-type pb-4">
                  <div className="inline-block relative pr-2">
                    <span className="th-head-label">Type</span>
                    <Select
                      name="reportType"
                      className="w-24 absolute top-0 left-full pr-0"
                      value={filters.reportType}
                      size="xs"
                      onChange={setCleanSearchParams(
                        "reportType",
                        filters,
                        setSearchParams
                      )}
                    >
                      <option value={CommonFilter.ALL}>All</option>
                      {Object.values(ReportType).map((reportType) => (
                        <option value={reportType} key={reportType}>
                          {Case.title(reportType).replace("Image", "📷")}
                        </option>
                      ))}
                    </Select>
                  </div>
                </th>
                <th className="table-header-status pb-4 relative">
                  <div className="text-center">
                    <span>User ID</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {userReports.map((userReport: UserReport, index: number) => {
                const TDLink: any = (props: Props<any>) => {
                  return (
                    <Link
                      to={`/admin/reports/${
                        userReport.reportId
                      }?previousRoute=${encodeURIComponent(
                        location.pathname + location.search
                      )}`}
                      {...props}
                      className={`${
                        props.className || ""
                      }  p-2 flex items-center min-h-full`}
                    ></Link>
                  );
                };

                return (
                  <tr
                    key={userReport.reportId}
                    className={`hover-table-row border border-0 border-t-1 border-primary-700 h-8 ${
                      index % 2 === 0 ? "bg-primary-200" : "bg-primary-300"
                    } hover:drop-shadow-lg`}
                  >
                    <td className="table-cell-status">
                      <TDLink className="justify-center">
                        <Tag
                          variant="solid"
                          size="xl"
                          className="cursor-pointer capitalize"
                          color={
                            userReport.status === ReportStatus.Resolved
                              ? "success"
                              : "error"
                          }
                          style={{
                            opacity:
                              userReport.status === ReportStatus.Resolved
                                ? 0.42
                                : 1,
                          }}
                        >
                          {userReport.status}
                        </Tag>
                      </TDLink>
                    </td>
                    <td className="table-cell-created h-8">
                      <TDLink>{dayjs().to(userReport.createdAt)}</TDLink>
                    </td>
                    <td className="table-cell-report-type h-8">
                      <TDLink>
                        <Tag
                          size="xl"
                          color="primary"
                          variant="solid"
                          className="report-type-tag cursor-pointer"
                        >
                          {Case.title(userReport.reportType).replace(
                            "Image",
                            "📷"
                          )}
                        </Tag>
                      </TDLink>
                    </td>
                    <td className="h-8">
                      <TDLink>{userReport.userId}</TDLink>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </form>

        <ol className="md:hidden">
          {userReports.map((userReport: UserReport) => (
            <li
              key={userReport.reportId}
              className="bg-primary-300 w-full my-10"
            >
              <div className="flex flex-row items-stretch bg-primary-400">
                <div className="px-4 py-2 bg-primary-500">
                  {Case.title(userReport.reportType).replace("Image", "📷")}
                </div>

                <div className="flex flex-grow"></div>

                <div className="px-4 py-2">
                  <Tag
                    variant="solid"
                    color={
                      userReport.status == ReportStatus.Resolved
                        ? "success"
                        : "gray"
                    }
                  >
                    {userReport.status}
                  </Tag>
                </div>
              </div>

              <div className="flex flex-col space-y-2 p-4 ">
                <div>Created: {dayjs().to(userReport.createdAt)}</div>

                <div>User: {userReport.userId}</div>
              </div>
            </li>
          ))}
        </ol>

        {!userReports?.length && (
          <div className="text-center p-8">
            <h2 className="text-2xl">No Reports found.</h2>
          </div>
        )}
      </AdminPage>
    </div>
  );
}

function TableHeader() {
  return (
    <th>
      <Link to=""></Link>
    </th>
  );
}
