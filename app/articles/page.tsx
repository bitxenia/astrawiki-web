"use client";
import {
  notFound,
  ReadonlyURLSearchParams,
  useSearchParams,
} from "next/navigation";
import { getRawArticle, parseMarkdown } from "@/lib/markdown";
import { Settings } from "@/lib/meta";

import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import Pagination from "@/components/navigation/pagination";
import Toc from "@/components/navigation/toc";
import Feedback from "@/components/navigation/feedback";
import { BackToTop } from "@/components/navigation/backtotop";
import { Typography } from "@/components/ui/typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import {
  ArticleContext,
  ArticleContextProps,
  EcosystemContext,
  EcosystemContextProps,
  RawArticleContext,
  RawArticleContextProps,
} from "@/lib/contexts";
import { BarLoader } from "react-spinners";
import Loading from "@/app/loading";
import Link from "next/link";

type PageProps = {
  params: { slug: string[] };
};

export default function Pages() {
  const [parsedMarkdown, setParsedMarkdown] = useState<ReactElement<
    any,
    any
  > | null>(null);
  const [error, setError] = useState<boolean>(false);
  const { ecosystem, esName } = useContext<EcosystemContextProps>(
    EcosystemContext,
  ) as { ecosystem: Ecosystem; esName: string };
  const { setArticle } = useContext<ArticleContextProps>(ArticleContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathName = searchParams.get("name")!;

  const articleVersion = searchParams.has("version")
    ? +searchParams.get("version")!
    : undefined;

  useEffect(() => {
    async function fetchDocument() {
      setIsLoading(true);
      try {
        const rawArticle = await getRawArticle(
          pathName,
          ecosystem,
          articleVersion,
        );

        const res = await parseMarkdown(pathName, rawArticle);

        if (!res) {
          setError(true);
        } else {
          setParsedMarkdown(res);
          setArticle(rawArticle);
        }
      } catch (e) {
        console.log(e);
        setError(true);
      }
      setIsLoading(false);
    }
    fetchDocument();
  }, [pathName, ecosystem, setArticle, searchParams]);

  if (error) notFound();
  else if (isLoading)
    return (
      <Loading
        title="Loading article..."
        desc={`Fetching ${pathName} from ${esName}`}
      />
    );

  const updatePath = () => {
    const paths = [pathName];
    if (articleVersion) {
      paths.push(`Version ${articleVersion}`);
    }
    return paths;
  };

  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={updatePath()} />
        {parsedMarkdown && (
          <Typography>
            <h1 className="-mt-2 text-3xl">{pathName}</h1>
            <div>{parsedMarkdown}</div>
            <Pagination pathname={pathName} />
          </Typography>
        )}
        {!parsedMarkdown && (
          <div className="flex min-h-screen items-center justify-center">
            <BarLoader />
          </div>
        )}
      </div>
      {Settings.rightbar && (
        <div className="toc sticky top-16 hidden h-[94.5vh] min-w-[230px] gap-3 py-8 xl:flex xl:flex-col">
          {Settings.toc && <Toc tocs={[]} />}
          {Settings.feedback && <Feedback slug={pathName} title={pathName} />}
          {Settings.totop && (
            <BackToTop className="mt-6 self-start text-sm text-neutral-800 dark:text-neutral-300/85" />
          )}
        </div>
      )}
    </div>
  );
}
