import Link from "next/link";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { getPreviousNext } from "@/lib/markdown";

export default function Pagination({ pathname }: { pathname: string }) {
  const res = getPreviousNext(pathname);

  return (
    <div className="flex items-center justify-between py-5 sm:py-7">
      <div>
        {res.prev && (
          <Link
            className="ml-auto inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium !no-underline shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            href={`/docs${res.prev.href}`}
          >
            <LuChevronLeft className="mr-1 h-[1rem] w-[1rem]" />
            <p>{res.prev.title}</p>
          </Link>
        )}
      </div>
      <div>
        {res.next && (
          <Link
            className="ml-auto inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium !no-underline shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            href={`/docs${res.next.href}`}
          >
            <p>{res.next.title}</p>
            <LuChevronRight className="ml-1 h-[1rem] w-[1rem]" />
          </Link>
        )}
      </div>
    </div>
  );
}
