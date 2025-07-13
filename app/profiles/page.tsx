import RevealHero from "@/components/animations/RevealHero";
import PersonCard from "@/components/PersonCard";
import prisma from "@/prisma/client";
import Link from "next/link";

export default async function ProfilesPage() {
  const profiles = await prisma.user.findMany();

  return (
    <section className="flex flex-col h-full gap-4 max-w-4xl mx-auto p-4 w-full">
      <RevealHero className="mx-auto">
        <span className="text-2xl font-bold">Profiles</span>
      </RevealHero>

      {profiles.length === 0 && (
        <span className="text-muted-foreground mx-auto text-center text-balance">
          No profiles found.
        </span>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Link href={`/profiles/${profile.id}`} key={profile.id}>
            <PersonCard profile={profile} />
          </Link>
        ))}
      </div>
    </section>
  );
}
