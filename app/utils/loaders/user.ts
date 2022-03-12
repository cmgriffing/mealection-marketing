import { authenticator } from "~/services/auth.server";

export async function userLoader({ request }: any) {
  // If the user is already authenticated redirect to /dashboard directly
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/admin/login",
  });
  console.log("user in user loader", user);

  return user;
}
