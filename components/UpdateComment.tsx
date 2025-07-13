"use client";
import { updateComment } from "@/actions/post.actions";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon, PencilIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

export function UpdateComment({
  commentId,
  content,
}: {
  commentId: string;
  content: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(content || "");
  const [updating, startUpdating] = useTransition();

  const handleSubmit = async () => {
    startUpdating(async () => {
      if (!newContent.trim()) {
        toast.error("Please enter a valid comment.");
        return;
      }
      try {
        const res = await updateComment(commentId, newContent);
        toast.success(res.message);
        setOpen(false);
      } catch {
        toast.error("Failed to update comment. Please try again.");
        return;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Content</Label>
            <Textarea
              id="name-1"
              name="name"
              placeholder="Enter Updated comment"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={!content.trim() || updating}
            onClick={handleSubmit}
          >
            {updating ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <PencilIcon />
            )}
            {updating ? "Updating..." : "Update Name"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
