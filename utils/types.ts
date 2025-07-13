import { Post, User } from "@prisma/client";

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: User;
  children?: Comment[];
}

export interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
}

export interface ExtendedPost extends Post {
  author: User;
  comments: Comment[];
}
