import { Post } from "@prisma/client";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { User } from "@prisma/client";

type ExtendedPost = Post & { author: User };

export default async function PostCard({
  post,
  isAuthor,
}: {
  post: ExtendedPost;
  isAuthor: boolean;
}) {
  return (
    <div className=" flex flex-col gap-2 border border-border rounded-lg p-6 bg-background shadow-md">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
        {isAuthor && (
          <Button variant="outline" size="icon">
            <PencilIcon />
          </Button>
        )}
      </div>
      <div className="text-muted-foreground text-lg whitespace-pre-line">
        {post.content}
      </div>
      <Separator />
      <div className="flex items-center gap-3 ml-auto">
        {post.author.image && (
          <Image
            src={post.author.image}
            width={200}
            height={200}
            alt={post.author.name || "Author"}
            className="size-12 rounded-full object-cover border"
          />
        )}
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
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
