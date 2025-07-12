"use client";

import { cn } from "@/lib/utils";
import { anurati } from "@/utils/fonts";
import {
  CalendarCheck2Icon,
  HomeIcon,
  InfoIcon,
  Menu,
  ScrollTextIcon,
  UsersIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import { useState } from "react";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import Reveal from "./animations/Reveal";

export const NavBarLinks = [{ name: "Home", href: "/", icon: HomeIcon }];

export default function NavBar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className={cn(
        `w-full space-x-2`,
        `border-b shadow-md border-border`,
        `sticky top-0 left-0 z-50`,
        `py-4 flex flex-row items-center`,
        `transition-all duration-200 bg-background`
      )}
    >
      <Reveal
        className={cn(
          "flex items-center justify-between",
          "mx-auto px-5 md:px-10",
          "w-full max-w-4xl space-x-3"
        )}
      >
        <Link
          href="/"
          prefetch={true}
          className={cn(anurati.className, "text-2xl font-bold cursor-pointer")}
        >
          EVENTZ
        </Link>

        <div
          className={cn(
            `flex flex-col md:flex-row`,
            `items-start md:items-center justify-end`,
            `gap-3 md:gap-1.5`,
            `top-full w-full left-0`,
            "py-4 px-5 md:p-0",
            "absolute md:static",
            "transition-all duration-200",
            "shadow-md md:shadow-none",
            expanded
              ? "scale-y-100 translate-y-0"
              : "-translate-y-1/2 scale-y-0 md:scale-y-100 md:translate-y-0",
            expanded && "bg-background",
            `border-b-2 md:border-0 border-border`
          )}
        >
          {NavBarLinks.map((link, index) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={index}
                prefetch={true}
                href={link.href}
                onClick={() => setExpanded(false)}
                className={cn(
                  "flex flex-row items-center",
                  "px-5 md:px-2.5 py-2 md:py-1 rounded-full font-bold",
                  active && "bg-primary text-background",
                  !active &&
                    "hover:bg-accent text-muted-foreground hover:text-primary",
                  "active:ring-4 ring-muted-foreground",
                  "transition-all duration-300",
                  "w-full md:w-max"
                )}
              >
                <link.icon className="size-4 mr-1.5" />
                {link.name}
              </Link>
            );
          })}

          {/* <ThemeSwitch className={"ml-auto md:ml-0"} /> */}
        </div>

        <ThemeSwitch className={"ml-auto md:ml-0"} />
        <UserButton />
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={(e) => {
            setExpanded((prev) => !prev);
            e.stopPropagation();
          }}
          className={cn("flex md:hidden relative")}
        >
          <X
            className={cn(
              "absolute transition-all duration-200",
              expanded ? "scale-150 rotate-180" : "scale-0 rotate-0"
            )}
          />

          <Menu
            className={cn(
              "absolute transition-all duration-200",
              expanded ? "scale-0 rotate-180" : "scale-150 rotate-0"
            )}
          />
        </Button>
      </Reveal>
    </nav>
  );
}
