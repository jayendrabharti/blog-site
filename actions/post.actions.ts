"use server";

import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

// posts
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

  revalidatePath(`/`, "layout");

  return post;
}

export async function getPostById(postId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId, authorEmail: session.user.email },
  });

  if (!post) {
    throw new Error("Post not found or unauthorized");
  }

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
    where: { id: postId, authorEmail: session.user.email },
  });

  revalidatePath(`/`, "layout");

  return { message: "Post deleted successfully" };
}

export async function updatePost(
  postId: string,
  newData: { title?: string; content?: string }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id: postId, authorEmail: session.user.email },
    data: newData,
  });

  revalidatePath(`/`, "layout");

  return post;
}

// comments
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

  revalidatePath(`/posts/${postId}`);

  return comment;
}

export async function deleteComment(commentId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });

  if (
    !comment ||
    comment.authorEmail !== session.user.email ||
    comment.post.authorEmail !== session.user.email
  ) {
    throw new Error("Comment not found or unauthorized");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath(`/posts/${comment.postId}`);

  return { message: "Comment deleted successfully" };
}

export async function updateComment(commentId: string, newContent: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        include: {
          author: true,
        },
      },
    },
  });

  if (
    !comment ||
    (comment.post.authorEmail !== session.user.email &&
      comment.authorEmail !== session.user.email)
  ) {
    throw new Error("Comment not found or unauthorized");
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: { content: newContent },
  });

  revalidatePath(`/posts/${comment.postId}`);

  return { message: "Comment updated successfully" };
}
