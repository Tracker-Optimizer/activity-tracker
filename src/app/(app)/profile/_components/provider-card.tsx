"use client";

import { LinkIcon, UnlinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  type SupportedOAuthProvider,
} from "@/lib/auth/oauth-providers";
import type { Account } from "@/types/auth";

export default function ProviderCard({
  provider,
  accounts,
}: {
  provider: SupportedOAuthProvider;
  accounts: Account[];
}) {
  const currentProvider = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider];
  const matchAccount = accounts.find(
    (account) => account.providerId === provider,
  );
  const router = useRouter();

  const handleUnlinkAccount = () => {
    if (!matchAccount) return;

    authClient.unlinkAccount(
      { accountId: matchAccount.accountId, providerId: provider },
      {
        onSuccess: () => {
          console.log("unlinking successful");
          router.refresh();
        },
        onError: (error) => {
          console.error("error unlinking account", error);
        },
      },
    );
  };
  return (
    <Item key={provider} variant="muted" className="border border-border">
      <ItemContent>
        <ItemTitle>
          <currentProvider.Icon className="size-4" />
          {currentProvider.name}
        </ItemTitle>
        <ItemDescription>{currentProvider.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {matchAccount ? (
          <Button onClick={handleUnlinkAccount} variant="destructive">
            <UnlinkIcon className="size-4" /> Disconnect
          </Button>
        ) : (
          <Button
            onClick={() =>
              authClient.linkSocial({ provider, callbackURL: "/profile" })
            }
          >
            <LinkIcon className="size-4" /> Connect
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}
