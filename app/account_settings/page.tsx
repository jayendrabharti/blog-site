import RevealHero from "@/components/animations/RevealHero";
import AccountDetailssForm from "@/components/AccountDetailsForm";
import { authOptions } from "@/utils/authOptions";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import Reveal from "@/components/animations/Reveal";
import ProfileImage from "@/components/ProfileImage";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  return (
    <section className="w-full px-4 max-w-xl mx-auto">
      <RevealHero className="mx-auto mb-6">
        <span className="font-extrabold text-3xl">Account Settings</span>
      </RevealHero>
      <Reveal type={"scaleOut"}>
        <ProfileImage image={user.image} />
      </Reveal>
      <Reveal>{/* <AccountDetailssForm user={user} /> */}hi</Reveal>
    </section>
  );
}
