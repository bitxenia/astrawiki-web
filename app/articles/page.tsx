"use client";
import { notFound, useSearchParams } from "next/navigation";
import { getArticle } from "@/lib/articles";
import { Settings } from "@/lib/meta";

import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import Toc from "@/components/navigation/toc";
import Feedback from "@/components/navigation/feedback";
import { BackToTop } from "@/components/navigation/backtotop";
import { Typography } from "@/components/ui/typography";
import { useContext, useEffect, useState } from "react";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import {
  ArticleContext,
  ArticleContextProps,
  EcosystemContext,
  EcosystemContextProps,
} from "@/lib/contexts";
import Loading from "@/app/loading";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { getTableOfContents, TocItem } from "@/lib/toc";

export default function Pages() {
  const [error, setError] = useState<boolean>(false);
  const { ecosystem, esName } = useContext<EcosystemContextProps>(
    EcosystemContext,
  ) as { ecosystem: Ecosystem; esName: string };
  const { article, setArticle } =
    useContext<ArticleContextProps>(ArticleContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([]);
  const searchParams = useSearchParams();
  const pathName = searchParams.get("name")!;
  const articleVersion = searchParams.get("version") || undefined;

  useEffect(() => {
    async function fetchDocument() {
      setIsLoading(true);
      try {
        const rawArticle = await getArticle(
          pathName,
          ecosystem,
          articleVersion,
        );
        setArticle(rawArticle);
        if (rawArticle) {
          setTableOfContents(await getTableOfContents(rawArticle));
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
        {article && (
          <Typography>
            <h1 className="-mt-2 text-3xl">{pathName}</h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                rehypeAutolinkHeadings,
                rehypeKatex,
                rehypePrism,
              ]}
            >
              {article}
            </ReactMarkdown>
          </Typography>
        )}
      </div>
      {Settings.rightbar && (
        <div className="toc sticky top-16 hidden min-w-[230px] gap-3 py-8 xl:flex xl:flex-col">
          {Settings.totop && (
            <BackToTop className="mt-6 self-start text-sm text-neutral-800 dark:text-neutral-300/85" />
          )}
          {Settings.feedback && <Feedback slug={pathName} title={pathName} />}
          {Settings.toc && <Toc tocs={tableOfContents} />}
        </div>
      )}
    </div>
  );
}
