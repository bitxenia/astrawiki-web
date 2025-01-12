'use client';

import Loading from "@/app/loading";
import notFound from "@/app/not-found";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArticleContext, ArticleContextProps, EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import { getPatchFromTwoTexts } from "@/lib/diff";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import { getRawArticle, invalidateCache } from "@/lib/markdown";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BarLoader } from "react-spinners";
import remarkGfm from "remark-gfm";

type PageProps = {
    params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
    const router = useRouter();
    const path = ["Edit"];
    const pathName = slug.join("/");

    const [newArticle, setNewArticle] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const { ecosystem, esName } = useContext<EcosystemContextProps>(EcosystemContext) as { ecosystem: Ecosystem, esName: string };
    const { article, setArticle } = useContext<ArticleContextProps>(ArticleContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        if (!article) {
            async function fetchDocument() {
                setIsLoading(true);
                try {
                    const rawArticle = await getRawArticle(pathName, ecosystem, null);
                    setArticle(rawArticle);
                    setNewArticle(rawArticle);
                } catch {
                    setError(true);
                }
                setIsLoading(false);

            }
            fetchDocument();
        } else {
            setNewArticle(article);
        }
    }, []);


    const saveChanges = async () => {
        setIsPublishing(true);
        const patch = getPatchFromTwoTexts(article as string, newArticle as string);
        if (patch.patch.length == 0) {
            alert("No changes were made");
            return
        }
        await ecosystem.editArticle(pathName, patch);
        setArticle(newArticle);
        invalidateCache(pathName);
        alert("Edited successfully!");
        setIsPublishing(false);
        router.push(`/docs/${pathName}`);
    }

    const cancel = async () => {
        router.push(`/docs/${pathName}`);
    }

    if (error) notFound();
    else if (isLoading) return <Loading title="Loading article..." desc={`Fetching ${pathName} from ${esName}`} />
    else if (isPublishing) return <Loading title="Publishing..." desc={`Saving ${pathName} changes to ${esName}`} />

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
                                value={newArticle || ""}
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
                            <button
                                className={buttonVariants({ variant: "secondary", size: "default" })}
                                onClick={cancel} >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Typography>
            </div>
        </div>
    );
}
