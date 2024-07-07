import GoogleIcon from "@/components/icons/GoogleIcon";
import { Button, buttonVariants } from "@/components/ui/button";
import { assertAuthenticated, getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { btnStyles } from "@/styles/icons";
import { Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

function SignInPage() {
  return (
    <div className="py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to your account using one of the options below.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href={"/api/login/google"}
            className={cn(
              buttonVariants({
                variant: "secondary",
              }),
              "w-full"
            )}
          >
            <GoogleIcon className="h-5 w-5 mr-2" />
            Sign in with Google
          </Link>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* todo: magic link */}

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Other options
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              variant={"ghost"}
              className={cn(btnStyles, "w-full")}
            >
              <Link href={"/sign-in/email"}>
                <Mail /> Sign in with Email
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
