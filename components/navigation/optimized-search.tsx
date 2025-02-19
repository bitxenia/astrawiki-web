"use client";

import { useContext, useEffect, useState } from "react";
import { LuCommand, LuFileText, LuSearch } from "react-icons/lu";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import Anchor from "./anchor";
import { cn, debounce, optimizedSearch } from "@/lib/utils";
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";
import { buttonVariants } from "../ui/button";

export default function OptimizedSearch() {
  const [searchedInput, setSearchedInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const [searchData, setSearchData] = useState<
    { title: string; href: string }[]
  >([]);
  const { ecosystem, isESLoading } =
    useContext<EcosystemContextProps>(EcosystemContext);

  async function fetchResults() {
    if (!ecosystem) {
      return;
    }
    setIsFetching(true);
    if (page === 0) {
      setSearchData([]);
    }
    const { results, hasMore } = await optimizedSearch(
      searchedInput,
      ecosystem,
      page,
    );
    setHasMoreResults(hasMore);
    setSearchData((data) => data.concat(results));
    setIsFetching(false);
  }

  useEffect(() => {
    fetchResults();
  }, [ecosystem, page]);

  const debouncedSearch = debounce(async () => {
    if (searchedInput.length < 3 && searchedInput.length > 0) {
      setHasMoreResults(false);
    } else {
      await fetchResults();
    }
  }, 300);

  useEffect(() => {
    const processInput = async () => {
      if (searchedInput.length > 0 && searchedInput.length < 3) {
        setSearchData([]);
        setHasMoreResults(false);
      } else {
        setPage(0);
        debouncedSearch();
      }
    };
    processInput();
  }, [searchedInput]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k" && !isESLoading) {
        event.preventDefault();
        setIsOpen(true);
      }

      if (isOpen && event.key === "Enter" && searchData.length > 2) {
        const selected = searchData[0];
        if ("href" in selected) {
          window.location.href = `/articles${selected.href}`;
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, searchData, isESLoading]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setTimeout(() => setSearchedInput(""), 200);
          }
        }}
      >
        <DialogTrigger asChild>
          <div className="relative max-w-md flex-1 cursor-pointer">
            <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
            <Input
              className="h-9 w-full rounded-md border bg-muted pl-10 pr-4 shadow-sm md:w-full"
              placeholder="Search articles..."
              type="search"
            />
            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono text-xs font-medium dark:bg-neutral-700 sm:flex">
              <LuCommand className="h-3 w-3" />
              <span>k</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="top-[45%] max-w-[650px] p-0 sm:top-[38%]">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogHeader>
            <input
              value={searchedInput}
              onChange={(e) => setSearchedInput(e.target.value)}
              placeholder="Search documents..."
              autoFocus
              className="h-14 border-b bg-transparent px-4 text-[15px] outline-none"
            />
          </DialogHeader>
          {searchedInput.length > 0 && searchedInput.length < 3 && (
            <p className="text-warning mx-auto mt-2 text-sm">
              Please enter at least 3 characters.
            </p>
          )}
          {!isFetching &&
            searchData.length === 0 &&
            searchedInput.length >= 3 && (
              <p className="mx-auto mt-2 text-sm text-muted-foreground">
                No results found for{" "}
                <span className="text-primary">{`"${searchedInput}"`}</span>
              </p>
            )}
          <ScrollArea className="max-h-[350px]">
            <div className="flex flex-col items-start overflow-y-auto px-1 pb-4 pt-1 sm:px-3">
              {searchData.map((item) => {
                return (
                  <DialogClose key={item.href} asChild>
                    <Anchor
                      className={cn(
                        "flex w-full flex-col gap-0.5 rounded-sm p-3 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900",
                      )}
                      href={`/articles${item.href}`}
                    >
                      <div className="flex h-full w-fit items-center gap-x-2">
                        <LuFileText className="h-[1.1rem] w-[1.1rem]" />{" "}
                        {item.title}
                      </div>
                    </Anchor>
                  </DialogClose>
                );
              })}
              {hasMoreResults && (
                <button
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                  onClick={() => setPage((prevPage) => prevPage + 1)}
                >
                  Load more
                </button>
              )}
            </div>
            {isFetching && (
              <p className="mx-auto mt-2 text-sm text-muted-foreground">
                Fetching articles...
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
