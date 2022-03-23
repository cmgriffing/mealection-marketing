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
import heroImage from "../../images/hero.jpg";
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
    <div className="container remix__page">
      <main>
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img
                className="object-cover object-center rounded"
                alt="hero"
                src={heroImage}
              />
            </div>
            <div className="hero-content lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                Banned
              </h1>
              <p className="mb-8 leading-relaxed">
                Based on the reasoning we provided in th app, can you please
                explain why you think you should be unbanned?
              </p>
              <Form
                method="post"
                className="remix__form flex w-full md:justify-start justify-center items-end"
              >
                <input value={token} name="unbanRequestToken" type="hidden" />
                <fieldset
                  className="flex w-full md:justify-start justify-center items-end"
                  disabled={transition.state === "submitting"}
                >
                  <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4">
                    <label
                      htmlFor="unban-request-reason"
                      className="leading-7 text-sm text-gray-600 sr-only"
                    >
                      Unban reason
                    </label>
                    <textarea
                      id="unban-request-reason"
                      name="unbanRequestReason"
                      placeholder=""
                      className="unban-reason-input w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:ring-green-200 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      onInput={() => {
                        setShowError(false);
                      }}
                    />
                  </div>
                  <button
                    className="submit-button inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg whitespace-nowrap"
                    disabled={transition.state === "submitting"}
                  >
                    {transition.state !== "submitting" && "Submit"}
                    {transition.state === "submitting" && <Ellipsis />}
                  </button>
                </fieldset>
              </Form>
              {showError && (
                <p className="text-sm mt-2 text-red-500 mb-8 w-full">
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
