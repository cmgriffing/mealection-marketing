import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
  LoaderFunction,
  useLoaderData,
  useSearchParams,
} from "remix";
import { Form, json } from "remix";
import { validator } from "./validate.server";
import heroImage from "~/images/hero.jpg";
import { useEffect, useState } from "react";
import { Ellipsis } from "~/components/Ellipsis";
// import { unauthenticatedAxios } from "~/utils/loaders/axios";
import { unauthenticatedAxiosLoader } from "~/utils/loaders/axios";

export let action: ActionFunction = async (loaderContext) => {
  const { request, params } = loaderContext;
  const { banId } = params;
  const formData = await request.formData();
  const unbanRequestReason = formData.get("unbanRequestReason");
  const unbanRequestToken = formData.get("unbanRequestToken");
  const axios = await unauthenticatedAxiosLoader(request);

  if (typeof unbanRequestReason !== "string" || unbanRequestReason === "") {
    return json(
      {
        message: "Unban request must not be blank.",
      },
      { status: 400 }
    );
  }

  const submissionResult = await axios
    .post(`/bans/${banId}`, {
      unbanRequestReason,
      unbanRequestToken,
    })
    .catch((error) => {
      console.log({ error });
    });

  console.log("submissionResult", submissionResult?.data);

  return redirect("/banned/thanks");
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!actionData);
  }, [actionData]);

  return (
    <div className="remix__page container">
      <main>
        <section className="body-font text-gray-600">
          <div className="container mx-auto flex flex-col items-center px-5 py-24 md:flex-row">
            <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
              <img
                className="rounded object-cover object-center"
                alt="hero"
                src={heroImage}
              />
            </div>
            <div className="hero-content flex flex-col items-center text-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:flex-grow lg:pl-24">
              <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
                Banned
              </h1>
              <p className="mb-8 leading-relaxed">
                Based on the reasoning we provided in th app, can you please
                explain why you think you should be unbanned?
              </p>
              <Form
                method="post"
                className="remix__form flex w-full items-end justify-center md:justify-start"
              >
                <input value={token} name="unbanRequestToken" type="hidden" />
                <fieldset
                  className="flex w-full items-end justify-center md:justify-start"
                  disabled={transition.state === "submitting"}
                >
                  <div className="relative mr-4 w-2/4 lg:w-full xl:w-1/2">
                    <label
                      htmlFor="unban-request-reason"
                      className="sr-only text-sm leading-7 text-gray-600"
                    >
                      Unban reason
                    </label>
                    <textarea
                      id="unban-request-reason"
                      name="unbanRequestReason"
                      placeholder=""
                      className="unban-reason-input outline-none w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out focus:border-green-500 focus:bg-transparent focus:ring-2 focus:ring-green-200"
                      onInput={() => {
                        setShowError(false);
                      }}
                    />
                  </div>
                  <button
                    className="submit-button focus:outline-none inline-flex whitespace-nowrap rounded border-0 bg-green-500 py-2 px-6 text-lg text-white hover:bg-green-600"
                    disabled={transition.state === "submitting"}
                  >
                    {transition.state !== "submitting" && "Submit"}
                    {transition.state === "submitting" && <Ellipsis />}
                  </button>
                </fieldset>
              </Form>
              {showError && (
                <p className="mt-2 mb-8 w-full text-sm text-red-500">
                  {actionData.message}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
