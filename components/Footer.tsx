import { AtSign, PhoneIcon } from "lucide-react";
import {
  HomeIcon,
  InfoIcon,
  PencilRulerIcon,
  ScrollTextIcon,
} from "lucide-react";
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsTwitterX,
} from "react-icons/bs";
import { anurati } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const QuickLinksList = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "About", href: "/aboutme", icon: InfoIcon },
  { name: "Projects", href: "/projects", icon: PencilRulerIcon },
  { name: "Blogs", href: "/blogs", icon: ScrollTextIcon },
  { name: "Contact Me", href: "/contact", icon: PhoneIcon },
];

const SocialsLinkList = [
  { name: "Mail", href: "mailto:jay.bharti2804@gmail.com", icon: AtSign },
  {
    name: "Instagram",
    href: "https://www.instagram.com/jayendra.bharti",
    icon: BsInstagram,
  },
  {
    name: "X.com / Twitter",
    href: "https://x.com/Jayendra_Bharti",
    icon: BsTwitterX,
  },
  { name: "Facebook", href: "", icon: BsFacebook },
];

const TechSitesLinkList = [
  { name: "Github", href: "https://github.com/jayendrabharti", icon: BsGithub },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/jayendrabharti/",
    icon: BsLinkedin,
  },
];

export default async function Footer() {
  return (
    <footer className="p-4  sm:p-6">
      <div className="mx-auto max-w-4xl p-10 border-t-2 border-zinc-300 dark:border-zinc-700">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className={cn(`flex items-center text-6xl`, anurati.className)}
            >
              EVENTZ
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              {/* <h2 className="mb-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase">Reach us</h2> */}
              <ul className="text-zinc-700 dark:text-zinc-400">
                {QuickLinksList.map((link, index) => (
                  <li
                    key={index}
                    className="mb-2 hover:underline hover:text-black hover:dark:text-white"
                  >
                    <Link
                      href={link.href}
                      className="flex flex-row items-center gap-2 hover:text-primary duration-300 transition-all font-bold w-max"
                    >
                      <link.icon size={20} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* <h2 className="mb-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase">Reach us</h2> */}
              <ul className="text-zinc-700 dark:text-zinc-400">
                {SocialsLinkList.map((link, index) => (
                  <li
                    key={index}
                    className="mb-2 hover:underline hover:text-black hover:dark:text-white"
                  >
                    <Link
                      href={link.href}
                      className="flex flex-row items-center gap-2 hover:text-primary duration-300 transition-all font-bold w-max"
                      target="_blank"
                    >
                      <link.icon size={20} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* <h2 className="mb-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase">Reach us</h2> */}
              <ul className="text-zinc-700 dark:text-zinc-400">
                {TechSitesLinkList.map((link, index) => (
                  <li
                    key={index}
                    className="mb-2 hover:underline hover:text-black hover:dark:text-white"
                  >
                    <Link
                      href={link.href}
                      className="flex flex-row items-center gap-2 hover:text-primary duration-300 transition-all font-bold w-max"
                      target="_blank"
                    >
                      <link.icon size={20} />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />
      </div>
    </footer>
  );
}
