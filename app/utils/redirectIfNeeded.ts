import { redirect } from "remix";

export async function redirectIfNeeded(
  axiosRequest: Promise<any>,
  request: Request,
  callback: (request: Request, response: any) => Promise<any>
) {
  try {
    const response = await axiosRequest;
    const callbackResponse = await callback(request, response);
    return callbackResponse;
  } catch (error: any) {
    console.log("HANDLING", error);
    if (!error?.response?.status || error.response.status === 401) {
      console.log("REDIRECTING");
      return redirect("/admin/login");
    }
    return error;
  }
}
