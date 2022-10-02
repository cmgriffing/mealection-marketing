import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { Form, json } from "remix";
import { useEffect, useState } from "react";
import { Button, Input, VechaiProvider } from "@vechaiui/react";
import { authenticator } from "~/services/auth.server";

export let action: ActionFunction = async ({ request }) => {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
  });
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!actionData);
  }, [actionData]);

  return (
    <VechaiProvider>
      <div className="h-full flex flex-col flex-grow items-center justify-center">
        <form
          method="POST"
          onSubmit={() => {
            // submit form
          }}
          className="bg-primary-200 p-8 flex flex-col max-w-2xl rounded"
        >
          <h1 className="text-center">Login</h1>
          <div className="flex flex-col w-full p-8 space-y-4">
            <Input
              className="form-field"
              type="email"
              name="email"
              placeholder="email"
            />
            <Input type="password" name="password" placeholder="password" />
            <Button variant="solid">Login</Button>
          </div>
        </form>
      </div>
    </VechaiProvider>
  );
}
