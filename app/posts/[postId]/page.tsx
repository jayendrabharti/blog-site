import PostCard from "@/components/PostCard";
import PostCommentSection from "@/components/PostCommentSection";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
    },
  });

  if (!post) {
    return notFound();
  }

  const session = await getServerSession(authOptions);
  const isAuthor = session?.user?.email === post.authorEmail;

  return (
    <section className="flex flex-col h-full gap-6 max-w-3xl mx-auto p-6 w-full">
      <PostCard post={post} isAuthor={isAuthor} />
      <PostCommentSection postId={post.id} />
    </section>
  );
}
