"use client";
import Loading from "@/app/loading";
import {
    EcosystemContext,
    EcosystemContextProps,
    RawArticleContext,
    RawArticleContextProps,
} from "@/lib/contexts";
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
    const [patches, setPatches] = useState<Patch[]>([]);
    const [error, setError] = useState<boolean>(false);
    const { ecosystem, esName } = useContext<EcosystemContextProps>(EcosystemContext) as { ecosystem: Ecosystem, esName: string };

    const pathName = slug.join("/");
    useEffect(() => {
        async function fetchDocument() {
            try {
                const res = await getPatches(pathName, ecosystem);
                if (!res) {
                    setError(true);
                } else {
                    setPatches(res);
                }
            } catch {
                setError(true);
            }
        }
        fetchDocument();
    }, [pathName, ecosystem]);

    if (error) notFound();

    if (patches.length === 0) return <Loading title="Loading edit history..." desc={`Fetching ${pathName} edit list from ${esName}`} />

    return (
        <div className="flex items-start gap-14">
            <ul>
                {patches
                    .map((p: Patch) => p.date)
                    .sort((a: string, b: string) => {
                        if (a > b) return -1;
                        if (a < b) return 1;
                        return 0;
                    })
                    .map((d: string, i: number) => (
                        <li className="py-2" key={i}>
                            <Link
                                href={
                                    "/docs/" +
                                    slug.toString() +
                                    "/" +
                                    (patches.length - i).toString()
                                }
                            >
                                {patches.length - i} - {d}
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
