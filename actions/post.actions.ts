"use server";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";

export async function createPost(data: { title: string; content: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorEmail: session.user.email,
    },
  });

  return post;
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.authorEmail !== session.user.email) {
    throw new Error("Post not found or unauthorized");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { message: "Post deleted successfully" };
}

export async function postComment({
  postId,
  content,
  parentId = null,
}: {
  postId: string;
  content: string;
  parentId?: string | null;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorEmail: session.user.email,
      parentId,
    },
  });

  return comment;
}

export async function getCommentsCount(postId: string) {
  const count = await prisma.comment.count({
    where: { postId },
  });
  return count;
}

export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: true,
    },
  });
  return comments;
}
