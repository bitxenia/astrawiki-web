'use client';

import notFound from "@/app/not-found";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArticleContext, ArticleContextProps, EcosystemContext } from "@/lib/contexts";
import { getPatchFromTwoTexts } from "@/lib/diff";
import { Ecosystem, Patch } from "@/lib/ecosystems/ecosystem";
import { getRawArticle } from "@/lib/markdown";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PageProps = {
    params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
    const path = ["New"];
    const pathName = slug.join("/");

    const [newArticle, setNewArticle] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);
    const ecosystem = useContext<Ecosystem>(EcosystemContext);
    const { article, setArticle } = useContext<ArticleContextProps>(ArticleContext);

    useEffect(() => {
        if (!article) {
            async function fetchDocument() {
                try {
                    const rawArticle = await getRawArticle(pathName, ecosystem);
                    setArticle(rawArticle);
                    setNewArticle(rawArticle);
                } catch {
                    setError(true);
                }
            }
            fetchDocument();
        } else {
            setNewArticle(article);
        }
    }, []);

    if (error) notFound();

    if (!newArticle) {
        return <p> Loading... </p>;
    }

    const saveChanges = async () => {
        const patch = getPatchFromTwoTexts(article as string, newArticle);
        await ecosystem.editArticle(pathName, patch);
        setArticle(newArticle);
        alert("Edited successfully!");
    }

    return (
        <div className="flex items-start gap-14">
            <div className="flex-[3] pt-10">
                <PageBreadcrumb paths={path} />
                <Typography>
                    <div className="space-y-4">
                        <h1 className="text-3xl -mt-2">{pathName}</h1>
                        <div className="markdown-editor flex flex-col gap-6">
                            <textarea
                                className="p-4 border rounded-md w-full h-40"
                                placeholder="Write article here..."
                                value={newArticle}
                                onChange={(e) => setNewArticle(e.target.value)}
                            />
                            <div className="markdown-preview p-4 border rounded-md">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{newArticle}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="flex justify-right gap-2">
                            <button
                                className={buttonVariants({ variant: "default", size: "default" })}
                                onClick={saveChanges} >
                                Save changes
                            </button>
                            <button className={buttonVariants({ variant: "secondary", size: "default" })}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Typography>
            </div>
        </div>
    );
}
