"use client";
import {
  EcosystemContext,
  RawArticleContext,
  RawArticleContextProps,
} from "@/lib/contexts";
import { Ecosystem, Patch } from "@/lib/ecosystems/ecosystem";
import { getDocument, getPatches } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type PageProps = {
  params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [error, setError] = useState<boolean>(false);
  const ecosystem = useContext<Ecosystem>(EcosystemContext);

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

  if (patches.length === 0) {
    return <p> Loading... </p>;
  }

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
