'use client';

import notFound from "@/app/not-found";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { getDocument, getRawDocument } from "@/lib/markdown";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PageProps = {
    params: { slug: string[] };
};

export default function Pages({ params: { slug = [] } }: PageProps) {
    const path = ["New"];
    const pathName = slug.join("/");

    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        const fetchArticle = async () => {
            const res = await getRawDocument(pathName);
            if (!res) {
                notFound();
                return;
            }
            setMarkdown(res)
        }
        fetchArticle();
    });

    return (
        <div className="flex items-start gap-14">
            <div className="flex-[3] pt-10">
                <PageBreadcrumb paths={path} />
                <Typography>
                    <div className="space-y-4">
                        <input type="text" placeholder="Write a name for your article..."
                            className="text-3xl font-bold -mt-2 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full" />
                        <div className="markdown-editor flex flex-col gap-6">
                            <textarea
                                className="p-4 border rounded-md w-full h-40"
                                placeholder="Write article here..."
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                            />
                            <div className="markdown-preview p-4 border rounded-md">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="flex justify-right gap-2">
                            <button className={buttonVariants({ variant: "default", size: "default" })}>
                                Publish
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
