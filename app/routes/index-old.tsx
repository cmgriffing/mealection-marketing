import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { Form, json } from "remix";
import { validator } from "./validate.server";
import heroImage from "~/images/hero.jpg";
import { useEffect, useState } from "react";
import { Ellipsis } from "~/components/Ellipsis";

function promisifiedTimeout(duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done");
    }, duration);
  });
}

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let email = formData.get("email");

  await promisifiedTimeout(1000);

  if (typeof email !== "string" || email === "") {
    return json(
      {
        message: "Email must not be blank.",
      },
      { status: 400 }
    );
  }

  const emailValidation = await validator({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: false,
  });

  if (!emailValidation.valid) {
    return json(
      {
        message: "Email does not appear to be valid",
      },
      {
        status: 400,
      }
    );
  }

  // send email to mailchimp or whoever we decided
  const result = await fetch("https://api.sendgrid.com/v3/marketing/contacts", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      list_ids: ["628798d6-4c3f-40f2-8d1e-ddadfad4d4cf"],
      contacts: [
        {
          email,
        },
      ],
    }),
  });

  if (!result.ok) {
    return json(
      {
        message: "Error adding contact to list",
      },
      { status: 500 }
    );
  }

  return redirect("/thanks");
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();

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
                Mealection
              </h1>
              <p className="mb-8 leading-relaxed">
                Get consensus from your friends and family when deciding what to
                eat. When you are deciding what to eat "Whatever" and "I'm not
                picky" are not valid answers. Hold equal and fair elections for
                your meals.
              </p>
              <p className="mb-8 leading-relaxed">
                Sign up below to get notified when the app is ready for testing.
              </p>
              <Form
                method="post"
                className="remix__form flex w-full items-end justify-center md:justify-start"
              >
                <fieldset
                  className="flex w-full items-end justify-center md:justify-start"
                  disabled={transition.state === "submitting"}
                >
                  <div className="relative mr-4 w-2/4 lg:w-full xl:w-1/2">
                    <label
                      htmlFor="hero-field"
                      className="sr-only text-sm leading-7 text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@email.com"
                      className="email-input outline-none w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out focus:border-green-500 focus:bg-transparent focus:ring-2 focus:ring-green-200"
                      onInput={() => {
                        setShowError(false);
                      }}
                    />
                  </div>
                  <button
                    className="submit-button focus:outline-none inline-flex whitespace-nowrap rounded border-0 bg-green-500 py-2 px-6 text-lg text-white hover:bg-green-600"
                    disabled={transition.state === "submitting"}
                  >
                    {transition.state !== "submitting" && "Sign-up"}
                    {transition.state === "submitting" && <Ellipsis />}
                  </button>
                </fieldset>
              </Form>
              {showError && (
                <p className="mt-2 mb-8 w-full text-sm text-red-500">
                  {actionData.message}
                </p>
              )}
              {!showError && (
                <p className="mt-2 mb-8 w-full text-sm text-gray-500">
                  We will never share your email address.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
