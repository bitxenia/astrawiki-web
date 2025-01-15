"use client";

import Loading from "@/app/loading";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
    ArticleContext,
    ArticleContextProps,
    EcosystemContext,
    EcosystemContextProps,
} from "@/lib/contexts";
import { getPatchFromTwoTexts } from "@/lib/diff";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Pages() {
    const router = useRouter();
    const { ecosystem, esName } = useContext<EcosystemContextProps>(
        EcosystemContext
    ) as { ecosystem: Ecosystem; esName: string };
    const { setArticle } = useContext<ArticleContextProps>(ArticleContext);
    const path = ["New"];
    const [title, setTitle] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    const publishArticle = async (name: string) => {
        setIsPublishing(true);
        await ecosystem
            .createArticle(name)
            .catch((err) => console.log("Create article: ", err));
        let patch = getPatchFromTwoTexts("", markdown);
        console.log("Article created successfully!");
        await ecosystem
            .editArticle(name, patch)
            .catch((err) => console.log("Edit article: ", err));
        alert("Article published successfully!");
        setArticle(markdown);
        setIsPublishing(false);
        router.push(`/articles?name=${title}`);
    };

    if (isPublishing) {
        return (
            <Loading
                title="Publishing..."
                desc={`Please wait while ${title} is uploaded to ${esName}.`}
            />
        );
    }

    return (
        <div className="flex items-start gap-14">
            <div className="flex-[3] pt-10">
                <PageBreadcrumb paths={path} />
                <Typography>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Write a name for your article..."
                            className="text-3xl font-bold -mt-2 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <div className="markdown-editor flex flex-col">
                            <textarea
                                className="p-4 border rounded-md w-full h-40"
                                placeholder="Write article here..."
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                            />
                            <text className="pb-2 pt-4 font-semibold">
                                Preview
                            </text>
                                <div className="markdown-preview p-4 border rounded-md">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdown}
                                    </ReactMarkdown>
                                </div>
                        </div>
                        <div className="flex justify-right gap-2 pb-4">
                            <button
                                className={buttonVariants({
                                    variant: "default",
                                    size: "default",
                                })}
                                onClick={() => publishArticle(title)}
                            >
                                Publish
                            </button>
                            <Link href="/">
                                <button
                                    className={buttonVariants({
                                        variant: "secondary",
                                        size: "default",
                                    })}
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </Typography>
            </div>
        </div>
    );
}
