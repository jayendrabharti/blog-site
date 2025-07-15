import { User } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProfileCard({ profile }: { profile: User }) {
  return (
    <Card
      key={profile.id}
      className="hover:shadow-lg transition-all hover:scale-105"
    >
      <CardContent className="flex flex-col items-center">
        <Avatar className="size-20 mb-2">
          <AvatarImage
            src={profile.image ?? undefined}
            alt={profile.name ?? "User Avatar"}
            className="rounded-full"
          />
          <AvatarFallback>
            {profile.name ? profile.name.slice(0, 2).toUpperCase() : "NA"}
          </AvatarFallback>
        </Avatar>
        <span className="text-lg font-semibold">{profile.name}</span>
        <span className="text-sm text-muted-foreground">{profile.email}</span>
      </CardContent>
    </Card>
  );
}
