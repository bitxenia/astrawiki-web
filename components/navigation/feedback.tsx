import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";

import { GitHubLink } from "@/settings/navigation";
import { cn } from "@/lib/utils";

type SideBarEdit = {
  title: string;
  slug: string;
};

export default function RightSideBar({ slug, title }: SideBarEdit) {
  const feedbackUrl = `${GitHubLink.href}/issues/new?title=Feedback for "${title}"&labels=feedback`;
  const editUrl = `/articles/edit?name=${title}`;
  const historyUrl = `/articles/history?name=${title}`;

  return (
    <div className="flex flex-col gap-3 pl-2">
      <h3 className="text-sm font-semibold">This content</h3>
      <div className="flex flex-col gap-2">
        <Link
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center text-sm text-neutral-800 no-underline dark:text-neutral-300/85",
          )}
        >
          <LuArrowUpRight className="mr-1 inline-block h-4 w-4" /> Feedback
        </Link>
        <Link
          href={editUrl}
          rel="noopener noreferrer"
          className={cn(
            "flex items-center text-sm text-neutral-800 no-underline dark:text-neutral-300/85",
          )}
        >
          Edit page
        </Link>
        <Link
          href={historyUrl}
          rel="noopener noreferrer"
          className={cn(
            "flex items-center text-sm text-neutral-800 no-underline dark:text-neutral-300/85",
          )}
        >
          History
        </Link>
      </div>
    </div>
  );
}
