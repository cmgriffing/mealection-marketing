import type { Params } from "react-router-dom";

export interface DataFunctionArgs {
  request: Request;
  context: AppLoadContext;
  params: Params;
}

/**
 * An object of arbitrary for route loaders and actions provided by the
 * server's `getLoadContext()` function.
 */
export type AppLoadContext = any;
