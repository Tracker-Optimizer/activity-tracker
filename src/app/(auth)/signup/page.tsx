import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions/get-session";
import { SignUpForm } from "@/components/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignUpPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
