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
import heroImage from "../../images/hero.jpg";
import { useEffect, useState } from "react";
import { authenticator } from "~/services/auth.server";
import { Button, VechaiProvider, extendTheme } from "@vechaiui/react";
import { Icon } from "@iconify/react";
import dashboardFilled from "@iconify/icons-ant-design/dashboard-filled";
import userVoice from "@iconify/icons-bxs/user-voice";
import bugIcon from "@iconify/icons-bxs/bug";
import { userLoader } from "~/utils/loaders/user";
import { colors } from "../../config/colors";
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
  console.log({ userInAdmin: user });
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
        className={`remix__page flex flex-col flex-grow ${
          hasJs ? "has-js" : ""
        }`}
      >
        <div className="h-screen flex flex-col flex-grow overflow-y-hidden">
          <div
            className={`loader-bar h-2 bg-primary-500 ${
              showingLoader ? "loading" : ""
            } ${showingUnloader ? "unloading" : ""}`}
          ></div>
          <div className="header h-12 bg-primary-400 py-2 px-8 flex flex-row items-center justify-start z-10">
            <label
              className="sidebar-menu-button text-2xl mr-4"
              htmlFor="sidebar-menu-toggle"
            >
              ☰
            </label>
            <h2>Mealection</h2>
          </div>
          <div className="main h-full flex flex-row flex-grow bg-black">
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
            <div className="main-sidebar-wrapper lg:block bg-primary-300">
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
            <div className="main-content-wrapper  overflow-x-hidden bg-black relative">
              <label
                className="backdrop block absolute top-0 right-0 bottom-0 left-0 z-20"
                htmlFor="sidebar-menu-toggle"
              ></label>
              <main className="main-content h-full overflow-y-auto w-screen flex flex-col flex-grow bg-primary-200 pb-16">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </VechaiProvider>
  );
}
