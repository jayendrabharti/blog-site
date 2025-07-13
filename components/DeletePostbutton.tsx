"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { deletePost } from "@/actions/post.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [deleting, startDeleting] = useTransition();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    startDeleting(async () => {
      e.preventDefault();
      e.stopPropagation();
      deletePost(postId)
        .then(() => {
          toast.success("Post deleted successfully");
          router.push("/posts");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete post");
        });
    });
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant={"destructive"} size="icon" disabled={deleting}>
            {deleting ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <Trash2Icon />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deleting Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleDelete}>
              {deleting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <Trash2Icon />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
