import Link from "next/link";
import { Logo } from "@/components/navigation/logo";
import { LuArrowUpRight, LuGithub, LuPlus } from "react-icons/lu";

import { ModeToggle } from "@/components/navigation/theme-toggle";
import { SheetLeft } from "@/components/navigation/sidebar";
import Search from "@/components/navigation/search";
import Anchor from "@/components/navigation/anchor";
import { GitHubLink } from "@/settings/navigation";
import { buttonVariants } from "@/components/ui/button";
import EcosystemPicker from "./ecosystem-picker";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b bg-opacity-5 px-2 backdrop-blur-xl backdrop-filter md:px-4">
      <div className="mx-auto flex h-full items-center justify-between p-1 sm:p-3 md:gap-2">
        <div className="flex items-center gap-5">
          <SheetLeft />
          <div className="flex items-center gap-6">
            <div className="hidden md:flex">
              <Logo />
            </div>
            <div className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
              <EcosystemPicker />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search />
          <div className="flex gap-2 sm:ml-0">
            {GitHubLink.href && (
              <Link
                href={GitHubLink.href}
                className={buttonVariants({ variant: "outline", size: "icon" })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View the repository on GitHub"
              >
                <LuGithub className="h-[1.1rem] w-[1.1rem]" />
              </Link>
            )}
            <ModeToggle />
            <Link
              href={"/articles/new/"}
              className={buttonVariants({ variant: "default", size: "sm" })}
              rel="noopener noreferrer"
              aria-label="Create a new article"
            >
              Create
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
