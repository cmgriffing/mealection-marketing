import { HTTPClientErrorResponses, HTTPServerErrorResponses } from "./http-status";
export interface RouteOptions {
    path: string;
    summary: string;
    description: string;
    tags: string[];
    headers: {
        [key: string]: string;
    };
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    definedErrors: (HTTPClientErrorResponses | HTTPServerErrorResponses)[];
    requestJsonSchemaPath?: string;
    responseJsonSchemaPath: string;
    errorJsonSchemaPath: string | "errorResponseSchema.json";
}
export declare function Route(options: RouteOptions): Function;
//# sourceMappingURL=route.d.ts.map