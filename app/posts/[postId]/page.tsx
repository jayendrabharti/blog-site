import BackButton from "@/components/BackButton";
import PostCard from "@/components/PostCard";
import PostCommentSection from "@/components/PostCommentSection";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  return posts.map((post) => ({
    postId: post.id,
  }));
}

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
        },
      },
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <section className="flex flex-col h-full gap-6 max-w-3xl mx-auto p-6 w-full">
      <BackButton />
      <PostCard post={post} open={true} />
      <PostCommentSection post={post} />
    </section>
  );
}
