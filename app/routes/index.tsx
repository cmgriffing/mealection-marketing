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
import heroImage from "~/images/hero.jpg";
import banner1Image from "~/images/banner-1.jpg";
import banner2Image from "~/images/banner-2.jpg";
import banner3Image from "~/images/banner-3.jpg";
import banner4Image from "~/images/banner-4.jpg";
import screenshotIphoneVoteImage from "~/images/screenshot-iphone-vote.png";
import screenshotIphonePollImage from "~/images/screenshot-iphone-poll.png";
import screenshotIphoneResultsImage from "~/images/screenshot-iphone-results.png";
import mealectionLogoImage from "~/images/mealection-logo.png";
import { useEffect, useState } from "react";
import { Ellipsis } from "~/components/Ellipsis";
import { AppStoreButtons } from "~/components/AppStoreButtons";
import { colors } from "../config/colors";
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
          className="body-font mb-24 bg-cover text-gray-600 shadow-md"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="main-header">
            <div className="container mx-auto flex flex-row items-center py-4">
              <img
                className="border-error-500 h-auto max-w-[40px] rounded border-4 border-solid shadow-md"
                src={mealectionLogoImage}
              />
              <h1
                className="title text-primary-300 ml-4 text-3xl"
                style={{
                  textShadow: `2px 2px 0px rgba(235, 98, 0, var(--tw-border-opacity)), -2px 2px 0 rgba(235, 98, 0, var(--tw-border-opacity)), -2px -2px 0px rgba(235, 98, 0, var(--tw-border-opacity)), 2px -2px 0px rgba(235, 98, 0, var(--tw-border-opacity))`,
                  letterSpacing: "1px",
                }}
              >
                Mealection
              </h1>
            </div>
          </div>
          <div className="container mx-auto flex flex-col items-center pt-24 pb-32 md:flex-row md:px-5 lg:py-6">
            <div className="mb-10 flex w-5/6 items-end justify-end md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
              <img
                className="hidden max-h-[600px] w-auto scale-125 md:block"
                style={{ transformOrigin: "top right" }}
                src={screenshotIphoneVoteImage}
              />
            </div>
            <div className="flex flex-col md:w-1/2 lg:flex-grow">
              <div
                className="flex flex-col items-center px-4 py-8 text-center shadow-md md:items-start md:text-left"
                style={{ backgroundColor: overlayBackgroundColor }}
              >
                <h1 className="title-font mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Decide what to eat
                </h1>
                <p className="mb-8 text-lg leading-relaxed">
                  Empower your family or friends with the meal time consensus
                  app of the future. The mobile app allows you to decide what to
                  eat with your whole family getting a voice.
                </p>
                <div className="flex w-full items-end justify-center md:justify-start">
                  <Form
                    method="post"
                    className="remix__form flex w-full items-end justify-center md:justify-start"
                  >
                    <div className="relative mr-4 w-full lg:w-full xl:w-1/2">
                      <fieldset
                        className="w-full"
                        disabled={transition.state === "submitting"}
                      >
                        <label
                          htmlFor="email"
                          className="text-sm leading-7 text-gray-600"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          className="w-full rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200"
                        />
                      </fieldset>
                    </div>
                    <button
                      className="bg-primary-500 hover:bg-primary-600 inline-flex h-[42px] w-[120px] justify-center whitespace-nowrap rounded border-0 py-2 px-6 text-lg text-white focus:outline-none"
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
                  <p className="mt-2 mb-8 w-full text-sm text-red-500">
                    {actionData.message}
                  </p>
                )}
                {!showError && (
                  <p className="mt-2 mb-8 w-full text-sm text-gray-500">
                    Email will be used for news and updates about Mealection
                  </p>
                )}
                {ENABLE_APP_LINKS && <AppStoreButtons />}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container flex flex-row flex-wrap">
            {features.map((feature, index) => (
              <div key={index} className="z-10 w-full p-4 md:w-1/3 md:p-8">
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
            className="z-0 h-80 shadow-md"
            style={{
              transform: "rotate(12deg) scale(1.2)",
              backgroundImage: `url(${banner2Image})`,
              ...firstBannerStyles,
            }}
          ></div>
        </section>

        <section className="container">
          <div className="my-20 flex flex-row flex-wrap">
            <div className="z-10 p-8 md:w-1/2">
              <div
                className="p-4 shadow-md"
                style={{
                  background: overlayBackgroundColor,
                }}
              >
                <h3 className="mb-4 text-xl font-bold">Real-time results</h3>
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
            <div className="z-10 p-8 md:w-1/2">
              <div>
                <img
                  className="hidden max-h-[200px] w-auto scale-[3] md:block"
                  style={{ transformOrigin: "left" }}
                  src={screenshotIphoneResultsImage}
                />
              </div>
            </div>
          </div>
        </section>

        <section className=" mt-0">
          <div
            className="z-0 h-80 bg-cover shadow-md"
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
            <div className="z-10 p-8 md:w-1/2">
              <div
                className="mx-auto w-80 p-4 shadow-md"
                style={{ backgroundColor: overlayBackgroundColor }}
              >
                <h3 className="mb-4 text-xl font-bold">Enterprise ready</h3>
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
          <section className="bg-primary-400 py-6 text-center">
            <h3 className="mb-2 text-2xl font-bold">
              What are you waiting for?
            </h3>
            <AppStoreButtons className="mx-auto" />
          </section>
        )}

        {!ENABLE_APP_LINKS && (
          <section className="bg-primary-400 py-6 text-center">
            <h3 className="text-4xl font-bold">Testimonials</h3>
            <p>(mock placeholders for now)</p>
          </section>
        )}

        <section className="body-font text-gray-600">
          <div className="container mx-auto px-5 py-24">
            <div className="-m-4 flex flex-wrap">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="mb-6 p-8 lg:mb-0 lg:w-1/3">
                  <div
                    className="h-full p-4 text-center shadow-md"
                    style={{ backgroundColor: overlayBackgroundColor }}
                  >
                    <img
                      alt="testimonial"
                      className="mb-8 inline-block h-20 w-20 rounded-full border-2 border-gray-200 bg-gray-100 object-cover object-center"
                      src={testimonial.imageUrl}
                    />
                    <p className="leading-relaxed">{testimonial.content}</p>
                    <span className="bg-primary-500 mt-6 mb-4 inline-block h-1 w-10 rounded"></span>
                    <h2 className="title-font text-sm font-medium tracking-wider text-gray-900">
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
          <section className="bg-primary-400 py-6 text-center md:hidden">
            <h3 className="mb-2 text-2xl font-bold">
              What are you waiting for?
            </h3>
            <AppStoreButtons className="mx-auto" />
          </section>
        )}
      </main>
      <div className="flex h-40 flex-row items-end justify-center">
        &copy; {new Date().getFullYear()} Whirligig Labs LLC
      </div>
    </div>
  );
}
