import type { DataFunctionArgs } from "~/tsbs/remix";
import { authenticator } from "~/services/auth.server";
import { authenticatedAxios, unauthenticatedAxios } from "../axios";
import { userLoader } from "./user";

export async function axiosLoader(loaderContext: DataFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  const user = await userLoader(loaderContext);

  console.log("user in axiosLoader", user);

  const axios = authenticatedAxios(
    "http://localhost:3333",
    user?.accessToken || ""
  );

  // axios.interceptors

  return axios;
}

export async function unauthenticatedAxiosLoader(
  loaderContext: DataFunctionArgs
) {
  const axios = unauthenticatedAxios("http://localhost:3333");

  // axios.interceptors

  return axios;
}
