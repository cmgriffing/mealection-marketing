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
import { AppStoreButtons } from "~/components/AppStoreButtons";
import { useLocation } from "react-router-dom";

const isIos = require("is-ios");

const overlayBackgroundColor = new Color(colors.primary[200])
  .fade(0.05)
  .rgb()
  .string();

function promisifiedTimeout(duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done");
    }, duration);
  });
}

// https://remix.run/guides/routing#index-routes
export default function App() {
  let location = useLocation();
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    setFullUrl(window.location.href);
  }, [location]);

  return (
    <div className="remix__page overflow-hidden">
      <main className="">
        <div
          className="mx-auto mt-40 flex max-w-[440px] flex-col items-center px-8 py-8 text-center shadow-md md:items-start md:text-left"
          style={{ backgroundColor: overlayBackgroundColor }}
        >
          <section>
            <h1 className="mb-8 text-center text-4xl">App Not Installed</h1>
            <h2 className="mb-8 text-xl">
              It seems you don't have the Mealection app installed. Head to your
              platform's app store and get it now:
            </h2>
            <div className="flex flex-col items-center">
              <AppStoreButtons />
            </div>

            <div>
              <p className="my-8">
                Once you have the app installed, you can try this link to open
                the app in the right place:
              </p>
              <div className="text-center">
                <a
                  className="text-center text-xl font-bold underline"
                  href={fullUrl}
                >
                  {fullUrl}
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <div className="flex h-40 flex-row items-end justify-center">
        &copy; {new Date().getFullYear()} Whirligig Labs LLC
      </div>
    </div>
  );
}
