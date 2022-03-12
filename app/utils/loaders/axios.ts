import { authenticator } from "~/services/auth.server";
import { authenticatedAxios } from "../axios";
import { userLoader } from "./user";

export async function axiosLoader({ request }: any) {
  // If the user is already authenticated redirect to /dashboard directly
  const user = await userLoader({ request });

  console.log("user", user);

  const axios = authenticatedAxios("http://localhost:3333", user.accessToken);

  // axios.interceptors

  return axios;
}
