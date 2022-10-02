import Color from "color";
import React, { PropsWithChildren } from "react";
import { Link } from "remix";
import { colors } from "~/config/colors";

import mealectionLogoImage from "~/images/mealection-logo.png";

interface HeaderProps {
  heroImage: string;
}

export function Header({
  heroImage,
  children,
}: PropsWithChildren<HeaderProps>) {
  return (
    <section
      className="main-header body-font mb-12 bg-cover text-gray-600 shadow-md"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <Link to="/">
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
      </Link>
      <div className="mx-auto flex flex-col items-center md:flex-row">
        <div className="flex flex-col md:w-1/2 lg:flex-grow">{children}</div>
      </div>
    </section>
  );
}
