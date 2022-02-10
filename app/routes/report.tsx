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
import reportImage from "../../images/scott-graham-OQMZwNd3ThU-unsplash.jpg";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export enum ReportType {
  Invite = "invite",
  ProfileImage = "profileImage",
  MealImage = "mealImage",
  PollName = "pollName",
}

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

  console.log("loading", {
    userId,
    inviteToken,
    reporterUserId,
    reportType,
    teamId,
    error,
  });

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

  console.log("response status", reportResponse.status);

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

    console.log("url: ", `/report?${urlSearchParams}`);

    return redirect(`/report?${urlSearchParams}`);
  }

  console.log("Success!!");

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
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img
                className="object-cover object-center rounded"
                alt="hero"
                src={reportImage}
              />
            </div>
            <div className="hero-content lg:flex-grow md:w-1/2  w-5/6 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center">
              {!userId && (
                <>
                  <h1 className="title-font sm:text-4xl text-3xl font-medium text-gray-900">
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
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                    Report
                  </h1>
                  <Form
                    method="post"
                    className="remix__form flex flex-col w-full md:justify-start justify-center"
                  >
                    <fieldset
                      className="flex flex-col w-full md:justify-start justify-center  mb-4"
                      disabled={transition.state === "submitting"}
                    >
                      <div className="relative lg:w-full  xl:w-3/4 w-3/4 mx-auto">
                        <Select
                          htmlId="reportType"
                          htmlLabel="Reason"
                          items={reasons}
                          selectedItem={selectedReason}
                          onSelectChange={(reason) => {
                            console.log({ reason });
                            setSelectedReason(reason);
                          }}
                        />
                      </div>
                    </fieldset>

                    <fieldset
                      className="flex flex-col w-full md:justify-start justify-center mb-4"
                      disabled={transition.state === "submitting"}
                    >
                      <div className="relative lg:w-full xl:w-3/4 w-3/4 mx-auto">
                        <label
                          htmlFor="hero-field"
                          className="leading-7 text-sm text-gray-600"
                        >
                          Extra Details{" "}
                          <span className="text-gray-400">(optional)</span>
                        </label>
                        <div>
                          <textarea
                            value={extraDetails}
                            className={`h-24 w-full bg-opacity-50 rounded border ${
                              extraDetails.length <= EXTRA_DETAILS_MAX_LENGTH
                                ? "bg-gray-100 border-gray-300 focus:ring-2 focus:ring-green-200 focus:bg-transparent focus:border-green-500"
                                : "bg-red-100 border-red-300 focus:ring-2 focus:ring-red-200 focus:bg-transparent focus:border-red-500"
                            } text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                            onChange={(event) =>
                              setExtraDetails(event.target.value)
                            }
                          />

                          <div
                            className={`text-right items-end justify-end ${
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
                      className="flex flex-col  lg:w-full xl:w-3/4 w-3/4 md:justify-start justify-center mx-auto"
                      disabled={transition.state === "submitting"}
                    >
                      <button
                        className="submit-button text-center text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg whitespace-nowrap"
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
                  <p className="text-sm mt-2 text-red-500 lg:w-full xl:w-3/4 w-3/4 mx-auto">
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
  console.log(isValid, {
    extraDetails,
    reportType,
    userId,
    reporterUserId,
    inviteToken,
    teamId,
  });

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
      <label htmlFor={htmlId} className="leading-7 text-sm text-gray-600">
        {htmlLabel}
      </label>
      <select
        id={htmlId}
        name={htmlId}
        value={selectedItem.value}
        className="form-select block w-full pr-8 text-sm truncate transition rounded bg-opacity-50 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-green-200 focus:bg-transparent focus:border-green-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
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
