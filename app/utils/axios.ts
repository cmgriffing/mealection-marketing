import Axios from "axios";
import { redirect } from "remix";

export function unauthenticatedAxios(baseURL: string) {
  const axios = Axios.create({
    baseURL,
  });

  return axios;
}

// only to be called from loader functions
export function authenticatedAxios(baseURL: string, token: string) {
  const instance = Axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
}
