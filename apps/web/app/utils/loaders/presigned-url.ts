import type { DataFunctionArgs } from "~/tsbs/remix";
import { axiosLoader } from "./axios";

export async function presignedUrlLoader(
  loaderContext: DataFunctionArgs,
  key: string
) {
  const { request } = loaderContext;
  const axios = await axiosLoader(loaderContext);

  const presignedUrlResponse = await axios.post(`/admin/image`, {
    imageUrl: key,
  });

  console.log({ key });

  const headResponse = await fetch(presignedUrlResponse.data.presignedHeadUrl, {
    method: "HEAD",
  }).catch((error) => {
    console.log("Error fetching head.", error);
  });

  if (headResponse?.status === 200) {
    return presignedUrlResponse.data.presignedGetUrl;
  }

  // return user;
}
