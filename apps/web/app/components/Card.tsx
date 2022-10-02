import React, { PropsWithChildren } from "react";
import { overlayBackgroundColor } from "../config/colors";

export function Card({ children }: PropsWithChildren<{}>) {
  return (
    <div
      className="mb-8 flex flex-col items-center px-4 py-8 text-center shadow-md md:items-start md:text-left"
      style={{ backgroundColor: overlayBackgroundColor }}
    >
      {children}
    </div>
  );
}
