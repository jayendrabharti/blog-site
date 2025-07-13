"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { deleteComment } from "@/actions/post.actions";
import { toast } from "sonner";

export default function DeleteCommentButton({
  commentId,
}: {
  commentId: string;
}) {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    deleteComment(commentId)
      .then(() => {
        setDeleting(false);
        toast.success("Comment deleted successfully");
      })
      .catch((error) => {
        setDeleting(false);
        toast.error(error.message || "Failed to delete comment");
      });
  };

  return (
    <Button
      variant={"destructive"}
      size="icon"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : (
        <Trash2Icon />
      )}
    </Button>
  );
}
