"use client";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import Search from "@/components/navigation/search";
import EcosystemPicker from "@/components/navigation/ecosystem-picker";
import { useContext } from "react";
import OptimizedSearch from "@/components/navigation/optimized-search";
import { StorageContext } from "@/components/providers/storage-provider";

export default function Home() {
  const { storage } = useContext(StorageContext);
  return (
    <div className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">Bitxenia</h1>
      <h2 className="mb-4 text-2xl font-bold sm:text-4xl">
        Knowledge Repository
      </h2>
      <div className="mb-16">
        <EcosystemPicker />
      </div>
      {storage && (
        <div className="flex items-center gap-5">
          {storage.isSearchOptimized() ? <OptimizedSearch /> : <Search />}
          <span className="font-thin">or</span>
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
