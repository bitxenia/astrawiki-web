"use client";

import Loading from "@/app/loading";
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb";
import { ChatStorageContext } from "@/components/providers/chat-storage-provider";
import { EcosystemContext } from "@/components/providers/ecosystem-provider";
import { StorageContext } from "@/components/providers/storage-provider";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Pages() {
  const router = useRouter();
  const { esName } = useContext(EcosystemContext);
  const { storage } = useContext(StorageContext);
  const { chatStorage } = useContext(ChatStorageContext);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const createChat = async (name: string) => {
    console.time("createChat");
    await chatStorage!.createChat(name);
    console.timeEnd("createChat");
  };

  const publishArticle = async (name: string) => {
    setIsPublishing(true);
    console.time("createArticle");
    await storage!.createArticle(name, markdown);
    console.timeEnd("createArticle");
    await createChat(name);
    toast.success("Article published successfully!");
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
        <PageBreadcrumb paths={["New"]} />
        <Typography>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Write a name for your article..."
              className="-mt-2 w-full border-b-2 border-gray-300 bg-transparent text-3xl font-bold focus:border-blue-500 focus:outline-none"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <div className="markdown-editor flex flex-col">
              <textarea
                className="h-40 w-full rounded-md border p-4"
                placeholder="Write article here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
              />
              <span className="pb-2 pt-4 font-semibold">Preview</span>
              <div className="markdown-preview rounded-md border p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
            <div className="justify-right flex gap-2 pb-4">
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
