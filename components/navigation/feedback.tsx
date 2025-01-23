import Link from "next/link";

import { cn } from "@/lib/utils";

type SideBarEdit = {
  title: string;
  slug: string;
};

export default function RightSideBar({ slug, title }: SideBarEdit) {
  const editUrl = `/articles/edit?name=${title}`;
  const historyUrl = `/articles/history?name=${title}`;

  return (
    <div className="flex flex-col gap-3 pl-2">
      <h3 className="text-sm font-semibold">This content</h3>
      <div className="flex flex-col gap-2">
        <Link
          href={editUrl}
          rel="noopener noreferrer"
          className={cn(
            "text-sm text-neutral-800 dark:text-neutral-300/85 no-underline flex items-center"
          )}
        >
          Edit page
        </Link>
        <Link
          href={historyUrl}
          rel="noopener noreferrer"
          className={cn(
            "text-sm text-neutral-800 dark:text-neutral-300/85 no-underline flex items-center"
          )}
        >
          History
        </Link>
      </div>
    </div>
  );
}
