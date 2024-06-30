import { verifyEmailUseCase } from "@/use-cases/users";
import { headers } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sign-in",
        },
      });
    }

    await verifyEmailUseCase(token);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/verify-success",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sign-in",
      },
    });
  }
}
