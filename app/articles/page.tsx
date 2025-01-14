"use client";
import { notFound, useSearchParams } from "next/navigation";
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
    const { ecosystem, esName } = useContext<EcosystemContextProps>(EcosystemContext) as { ecosystem: Ecosystem, esName: string };
    const { setArticle } = useContext<ArticleContextProps>(ArticleContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const pathName = searchParams.get("name")!;
  const articleVersion = searchParams.has("version")
    ? +searchParams.get("version")!
    : undefined;

  const paths: string[] = [pathName];

  if (articleVersion) {
    paths.push(articleVersion.toString());
  }

  useEffect(() => {
    async function fetchDocument() {
      setIsLoading(true);
      try {
        const rawArticle = await getRawArticle(
          pathName,
          ecosystem,
          articleVersion
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
  }, [pathName, ecosystem, setArticle]);

  if (error) notFound();
  else if (isLoading)
    return (
      <Loading
        title="Loading article..."
        desc={`Fetching ${pathName} from ${esName}`}
      />
    );

  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={paths} />
        <div>
          <Link href={`/articles/history?name=${pathName}`}>History</Link>
        </div>
        {parsedMarkdown && (
          <Typography>
            <h1 className="text-3xl -mt-2">{pathName}</h1>
            <div>{parsedMarkdown}</div>
            <Pagination pathname={pathName} />
          </Typography>
        )}
        {!parsedMarkdown && (
          <div className="flex justify-center items-center min-h-screen">
            <BarLoader />
          </div>
        )}
      </div>
      {Settings.rightbar && (
        <div className="hidden xl:flex xl:flex-col sticky top-16 gap-3 py-8 min-w-[230px] h-[94.5vh] toc">
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
