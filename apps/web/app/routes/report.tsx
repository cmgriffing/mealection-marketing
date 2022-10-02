import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
  useLoaderData,
} from "remix";
import { Form, json, LoaderFunction } from "remix";
import { validator } from "./validate.server";
import { Fragment, useEffect, useState } from "react";
import reportImage from "~/images/scott-graham-OQMZwNd3ThU-unsplash.jpg";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { ReportType } from "grumblr-types";

const API_URL = "http://localhost:3333";
// const API_URL = "https://pod53tprag.execute-api.us-west-2.amazonaws.com";

export let loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const error = url.searchParams.get("error");
  const inviteToken = url.searchParams.get("inviteToken");
  const reporterUserId = url.searchParams.get("reporterUserId");
  const reportType = url.searchParams.get("reportType");
  const teamId = url.searchParams.get("teamId");

  return {
    userId,
    inviteToken,
    reporterUserId,
    reportType,
    teamId,
    error,
  };
};

function promisifiedTimeout(duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done");
    }, duration);
  });
}

function Ellipsis() {
  return (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  const userId = (formData.get("userId") as string) || "";
  const reportType = (formData.get("reportType") as string) || "";
  const inviteToken = (formData.get("inviteToken") as string) || "";
  const reporterUserId = (formData.get("reporterUserId") as string) || "";
  const extraDetails = (formData.get("extraDetails") as string) || "";
  const teamId = (formData.get("teamId") as string) || "";

  if (
    !isValid({
      reportType,
      userId,
      reporterUserId,
      extraDetails,
      inviteToken,
      teamId,
    })
  ) {
    return json(
      {
        message: "Validation error.",
      },
      { status: 400 }
    );
  }

  const reportResponse = await fetch(`${API_URL}/report/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inviterUserId: userId,
      reportType,
      inviteToken,
      reporterUserId,
      teamId,
    }),
  });

  if (reportResponse.status !== 204) {
    // return json(
    //   {
    //     message: "Error reporting.",
    //   },
    //   { status: reportResponse.status }
    // );

    const urlSearchParams = new URLSearchParams({
      userId,
      reportType,
      inviteToken,
      reporterUserId,
      error: "network",
      teamId,
    }).toString();

    return redirect(`/report?${urlSearchParams}`);
  }

  return redirect("/report/thanks");
};

const EXTRA_DETAILS_MAX_LENGTH = 280;

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();

  const { userId, inviteToken, reporterUserId, reportType, error, teamId } =
    useLoaderData();

  const [showError, setShowError] = useState(!!error);
  const [selectedReason, setSelectedReason] = useState(
    reasons.find((reason) => reason.value === reportType) || reasons[0]
  );
  const [extraDetails, setExtraDetails] = useState("");

  useEffect(() => {
    setShowError(!!actionData || !!error);
  }, [actionData]);

  return (
    <div className="remix__page">
      <main>
        <section className="body-font text-gray-600">
          <div className="container mx-auto flex flex-col items-center px-5 py-24 md:flex-row">
            <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
              <img
                className="rounded object-cover object-center"
                alt="hero"
                src={reportImage}
              />
            </div>
            <div className="hero-content flex w-5/6  flex-col items-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:flex-grow lg:pl-24">
              {!userId && (
                <>
                  <h1 className="title-font text-3xl font-medium text-gray-900 sm:text-4xl">
                    No User Found
                  </h1>
                  {false && (
                    <p>
                      The report system requires a user to attach the report to.
                      If you feel that you reached this page due to an error on
                      our part please <a href="/here">submit an issue </a>
                    </p>
                  )}
                </>
              )}
              {userId && (
                <>
                  <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
                    Report
                  </h1>
                  <Form
                    method="post"
                    className="remix__form flex w-full flex-col justify-center md:justify-start"
                  >
                    <fieldset
                      className="mb-4 flex w-full flex-col justify-center  md:justify-start"
                      disabled={transition.state === "submitting"}
                    >
                      <div className="relative mx-auto  w-3/4 lg:w-full xl:w-3/4">
                        <Select
                          htmlId="reportType"
                          htmlLabel="Reason"
                          items={reasons}
                          selectedItem={selectedReason}
                          onSelectChange={(reason) => {
                            setSelectedReason(reason);
                          }}
                        />
                      </div>
                    </fieldset>

                    <fieldset
                      className="mb-4 flex w-full flex-col justify-center md:justify-start"
                      disabled={transition.state === "submitting"}
                    >
                      <div className="relative mx-auto w-3/4 lg:w-full xl:w-3/4">
                        <label
                          htmlFor="hero-field"
                          className="text-sm leading-7 text-gray-600"
                        >
                          Extra Details{" "}
                          <span className="text-gray-400">(optional)</span>
                        </label>
                        <div>
                          <textarea
                            value={extraDetails}
                            className={`h-24 w-full rounded border bg-opacity-50 ${
                              extraDetails.length <= EXTRA_DETAILS_MAX_LENGTH
                                ? "border-gray-300 bg-gray-100 focus:border-green-500 focus:bg-transparent focus:ring-2 focus:ring-green-200"
                                : "border-red-300 bg-red-100 focus:border-red-500 focus:bg-transparent focus:ring-2 focus:ring-red-200"
                            } outline-none py-1 px-3 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out`}
                            onChange={(event) =>
                              setExtraDetails(event.target.value)
                            }
                          />

                          <div
                            className={`items-end justify-end text-right ${
                              extraDetails.length > EXTRA_DETAILS_MAX_LENGTH
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {extraDetails.length} / {EXTRA_DETAILS_MAX_LENGTH}
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <input name="userId" type="hidden" value={userId} />
                    <input
                      name="inviteToken"
                      type="hidden"
                      value={inviteToken}
                    />
                    <input
                      name="reporterUserId"
                      type="hidden"
                      value={reporterUserId}
                    />
                    <input name="teamId" type="hidden" value={teamId} />

                    <fieldset
                      className="mx-auto flex  w-3/4 flex-col justify-center md:justify-start lg:w-full xl:w-3/4"
                      disabled={transition.state === "submitting"}
                    >
                      <button
                        className="submit-button focus:outline-none whitespace-nowrap rounded border-0 bg-green-500 py-2 px-6 text-center text-lg text-white hover:bg-green-600"
                        disabled={
                          transition.state === "submitting" ||
                          !isValid({
                            extraDetails,
                            reportType: selectedReason.value,
                            userId,
                            reporterUserId,
                            inviteToken,
                            teamId,
                          })
                        }
                      >
                        {transition.state !== "submitting" && "Send Report"}
                        {transition.state === "submitting" && <Ellipsis />}
                      </button>
                    </fieldset>
                  </Form>
                  <p className="mx-auto mt-2 w-3/4 text-sm text-red-500 lg:w-full xl:w-3/4">
                    {transition.state === "idle" &&
                      showError &&
                      "There was an error submitting your report. Please try again later. Thanks."}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function isValid({
  extraDetails,
  reportType,
  userId,
  reporterUserId,
  inviteToken,
  teamId,
}: {
  reportType: string;
  userId: string;
  extraDetails?: string;
  reporterUserId?: string;
  teamId?: string;
  inviteToken?: string;
}) {
  if (!reportType) {
    return false;
  }

  if (!userId) {
    return false;
  }

  if (reportType === ReportType.Invite) {
    if (!inviteToken || !teamId || !reporterUserId) {
      return false;
    }
  }

  if ((extraDetails?.length || 0) > EXTRA_DETAILS_MAX_LENGTH) {
    return false;
  }

  return true;
}

const reasons = [
  {
    label: "I don't recognize the person that invited me.",
    value: "invite",
  },
  {
    label: "Inappropriate profile image.",
    value: "profileImage",
  },
  {
    label: "Inappropriate meal image.",
    value: "mealImage",
  },
  {
    label: "Inappropriate meal name.",
    value: "mealName",
  },
  {
    label: "Inappropriate user name.",
    value: "userName",
  },
];

interface SelectItem {
  label: string;
  value: string;
}

function Select({
  htmlId,
  htmlLabel,
  items,
  selectedItem,
  onSelectChange,
}: {
  htmlId: string;
  htmlLabel: string;
  items: SelectItem[];
  selectedItem: SelectItem;
  onSelectChange: (selectedValue: SelectItem) => void;
}) {
  return (
    <div className="w-full">
      <label htmlFor={htmlId} className="text-sm leading-7 text-gray-600">
        {htmlLabel}
      </label>
      <select
        id={htmlId}
        name={htmlId}
        value={selectedItem.value}
        className="form-select block w-full truncate rounded border-gray-300 bg-gray-100 bg-opacity-50 pr-8 text-sm transition focus:border-green-500 focus:bg-transparent focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
        onChange={({ target: { value: newlySelectedItem } }) => {
          onSelectChange(
            items.find((item) => item.value === newlySelectedItem) || items[0]
          );
        }}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
