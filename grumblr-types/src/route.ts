import {
  HTTPClientErrorResponses,
  HTTPServerErrorResponses,
} from "./http-status";

export interface RouteOptions {
  path: string;
  summary: string;
  description: string;
  tags: string[];
  headers: { [key: string]: string };
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  definedErrors: (HTTPClientErrorResponses | HTTPServerErrorResponses)[];
  // Maybe we could combine the schema paths into a common interpolatable variable. (postUser)
  requestJsonSchemaPath?: string;
  responseJsonSchemaPath: string;
  errorJsonSchemaPath: string | "errorResponseSchema.json";
}

// There is probably a better place for this
export function Route(options: RouteOptions): Function {
  return () => {
    return;
  };
}
