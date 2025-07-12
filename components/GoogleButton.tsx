"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";

export default function GoogleButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Button
      variant={"outline"}
      className={cn("cursor-pointer", className)}
      onClick={async () => await signIn("google")}
    >
      <span className="block lg:hidden">Log In</span>
      <span className="hidden lg:block">Log In with Google</span>
      <FcGoogle />
    </Button>
  );
}
