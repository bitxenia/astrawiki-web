import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { PageRoutes } from "@/lib/pageroutes";
import Search from "@/components/navigation/search";

export default function Home() {
  return (
    <div className="min-h-[86.5vh] flex flex-col justify-center items-center text-center px-2 py-8">
      <h1 className="text-4xl font-bold mb-4 sm:text-7xl">
        Bitxenia
      </h1>
      <h2 className="text-2xl font-bold mb-4 sm:text-4xl">
        Knowledge Repository
      </h2>
      <div className="flex items-center gap-5">
        <Search />
      </div>
    </div>
  );
}
