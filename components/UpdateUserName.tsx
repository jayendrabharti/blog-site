"use client";
import { updateName } from "@/actions/user.actions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon, PencilIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function UpdateUserName() {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [updating, startUpdating] = useTransition();

  const handleSubmit = async () => {
    startUpdating(async () => {
      if (!name.trim()) {
        toast.error("Please enter a valid name.");
        return;
      }
      try {
        const res = await updateName(name);
        toast.success(res.message);
        setOpen(false);
      } catch {
        toast.error("Failed to update name. Please try again.");
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
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              name="name"
              placeholder="Enter new name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={!name.trim() || updating}
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
