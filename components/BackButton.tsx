"use client";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      className={className}
      variant="ghost"
      size="icon"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon />
    </Button>
  );
}
