import { Button, Container, Text } from "@react-email/components";
import type { User } from "better-auth";

export const VerifyEmailTemplate = ({
  user,
  url,
}: {
  user: User;
  url: string;
}) => {
  return (
    <Container>
      <h1>Verify your email</h1>

      <Text>
        Hi {user.name}, please verify your email by clicking the link below:
      </Text>

      <Button href={url}>Verify email</Button>
    </Container>
  );
};
