import {
  MetaFunction,
  ActionFunction,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { Form, json } from "remix";
import { useEffect, useState } from "react";
import { PageTitle } from "~/components/admin/PageTitle";

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  // return redirect("/thanks");
};

// https://remix.run/guides/routing#index-routes
export default function BugReports() {
  const transition = useTransition();
  const actionData = useActionData();

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!actionData);
  }, [actionData]);

  return (
    <div className="relative py-4 px-8 z-0">
      <PageTitle>Bug Reports</PageTitle>
    </div>
  );
}
