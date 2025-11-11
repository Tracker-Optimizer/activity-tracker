import { resend } from "./resend";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) {
  await resend.emails.send({
    to,
    subject,
    react,
    from: "login@trackoptimizer.app",
  });
}
