"use client";
import Loading from "@/app/loading";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { EcosystemContext } from "@/components/providers/ecosystem-provider";
import { StorageContext } from "@/components/providers/storage-provider";
import { Typography } from "@/components/ui/typography";
import { VersionInfo } from "@/lib/articles/storage";
import { formatTime } from "@/lib/time";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Pages() {
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);

  const searchParams = useSearchParams();

  const articleName = searchParams.get("name")!;

  useEffect(() => {
    async function fetchDocument() {
      try {
        const allVersions = await storage!.getArticleVersions(articleName);
        setVersions(allVersions);
      } catch {
        setError(true);
      }
    }
    fetchDocument();
  }, [articleName, storage]);

  if (error) notFound();

  if (versions.length === 0)
    return (
      <Loading
        title="Loading history..."
        desc={`Fetching ${articleName} edit list from ${esName}`}
      />
    );
  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={[articleName, "history"]} />
        <Typography>
          <h1 className="-mt-2 text-3xl">{articleName}</h1>
        </Typography>
        <ul className="mb-4 shadow">
          {versions
            .sort((a, b) => {
              return a.date > b.date ? -1 : 1;
            })
            .map((version) => {
              return (
                <li
                  className="border-x border-t px-3 py-3 hover:shadow-lg"
                  key={version.id}
                >
                  <Link
                    href={{
                      pathname: `/articles`,
                      query: {
                        name: articleName,
                        version: version.id,
                      },
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium leading-6">
                        {version.id}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {formatTime(Number(version.date))}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        {version.parent ? `Parent: ${version.parent}` : "Root"}
                      </p>
                      {version.mainBranch && (
                        <p className="font-medium">Main Branch</p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
