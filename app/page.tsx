"use client";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { PageRoutes } from "@/lib/pageroutes";
import Search from "@/components/navigation/search";
import EcosystemPicker from "@/components/navigation/ecosystem-picker";
import { useContext } from "react";
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import OptimizedSearch from "@/components/navigation/optimized-search";

export default function Home() {
  const { ecosystem } = useContext<EcosystemContextProps>(EcosystemContext);
  return (
    <div className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">Bitxenia</h1>
      <h2 className="mb-4 text-2xl font-bold sm:text-4xl">
        Knowledge Repository
      </h2>
      <div className="mb-16">
        <EcosystemPicker />
      </div>
      {ecosystem && (
        <div className="flex items-center gap-5">
          {ecosystem.optIn?.optimizedSearch ? <OptimizedSearch /> : <Search />}
          <text className="font-thin">or</text>
          <Link
            href={"/articles/new/"}
            className={buttonVariants({ variant: "default", size: "sm" })}
            rel="noopener noreferrer"
            aria-label="Create a new article"
          >
            Create
          </Link>
        </div>
      )}
    </div>
  );
}
