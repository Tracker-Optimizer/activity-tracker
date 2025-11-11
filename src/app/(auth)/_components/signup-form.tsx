"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { ControlledInput } from "@/components/form/controlled-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth/auth-client";
import { type SignUpFormValues, signUpFormSchema } from "@/types/auth";

export function SignUpForm() {
  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = methods.formState;

  const onSubmit = async (data: SignUpFormValues) => {
    const response = await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          console.error(error);
        },
      },
    );

    console.log("response", response);
    console.log("data", data);
  };

  return (
    <FormProvider {...methods}>
      <form id="sign-up-form" onSubmit={methods.handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput<SignUpFormValues>
            name="name"
            label="Full Name"
            placeholder="Full name"
            autoComplete="name"
          />

          <ControlledInput<SignUpFormValues>
            name="email"
            label="Email"
            type="email"
            placeholder="mail@example.com"
            description="We&apos;ll use this to contact you. We will not share your email with anyone else."
            autoComplete="email"
          />

          <ControlledInput<SignUpFormValues>
            name="password"
            label="Password"
            type="password"
            description="Must be at least 8 characters long."
            autoComplete="new-password"
          />

          <ControlledInput<SignUpFormValues>
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            description="Please confirm your password."
            autoComplete="new-password"
          />

          <div className="flex flex-col gap-3">
            <Button disabled={isSubmitting} type="submit">
              Create Account
            </Button>

            <Button disabled={isSubmitting} variant="outline" type="button">
              Sign up with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/signin">Sign in</Link>
            </p>
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
