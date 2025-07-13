"use client";
import { Post } from "@prisma/client";
import { Button } from "./ui/button";
import { ExternalLink, PencilIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { User } from "@prisma/client";
import { formatDistance as timeFormatDistance } from "date-fns";
import DeletePostButton from "./DeletePostbutton";
import { Card, CardContent, CardFooter } from "./ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import Reveal from "./animations/Reveal";
import React from "react";
import Markdown from "@/utils/markdown";

type ExtendedPost = Post & { author: User };

export default function PostCard({
  post,
  open = false,
}: {
  post: ExtendedPost;
  open?: boolean;
}) {
  const { data: session } = useSession();
  const isAuthor =
    session && session.user && post.author.email === session?.user.email;

  return (
    <Reveal>
      <Card>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <span className="text-3xl font-bold text-foreground">
              {post.title}
            </span>

            <div className="flex items-center space-x-2 ml-auto">
              {!open && (
                <Link href={`/posts/${post.id}`}>
                  <Button>
                    View Post <ExternalLink />
                  </Button>
                </Link>
              )}
              {isAuthor && (
                <>
                  <Link href={`/posts/${post.id}/update`}>
                    <Button variant="outline" size="icon">
                      <PencilIcon />
                    </Button>
                  </Link>
                  <DeletePostButton postId={post.id} />
                </>
              )}
            </div>
          </div>
          <div
            className={cn(
              "text-muted-foreground prose prose prose-invert dark:prose-invert"
            )}
          >
            <Markdown content={post.content} />
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href={`/profiles/${post.author.id}`}
            className={cn(
              "group flex items-center gap-3 ml-auto  p-2 pr-4",
              "hover:bg-secondary hover:ring-2 ring-muted-foreground",
              `rounded-full transition-all duration-150`
            )}
          >
            <Avatar className="size-12">
              <AvatarImage
                src={post.author.image ?? undefined}
                alt="user avatar"
              />
              <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-muted-foreground font-medium">
                {post.author.name || "Unknown"}
                {isAuthor && (
                  <Badge className="ml-2" variant="secondary">
                    You
                  </Badge>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                Posted{" "}
                {timeFormatDistance(new Date(post.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <ExternalLink className="size-0 group-hover:size-8 transition-all duration-150" />
          </Link>
        </CardFooter>
      </Card>
    </Reveal>
  );
}
