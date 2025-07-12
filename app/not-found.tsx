import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BanIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react";

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-5">
      <BanIcon className="size-20 font-bold" />
      <span className="font-extrabold text-4xl">Not found</span>
      <span>This page does not exist.</span>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant={"outline"} className="active:scale-90">
          <HomeIcon className="size-4" />
          <Link href={"/"} prefetch={true}>
            Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
