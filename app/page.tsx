"use client"
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { PageRoutes } from "@/lib/pageroutes";
import Search from "@/components/navigation/search";
import EcosystemPicker from "@/components/navigation/ecosystem-picker";
import { useContext } from "react";
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";

export default function Home() {
    const { ecosystem } = useContext<EcosystemContextProps>(EcosystemContext);
    return (
        <div className="min-h-[86.5vh] flex flex-col justify-center items-center text-center px-2 py-8">
            <h1 className="text-4xl font-bold mb-4 sm:text-7xl">
                Bitxenia
            </h1>
            <h2 className="text-2xl font-bold mb-4 sm:text-4xl">
                Knowledge Repository
            </h2>
            <EcosystemPicker />
            {ecosystem && <div className="flex items-center gap-5">
                <Search />
                <text className="font-thin">
                    or
                </text>
                <Link
                    href={"/docs/new/"}
                    className={buttonVariants({ variant: "default", size: "sm" })}
                    rel="noopener noreferrer"
                    aria-label="Create a new article"
                >
                    Create
                </Link>

            </div>}
        </div>
    );
}
