import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions/get-session";
import { SignInForm } from "@/components/signin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignInPage() {
  const session = await getCurrentSession();
  console.log("session:", session);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
