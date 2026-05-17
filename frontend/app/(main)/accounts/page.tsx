import { getCurrentUserWithProfileAction } from "@/modules/users/actions";
import { getAddressesAction } from "@/modules/checkout/actions";
import { ProfileForm } from "@/modules/users/components/ProfileForm";
import { AddressManager } from "@/modules/checkout/components/AddressManager";
import { Separator } from "@/components/ui/separator";

import { UserWithProfile } from "@/modules/users/types";

export const metadata = {
  title: "Personal Settings",
  description:
    "Update your personal information and manage your saved addresses.",
};

export default async function AccountsPage() {
  const [user, { data: addresses }] = await Promise.all([
    getCurrentUserWithProfileAction() as Promise<UserWithProfile | null>,
    getAddressesAction(),
  ]);

  if (!user) return null;

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section id="personal-info">
        <ProfileForm
          initialData={{
            full_name: user.full_name,
            email: user.email!,
          }}
        />
      </section>

      <Separator className="bg-border" />

      {/* Address Section */}
      <section id="addresses">
        <AddressManager initialAddresses={addresses || []} />
      </section>
    </div>
  );
}
