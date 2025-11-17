import { SUPPORTED_OAUTH_PROVIDERS } from "@/lib/auth/oauth-providers";
import type { Account } from "@/types/auth";
import ProviderCard from "./provider-card";

export default function AccountLinking({ accounts }: { accounts: Account[] }) {
  return (
    <section>
      <h2>This is the list of the accounts you've linked or you could link</h2>

      <div className="flex flex-col gap-4 my-4">
        {SUPPORTED_OAUTH_PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider}
            provider={provider}
            accounts={accounts}
          />
        ))}
      </div>
    </section>
  );
}
