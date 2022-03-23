import type { DataFunctionArgs } from "~/tsbs/remix";
import { authenticator } from "~/services/auth.server";

export async function userLoader({ request }: DataFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/admin/login",
  });

  console.log("user in user loader", user);

  return user;
}
