import { env } from "@/env";
import { AuthenticationError, EmailInUseError } from "@/use-cases/error";
import { createServerActionProcedure } from "zsa";
import { assertAuthenticated } from "./session";

export class ActionError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

const whiteListErrors = [EmailInUseError, AuthenticationError];

function shapeErrors({ err }: any) {
  const isAllowedError = whiteListErrors.some((error) => err instanceof error);

  const isDev = env.NODE_ENV === "development";
  if (isAllowedError || isDev) {
    console.log(err);
    return {
      code: err.code ?? "ERROR",
      message: `${isDev ? "DEV ONLY ENABLED -" : ""}${err.message}`,
    };
  } else {
    return {
      code: "ERROR",
      message: "Something went wrong",
    };
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const user = await assertAuthenticated();
    return { user };
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    return { user: undefined };
  });
