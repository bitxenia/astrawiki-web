"use client";
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import { Ecosystem, Patch } from "@/lib/ecosystems/ecosystem";
import { getDocument, getPatches } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

type PageProps = {
    params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
    const [document, setDocument] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { ecosystem } = useContext<EcosystemContextProps>(EcosystemContext) as { ecosystem: Ecosystem };

    const pathName = slug.join("/");
    useEffect(() => {
        async function fetchDocument() {
            console.log("Fetching")
            setIsLoading(true);
            try {
                const res = await getPatches(pathName, ecosystem);
                if (!res) {
                    setError(true);
                } else {
                    setDocument(res);
                }
            } catch {
                setError(true);
            }
            setIsLoading(false);
        }
        fetchDocument();
    }, [pathName, ecosystem]);


    const patches = document ? document.patches : [];

    if (error) notFound();
    else if (isLoading) {
        return (
            <div>
                <text>
                    Loading...
                </text>
                <BarLoader />
            </div>
        )
    }

    return (
        <div className="flex items-start gap-14">
            <ul>
                {patches
                    .sort((a: Patch, b: Patch) => {
                        if (a.date > b.date) return -1;
                        if (a.date < b.date) return 1;
                        return 0;
                    })
                    .map((p: Patch, i: number) => (
                        <li className="py-2">
                            <Link
                                href={
                                    "/docs/" +
                                    slug.toString() +
                                    "/" +
                                    (patches.length - i).toString()
                                }
                            >
                                {patches.length - i} - {p.date}
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
