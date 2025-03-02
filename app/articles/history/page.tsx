"use client";
import Loading from "@/app/loading";
import { Version } from "@/lib/articles/version";
import { EcosystemContext, StorageContext } from "@/lib/contexts";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Pages() {
  const [patches, setPatches] = useState<Version[]>([]);
  const [error, setError] = useState<boolean>(false);
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);

  const searchParams = useSearchParams();

  const pathName = searchParams.get("name")!;

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await storage!.getArticleVersions(pathName);
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
          .sort((a, b) => {
            return a.date > b.date ? -1 : 1;
          })
          .map((version) => (
            <li className="py-2" key={version.id}>
              <Link
                href={{
                  pathname: `/articles`,
                  query: {
                    name: pathName,
                    version: version.id,
                  },
                }}
              >
                {`${version.date} - ${version.id} / Parent: ${version.parent ? version.parent : "None"}`}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
