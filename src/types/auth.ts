import { z } from "zod";
import type { auth } from "@/lib/auth/auth";

export const signInFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const signUpFormSchema = z
  .object({
    ...signInFormSchema.shape,
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInFormValues = z.infer<typeof signInFormSchema>;
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export type Account = Awaited<
  ReturnType<typeof auth.api.listUserAccounts>
>[number];
