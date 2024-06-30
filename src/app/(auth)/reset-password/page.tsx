"use client";

import { LoaderButton } from "@/components/loader-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { pageTitleStyles } from "@/styles/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { changePasswordAction } from "./action";

const registrationSchema = z
  .object({
    password: z.string().min(8),
    token: z.string(),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { execute, isPending, isSuccess, error } =
    useServerAction(changePasswordAction);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      password: "",
      token: searchParams.token,
      passwordConfirmation: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute({
      token: values.token,
      password: values.password,
    });
  }
  return (
    <div className="py-24 mx-auto max-w-[400px] space-y-6">
      {isSuccess && (
        <>
          <h1 className={cn(pageTitleStyles, "text-center")}>
            Forgot Password
          </h1>
          <Alert variant={"success"}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>
              Your password has been successfully updated.
            </AlertDescription>
          </Alert>
        </>
      )}
      {!isSuccess && (
        <>
          <h1 className={cn(pageTitleStyles, "text-center")}>
            Forgot Password
          </h1>

          {error && (
            <Alert variant={"destructive"}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Ups, something went wrong</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your email"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Enter your email"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoaderButton
                isLoading={isPending}
                className="w-full"
                type="submit"
              >
                Sign In
              </LoaderButton>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}

export default ResetPasswordPage;
