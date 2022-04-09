import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { Form, json } from "remix";
import Color from "color";

import { validator } from "./validate.server";
import heroImage from "../../images/hero.jpg";
import banner1Image from "../../images/banner-1.jpg";
import banner2Image from "../../images/banner-2.jpg";
import banner3Image from "../../images/banner-3.jpg";
import banner4Image from "../../images/banner-4.jpg";
import screenshotIphoneVoteImage from "../../images/screenshot-iphone-vote.png";
import screenshotIphonePollImage from "../../images/screenshot-iphone-poll.png";
import screenshotIphoneResultsImage from "../../images/screenshot-iphone-results.png";
import mealectionLogoImage from "../../images/mealection-logo.png";
import { useEffect, useState } from "react";
import { Ellipsis } from "~/components/Ellipsis";
import { colors } from "../../config/colors";
import {
  randCat,
  randCatchPhrase,
  randFirstName,
  randJobTitle,
  randJobType,
  randLastName,
  randPhrase,
} from "@ngneat/falso";
import { useWindowHeight } from "@react-hook/window-size";
import useWindowScroll from "@react-hook/window-scroll";
import { ENABLE_APP_LINKS } from "~/utils/constants";

const isIos = require("is-ios");

const overlayBackgroundColor = new Color(colors.primary[200])
  .fade(0.05)
  .rgb()
  .string();

const testimonials = [
  {
    imageUrl: "https://www.fillmurray.com/301/301`",
    name: `${randFirstName()} ${randLastName()}`,
    content: `I used to spend a half hour a day tracking everyone down and asking what they want to eat. "Note sure", "whatever", and more were the common responses until the food was ready. Now, I give them options, they vote, and I spend less time hearing "hmmmm".`,
    title: "Father, family of 5",
  },
  {
    imageUrl: "https://www.placecage.com/302/302",
    name: `${randFirstName()} ${randLastName()}`,
    content: `I'm a member of a foodie meetup group. We go out every other thursday to a new restaurant. I was sick to death of using group texts to solve the decision making process. The host just adds restaurants and we swipe. Problem solved.`,
    title: "Self professed Foodie",
  },
  {
    imageUrl: "https://www.stevensegallery.com/303/303",
    name: `${randFirstName()} ${randLastName()}`,
    content: `Part of my job is to make sure we have the in-office meals taken care of. A Google Calendar and Google Sheets list were how we used to track ordering and dietary restrictions. Having a curated tool that simplifies the process has allowed me to concentrate on the other parts of my job more.`,
    title: "Office Administrator",
  },
];

const features = [
  {
    title: "Cooking",
    description: `Add your favorite home cooked meals. It's as easy as a name and a photo.`,
  },
  {
    title: "Delivery",
    description: `Search local restaurants or add your own if they aren't searchable.`,
  },
  {
    title: "Dining out",
    description: `Figure out where you and a group decide to take that team lunch.`,
  },
];

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
    validateTypo: false,
    validateDisposable: false,
    validateSMTP: false,
  });

  console.log({ emailValidation });

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

interface ScrollStyles {
  backgroundPositionX?: number;
  transition?: string;
}

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!actionData);
  }, [actionData]);

  const windowHeight = useWindowHeight();
  const scrollPosition = useWindowScroll();

  const firstBannerStyles: ScrollStyles = {};
  const secondBannerStyles: ScrollStyles = {};

  if (!isIos && scrollPosition && windowHeight) {
    firstBannerStyles.backgroundPositionX =
      60 * (scrollPosition / windowHeight);
    firstBannerStyles.transition = "background-position 100ms";

    secondBannerStyles.backgroundPositionX =
      -60 * (scrollPosition / windowHeight) + 200;
    secondBannerStyles.transition = "background-position 100ms";
  }

  return (
    <div className="remix__page overflow-hidden">
      <main className="">
        <section
          className="text-gray-600 body-font bg-cover shadow-md mb-24"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="">
            <div className="container mx-auto flex flex-row items-center py-4">
              <img
                className="max-w-[40px] h-auto rounded shadow-md border-4 border-error-500 border-solid"
                src={mealectionLogoImage}
              />
              <h1
                className="title text-3xl text-primary-300 ml-4"
                style={{
                  textShadow: `2px 2px 0px rgba(235, 98, 0, var(--tw-border-opacity)), -2px 2px 0 rgba(235, 98, 0, var(--tw-border-opacity)), -2px -2px 0px rgba(235, 98, 0, var(--tw-border-opacity)), 2px -2px 0px rgba(235, 98, 0, var(--tw-border-opacity))`,
                  letterSpacing: "1px",
                }}
              >
                Mealection
              </h1>
            </div>
          </div>
          <div className="container mx-auto flex md:px-5 pt-24 pb-32 lg:py-6 md:flex-row flex-col items-center">
            <div className="flex items-end justify-end lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img
                className="hidden md:block w-auto max-h-[600px] scale-125"
                style={{ transformOrigin: "top right" }}
                src={screenshotIphoneVoteImage}
              />
            </div>
            <div className="lg:flex-grow md:w-1/2 flex flex-col">
              <div
                className="flex flex-col md:items-start md:text-left items-center text-center px-4 py-8 shadow-md"
                style={{ backgroundColor: overlayBackgroundColor }}
              >
                <h1 className="title-font sm:text-4xl text-3xl mb-4 text-gray-900 font-bold">
                  Decide what to eat
                </h1>
                <p className="text-lg mb-8 leading-relaxed">
                  Empower your family or friends with the meal time consensus
                  app of the future. The mobile app allows you to decide what to
                  eat with your whole family getting a voice.
                </p>
                <div className="flex w-full md:justify-start justify-center items-end">
                  <Form
                    method="post"
                    className="remix__form flex w-full md:justify-start justify-center items-end"
                  >
                    <div className="relative mr-4 lg:w-full xl:w-1/2 w-full">
                      <fieldset
                        className="w-full"
                        disabled={transition.state === "submitting"}
                      >
                        <label
                          htmlFor="email"
                          className="leading-7 text-sm text-gray-600"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                      </fieldset>
                    </div>
                    <button
                      className="inline-flex whitespace-nowrap text-white bg-primary-500 border-0 py-2 px-6 focus:outline-none hover:bg-primary-600 rounded text-lg h-[42px] justify-center w-[120px]"
                      disabled={transition.state === "submitting"}
                    >
                      {transition.state !== "submitting" && "Sign-up"}
                      {transition.state === "submitting" && (
                        <div className="h-[26px]">
                          <Ellipsis />
                        </div>
                      )}
                    </button>
                  </Form>
                </div>
                {showError && (
                  <p className="text-sm mt-2 text-red-500 mb-8 w-full">
                    {actionData.message}
                  </p>
                )}
                {!showError && (
                  <p className="text-sm mt-2 text-gray-500 mb-8 w-full">
                    Email will be used for news and updates about Mealection
                  </p>
                )}
                {ENABLE_APP_LINKS && <AppStoreButtons />}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-row container flex-wrap">
            {features.map((feature, index) => (
              <div key={index} className="w-full md:w-1/3 p-4 md:p-8 z-10">
                <div
                  className={`p-4 shadow-md ${
                    index === 0
                      ? "md:mt-[0]"
                      : index === 1
                      ? "md:mt-[80px]"
                      : "md:mt-[160px]"
                  }`}
                  key={index}
                  style={{
                    background: overlayBackgroundColor,
                  }}
                >
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className=" mt-0">
          <div
            className="h-80 z-0 shadow-md"
            style={{
              transform: "rotate(12deg) scale(1.2)",
              backgroundImage: `url(${banner2Image})`,
              ...firstBannerStyles,
            }}
          ></div>
        </section>

        <section className="container">
          <div className="flex flex-row my-20 flex-wrap">
            <div className="md:w-1/2 p-8 z-10">
              <div
                className="p-4 shadow-md"
                style={{
                  background: overlayBackgroundColor,
                }}
              >
                <h3 className="text-xl font-bold mb-4">Real-time results</h3>
                <p className="text-lg">
                  Set up a poll and watch the results happen in front of your
                  eyes. The tools you need to make a decision are in the palms
                  of your hands.
                </p>
                <p className="mt-4 text-lg">
                  Tired of hearing them say they{" "}
                  <span className="font-bold">don't care</span> what they eat
                  only to have them change their mind 5 minutes later?
                  Mealection to the rescue.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-8 z-10">
              <div>
                <img
                  className="hidden md:block w-auto max-h-[200px] scale-[3]"
                  style={{ transformOrigin: "left" }}
                  src={screenshotIphoneResultsImage}
                />
              </div>
            </div>
          </div>
        </section>

        <section className=" mt-0">
          <div
            className="h-80 z-0 shadow-md bg-cover"
            style={{
              transform: "rotate(-12deg) scale(1.2)",
              backgroundImage: `url(${banner4Image})`,
              ...secondBannerStyles,
            }}
          ></div>
        </section>

        <section className="container">
          <div className="flex flex-row flex-wrap">
            <div className="md:w-1/2"></div>
            <div className="md:w-1/2 p-8 z-10">
              <div
                className="p-4 w-80 shadow-md mx-auto"
                style={{ backgroundColor: overlayBackgroundColor }}
              >
                <h3 className="text-xl font-bold mb-4">Enterprise ready</h3>
                <p className="text-lg">
                  Organize your meal schedule on a per team basis. Everybody
                  wins. Plan it ahead and reduce the costs of teams going out to
                  eat when they could be more productive at the office.
                </p>
              </div>
            </div>
          </div>
        </section>

        {ENABLE_APP_LINKS && (
          <section className="py-6 bg-primary-400 text-center">
            <h3 className="text-2xl font-bold mb-2">
              What are you waiting for?
            </h3>
            <AppStoreButtons className="mx-auto" />
          </section>
        )}

        {!ENABLE_APP_LINKS && (
          <section className="py-6 bg-primary-400 text-center">
            <h3 className="text-4xl font-bold">Testimonials</h3>
            <p>(mock placeholders for now)</p>
          </section>
        )}

        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-wrap -m-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="lg:w-1/3 lg:mb-0 mb-6 p-8">
                  <div
                    className="h-full text-center p-4 shadow-md"
                    style={{ backgroundColor: overlayBackgroundColor }}
                  >
                    <img
                      alt="testimonial"
                      className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100"
                      src={testimonial.imageUrl}
                    />
                    <p className="leading-relaxed">{testimonial.content}</p>
                    <span className="inline-block h-1 w-10 rounded bg-primary-500 mt-6 mb-4"></span>
                    <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm">
                      {testimonial.name}
                    </h2>
                    <p className="text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {ENABLE_APP_LINKS && (
          <section className="md:hidden py-6 bg-primary-400 text-center">
            <h3 className="text-2xl font-bold mb-2">
              What are you waiting for?
            </h3>
            <AppStoreButtons className="mx-auto" />
          </section>
        )}
      </main>
      <div className="h-40 flex flex-row justify-center items-end">
        &copy; {new Date().getFullYear()} Whirligig Labs LLC
      </div>
    </div>
  );
}

function AppStoreButtons(props: any) {
  return (
    <div className="flex flex-row" {...props}>
      <button className="bg-gray-100 inline-flex py-2 lg:py-3 px-3 lg:px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-6 h-6"
          viewBox="0 0 512 512"
        >
          <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
        </svg>
        <span className="ml-4 flex items-start flex-col leading-none">
          <span className="text-xs text-gray-600 mb-1">GET IT ON</span>
          <span className="title-font font-medium">Google Play</span>
        </span>
      </button>
      <button className="bg-gray-100 inline-flex py-2 lg:py-3 px-3 lg:px-5 rounded-lg items-center lg:ml-4 ml-4 mt-0 lg:mt-0 hover:bg-gray-200 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-6 h-6"
          viewBox="0 0 305 305"
        >
          <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
          <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
        </svg>
        <span className="ml-4 flex items-start flex-col leading-none">
          <span className="text-xs text-gray-600 mb-1">Download on the</span>
          <span className="title-font font-medium">App Store</span>
        </span>
      </button>
    </div>
  );
}
