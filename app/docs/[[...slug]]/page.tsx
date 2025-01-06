"use client";
import { notFound } from "next/navigation";
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
  RawArticleContext,
  RawArticleContextProps,
} from "@/lib/contexts";
import { BarLoader } from "react-spinners";
import Link from "next/link";

type PageProps = {
  params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
  const [parsedMarkdown, setParsedMarkdown] = useState<ReactElement<
    any,
    any
  > | null>(null);
  const [error, setError] = useState<boolean>(false);
  const ecosystem = useContext<Ecosystem>(EcosystemContext);
  const { setArticle } = useContext<ArticleContextProps>(ArticleContext);
  const { rawArticle, setRawArticle } =
    useContext<RawArticleContextProps>(RawArticleContext);

  const pathName = slug[0];
  let articleVersion: number | null = null;
  if (slug.length > 1) {
    articleVersion = +slug[1];
  }

  useEffect(() => {
    async function fetchDocument() {
      try {
        let res;

        if (!rawArticle) {
          const newRawArticle = await getRawArticle(
            pathName,
            ecosystem,
            articleVersion
          );

          res = await parseMarkdown(pathName, newRawArticle);
        } else {
          res = await parseMarkdown(pathName, rawArticle);
        }
        // const rawArticle = await getRawArticle(
        //   pathName,
        //   ecosystem,
        //   articleVersion
        // );

        // setRawArticle(rawArticle);

        if (!res) {
          setError(true);
        } else {
          setParsedMarkdown(res);
          setArticle(rawArticle);
        }
      } catch {
        setError(true);
      }
    }
    fetchDocument();
  }, [pathName, ecosystem, setArticle, setRawArticle]);

  if (error) notFound();

  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={slug} />
        <div>
          <Link href={"/docs/history/" + slug[0]}>History</Link>
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
      {parsedMarkdown && Settings.rightbar && (
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
