import { UserRole } from "./../utils/types";
// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { User } from "grumblr-types";
import { FormStrategy } from "remix-auth-form";
import axios from "axios";
import jwt_decode from "jwt-decode";

interface AuthenticatedUser extends User {
  accessToken: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<Partial<AuthenticatedUser>>(
  sessionStorage
);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = (form.get("email") as string) || "";
    let password = (form.get("password") as string) || "";

    // let user = await login(email, password);

    const loginResponse = await axios.post(
      `${process.env.API_BASE_URL}/login`,
      { email, password }
    );

    const { accessToken, user } = loginResponse.data as {
      accessToken: string;
      refreshToken: string;
      user: User;
    };
    console.log({ accessToken, user });

    const decodedToken = jwt_decode(accessToken) as any;

    console.log({ decodedToken, user });

    return {
      userId: decodedToken?.sub?.userId || "",
      email,
      role: user.role,
      accessToken,
    };
  }),
  "user-pass"
);
