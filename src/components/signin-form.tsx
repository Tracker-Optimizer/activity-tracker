"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/form/controlled-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/auth-client";
import { type SignInFormValues, signInFormSchema } from "@/types/auth";

export function SignInForm() {
  const methods = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = methods.formState;

  const onSubmit = async (data: SignInFormValues) => {
    const res = await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          console.error(error);
        },
      },
    );

    console.log("res", res);
    console.log("data", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput<SignInFormValues>
            name="email"
            label="Email"
            type="email"
            placeholder="mail@example.com"
            inputProps={{ required: true }}
          />

          <div className="flex flex-col gap-2 items-center">
            <ControlledInput<SignInFormValues>
              name="password"
              label="Password"
              type="password"
              inputProps={{ required: true }}
            />
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <Button disabled={isSubmitting} type="submit">
              Login
            </Button>

            <Button disabled={isSubmitting} variant="outline" type="button">
              Sign up with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                className="inline-block text-sm underline-offset-4 hover:underline"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
