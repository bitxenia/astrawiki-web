"use client";

import Loading from "@/app/loading";
import notFound from "@/app/not-found";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { EcosystemContext, StorageContext } from "@/lib/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export default function Pages() {
  const router = useRouter();
  const path = ["Edit"];

  const searchParams = useSearchParams();

  const pathName = searchParams.get("name")!;

  const [newArticle, setNewArticle] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);
  const [article, setArticle] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    async function fetchDocument() {
      setIsLoading(true);
      try {
        const rawArticle = await storage!.getArticle(pathName);
        setArticle(rawArticle);
        setNewArticle(rawArticle);
      } catch {
        setError(true);
      }
      setIsLoading(false);
    }
    fetchDocument();
  }, []);

  if (error) notFound();

  const saveChanges = async () => {
    if (!newArticle) return;
    setIsPublishing(true);
    await storage!.editArticle(pathName, article, newArticle);
    setArticle(newArticle);
    toast.success("Edited successfully!");
    setIsPublishing(false);
    router.push(`/articles?name=${pathName}`);
  };

  const cancel = async () => {
    router.push(`/articles?name=${pathName}`);
  };

  if (error) notFound();
  else if (isLoading)
    return (
      <Loading
        title="Loading article..."
        desc={`Fetching ${pathName} from ${esName}`}
      />
    );
  else if (isPublishing)
    return (
      <Loading
        title="Publishing..."
        desc={`Saving ${pathName} changes to ${esName}`}
      />
    );

  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={path} />
        <Typography>
          <div className="space-y-4">
            <h1 className="-mt-2 text-3xl">{pathName}</h1>
            <div className="markdown-editor flex flex-col gap-6">
              <textarea
                className="h-40 w-full rounded-md border p-4"
                placeholder="Write article here..."
                value={newArticle || ""}
                onChange={(e) => setNewArticle(e.target.value)}
              />
              <div className="markdown-preview rounded-md border p-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[
                    rehypeSlug,
                    rehypeAutolinkHeadings,
                    rehypeKatex,
                  ]}
                >
                  {newArticle}
                </ReactMarkdown>
              </div>
            </div>
            <div className="justify-right flex gap-2">
              <button
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                })}
                onClick={saveChanges}
              >
                Save changes
              </button>
              <button
                className={buttonVariants({
                  variant: "secondary",
                  size: "default",
                })}
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </Typography>
      </div>
    </div>
  );
}
