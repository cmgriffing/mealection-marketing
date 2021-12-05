import { MetaFunction, ActionFunction, redirect } from "remix";
import { Form, json } from "remix";
import { validator } from "./validate.server";
import heroImage from "../../images/hero.jpg";

export let meta: MetaFunction = () => {
  return {
    title: "Mealection",
    description:
      "Stop wasting time figuring out what to eat by feeling like a census taker and automate that process.",
  };
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let email = formData.get("email");

  if (typeof email !== "string" || email === "") {
    return json("Email must not be blank.", { status: 400 });
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
    return json("Email does not appear to be valid", {
      status: 400,
    });
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
    return json("Error adding contact to list", { status: 500 });
  }

  return redirect("/thanks");
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div className="remix__page">
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
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                Mealection
              </h1>
              <p className="mb-8 leading-relaxed">
                Get consensus from your friends and family when deciding what to
                eat. When you are deciding what to eat "Whatever", and "I'm not
                picky" are not valid answers. Hold equal and fair elections for
                your meals.
              </p>
              <p className="mb-8 leading-relaxed">
                Sign up below to get notified when the app is ready for testing.
              </p>
              <Form
                method="post"
                className="remix__form flex w-full md:justify-start justify-center items-end"
              >
                <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4">
                  <label
                    htmlFor="hero-field"
                    className="leading-7 text-sm text-gray-600 sr-only"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@email.com"
                    className="email-input w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:ring-green-200 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <button className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg whitespace-nowrap">
                  Sign-up
                </button>
              </Form>
              <p className="text-sm mt-2 text-gray-500 mb-8 w-full">
                We will never share your email address.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
