"use client";
import { EcosystemContext } from "@/lib/contexts";
import { Ecosystem, Patch } from "@/lib/ecosystems/ecosystem";
import { getDocument, getPatches } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type PageProps = {
  params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
  const [document, setDocument] = useState<any>(null);
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
          setDocument(res);
        }
      } catch {
        setError(true);
      }
    }
    fetchDocument();
  }, [pathName, ecosystem]);

  if (error) notFound();

  if (!document) {
    return <p> Loading... </p>;
  }

  const { patches } = document;

  return (
    <div className="flex items-start gap-14">
      <ul>
        {patches.map((p: Patch) => (
          <li>
            <Link href={"/docs/" + slug.toString() + "/" + p.date}>{p.date}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
