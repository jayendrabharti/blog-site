import RevealHero from "@/components/animations/RevealHero";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma/client";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AllPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  return (
    <section className="flex flex-col h-full gap-4 max-w-4xl mx-auto p-4 w-full">
      <div className="flex items-center justify-between">
        <RevealHero>
          <span className="text-2xl font-bold">All Posts</span>
        </RevealHero>
        <Link href="/new_post">
          <Button>
            <PlusIcon />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 && (
        <span className="text-muted-foreground mx-auto text-center text-balance">
          Not posts yet. Why not create one?
        </span>
      )}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
