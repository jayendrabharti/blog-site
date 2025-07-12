"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <section className="flex flex-col h-full gap-4 max-w-4xl mx-auto p-4 w-full">
      <Link href="/new_post" className="w-max ml-auto">
        <Button>
          <PlusIcon />
          New Post
        </Button>
      </Link>
    </section>
  );
}
