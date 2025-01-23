"use client";

import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function Copy({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Button variant="secondary" size="xs" onClick={handleCopy}>
      <span className="relative inline-block h-4 w-4">
        <LuCopy
          className={cn(
            "absolute h-full w-full transform transition-opacity duration-300",
            isCopied ? "scale-90 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <LuCheck
          className={cn(
            "absolute h-full w-full transform transition-opacity duration-300",
            isCopied ? "scale-100 opacity-100" : "scale-90 opacity-0",
          )}
        />
      </span>
    </Button>
  );
}
