import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
  Link,
  Outlet,
  LoaderFunction,
  useLoaderData,
  LinksFunction,
} from "remix";
import { Form, json } from "remix";
import heroImage from "~/images/hero.jpg";
import { useEffect, useState } from "react";
import { authenticator } from "~/services/auth.server";
import { Button, VechaiProvider, extendTheme } from "@vechaiui/react";
import { Icon } from "@iconify/react";
import dashboardFilled from "@iconify/icons-ant-design/dashboard-filled";
import userVoice from "@iconify/icons-bxs/user-voice";
import bugIcon from "@iconify/icons-bxs/bug";
import { userLoader } from "~/utils/loaders/user";
import { colors } from "~/config/colors";
// import { authLoader } from "~/utils/auth-loader";
import adminLayoutStyles from "~/styles/admin/layout.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: adminLayoutStyles }];
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  // return redirect("/thanks");
};

export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directly
  const user = await userLoader({ request });

  return user;
};

// https://remix.run/guides/routing#index-routes
export default function Admin({ children }: { children: React.ReactNode }) {
  const transition = useTransition();
  const actionData = useActionData();
  const user = useLoaderData();
  const [hasJs, setHasJs] = useState(false);
  const [showingSidebar, setShowingSidebar] = useState(false);
  const [showingLoader, setShowingLoader] = useState(false);
  const [showingUnloader, setShowingUnloader] = useState(false);

  useEffect(() => {
    setHasJs(true);
  }, []);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!actionData);
  }, [actionData]);

  return (
    <VechaiProvider>
      <div
        className={`remix__page flex flex-grow flex-col ${
          hasJs ? "has-js" : ""
        }`}
      >
        <div className="flex h-screen flex-grow flex-col overflow-y-hidden">
          <div
            className={`loader-bar bg-primary-500 h-2 ${
              showingLoader ? "loading" : ""
            } ${showingUnloader ? "unloading" : ""}`}
          ></div>
          <div className="header bg-primary-400 z-10 flex h-12 flex-row items-center justify-start py-2 px-8">
            <label
              className="sidebar-menu-button mr-4 text-2xl"
              htmlFor="sidebar-menu-toggle"
            >
              ☰
            </label>
            <h2>Mealection</h2>
          </div>
          <div className="main flex h-full flex-grow flex-row bg-black">
            <input
              type="checkbox"
              id="sidebar-menu-toggle"
              name="sidebar-menu-toggle"
              className="sidebar-menu-toggle hidden"
              checked={showingSidebar}
              onChange={() => {
                setShowingSidebar(!showingSidebar);
              }}
            />
            <div className="main-sidebar-wrapper bg-primary-300 lg:block">
              <div className="main-sidebar w-72 py-4 px-8">
                <ul>
                  {[
                    {
                      url: "/admin",
                      label: "Dashboard",
                      icon: dashboardFilled,
                    },
                    {
                      url: "/admin/reports",
                      label: "User Reports",
                      icon: userVoice,
                    },
                    {
                      url: "/admin/bugs",
                      label: "Bug Reports",
                      icon: bugIcon,
                    },
                  ].map((link) => (
                    <li className="my-1 p-2" key={link.url}>
                      <Link
                        to={link.url}
                        className="flex flex-row items-center"
                        onClick={() => {
                          setShowingSidebar(false);
                          setShowingLoader(true);
                          setTimeout(() => {
                            setShowingUnloader(true);
                            setTimeout(() => {
                              setShowingUnloader(false);
                            }, 50);

                            setShowingLoader(false);
                          }, 1500);
                        }}
                      >
                        <span className="mr-2 w-4">
                          <Icon icon={link.icon} />
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="main-content-wrapper  relative overflow-x-hidden bg-black">
              <label
                className="backdrop absolute top-0 right-0 bottom-0 left-0 z-20 block"
                htmlFor="sidebar-menu-toggle"
              ></label>
              <main className="main-content bg-primary-200 flex h-full w-screen flex-grow flex-col overflow-y-auto pb-16">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </VechaiProvider>
  );
}
