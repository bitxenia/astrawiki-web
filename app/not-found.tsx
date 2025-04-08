import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[82vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">404</h1>
      <p className="mb-8 max-w-[600px] text-foreground sm:text-base">
        Page not found
      </p>
      <div className="flex items-center">
        <Link
          href="/"
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
