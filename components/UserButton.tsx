"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { Button } from "./ui/button";
import { Loader2Icon, StickyNoteIcon, UserRoundCogIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import GoogleButton from "./GoogleButton";

interface UserButtonProps {
  className?: string;
}

const UserButton: React.FC<UserButtonProps> = ({ className }) => {
  const { data: session, status } = useSession();

  if (status == "loading")
    return <Loader2Icon className={cn("animate-spin", className)} />;

  if (status == "unauthenticated")
    return <GoogleButton className={className} />;

  const user = session?.user as User;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    : "USER";
  if (user)
    return (
      <div className={cn("flex items-center", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-border border">
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2">
              <span className="block font-medium text-sm text-gray-900 dark:text-gray-100">
                {user?.name}
              </span>
              {user?.email && (
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || user?.email}
                </span>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-2 p-1">
              <Link href="/account_settings" prefetch={true}>
                <Button
                  variant={"outline"}
                  className="mx-auto w-full flex items-center justify-start"
                >
                  <UserRoundCogIcon />
                  Account Settings
                </Button>
              </Link>

              <Link href="/my_posts" prefetch={true}>
                <Button
                  variant={"outline"}
                  className="mx-auto w-full flex items-center justify-start"
                >
                  <StickyNoteIcon />
                  My Posts
                </Button>
              </Link>

              <SignOutButton className="mx-auto w-full flex items-center justify-start text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-600" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
};

export default UserButton;
