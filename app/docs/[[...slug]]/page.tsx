"use client"
import { notFound } from "next/navigation";
import { getDocument, getRawArticle, parseMarkdown } from "@/lib/markdown";
import { Settings } from "@/lib/meta";

import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import Pagination from "@/components/navigation/pagination";
import Toc from "@/components/navigation/toc";
import Feedback from "@/components/navigation/feedback";
import { BackToTop } from "@/components/navigation/backtotop";
import { Typography } from "@/components/ui/typography";
import { useContext, useEffect, useState } from "react";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import { ArticleContext, EcosystemContext } from "@/lib/contexts";

type PageProps = {
    params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
    const [document, setDocument] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);
    const ecosystem = useContext<Ecosystem>(EcosystemContext)
    const { setArticle } = useContext<any>(ArticleContext);

    const pathName = slug.join("/");
    useEffect(() => {
        async function fetchDocument() {
            try {
                const rawArticle = await getRawArticle(pathName, ecosystem);
                const res = await parseMarkdown(pathName, rawArticle);
                if (!res) {
                    setError(true);
                } else {
                    setDocument(res);
                    setArticle(rawArticle);
                }
            } catch {
                setError(true);
            }
        }
        fetchDocument();
    }, [pathName, ecosystem, setArticle]);

    if (error) notFound();

    if (!document) {
        return <p> Loading... </p>;
    }

    const { frontmatter, content, tocs } = document;

    return (
        <div className="flex items-start gap-14">
            <div className="flex-[3] pt-10">
                <PageBreadcrumb paths={slug} />
                <Typography>
                    <h1 className="text-3xl -mt-2">{frontmatter.title}</h1>
                    <p className="-mt-4 text-base text-muted-foreground text-[16.5px]">
                        {frontmatter.description}
                    </p>
                    <div>{content}</div>
                    <Pagination pathname={pathName} />
                </Typography>
            </div>
            {Settings.rightbar && (
                <div className="hidden xl:flex xl:flex-col sticky top-16 gap-3 py-8 min-w-[230px] h-[94.5vh] toc">
                    {Settings.toc && <Toc tocs={tocs} />}
                    {Settings.feedback && <Feedback slug={pathName} title={frontmatter.title} />}
                    {Settings.totop && <BackToTop className="mt-6 self-start text-sm text-neutral-800 dark:text-neutral-300/85" />}
                </div>
            )}
        </div>
    );
}

