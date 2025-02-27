"use client";
import Loading from "@/app/loading";
import { EcosystemContext, StorageContext } from "@/lib/contexts";
import { Patch } from "@/lib/ecosystems/ecosystem";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Pages() {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [error, setError] = useState<boolean>(false);
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);

  const searchParams = useSearchParams();

  const pathName = searchParams.get("name")!;

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await storage!.getArticlePatches(pathName);
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
  }, [pathName, storage]);

  if (error) notFound();

  if (patches.length === 0)
    return (
      <Loading
        title="Loading history..."
        desc={`Fetching ${pathName} edit list from ${esName}`}
      />
    );
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
          .map((patchDate: string) => (
            <li className="py-2" key={patchDate}>
              <Link
                href={{
                  pathname: `/articles`,
                  query: {
                    name: pathName,
                    version: patchDate,
                  },
                }}
              >
                {patchDate}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
