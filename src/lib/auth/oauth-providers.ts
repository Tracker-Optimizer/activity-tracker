import type { ComponentProps, ElementType } from "react";
import { DiscordIcon, GitHubIcon, GoogleIcon } from "@/components/ui/icons";

export const SUPPORTED_OAUTH_PROVIDERS = [
  "github",
  "discord",
  "google",
] as const;

export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  {
    name: string;
    description: string;
    Icon: ElementType<ComponentProps<"svg">>;
  }
> = {
  discord: {
    name: "Discord",
    description: "Used to track your message activity.",
    Icon: DiscordIcon,
  },
  github: {
    name: "GitHub",
    description: "Used to track your coding activity.",
    Icon: GitHubIcon,
  },
  google: {
    name: "Google",
    description:
      "Used to track your appointments and help you manage your time.",
    Icon: GoogleIcon,
  },
};
