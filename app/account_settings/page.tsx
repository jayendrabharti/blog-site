import RevealHero from "@/components/animations/RevealHero";
import { authOptions } from "@/utils/authOptions";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import Reveal from "@/components/animations/Reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UpdateUserName } from "@/components/UpdateUserName";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  return (
    <section className="w-full px-4 max-w-xl mx-auto flex flex-col items-center">
      <RevealHero className="mx-auto mb-6">
        <span className="font-extrabold text-3xl">Account Settings</span>
      </RevealHero>
      <Card>
        <CardContent className="flex flex-col items-center">
          <Reveal type={"scaleOut"}>
            <Avatar className="size-30 ring-2 ring-border">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? "User Avatar"}
              />
              <AvatarFallback>
                {user.name ? user.name.slice(0, 2) : "NA"}
              </AvatarFallback>
            </Avatar>
          </Reveal>
          <Reveal className="font-bold text-lg mt-2 flex items-center gap-2">
            {user.name}
            <UpdateUserName />
          </Reveal>
          <Reveal className="text-muted-foreground">{user.email}</Reveal>
        </CardContent>
      </Card>
    </section>
  );
}
