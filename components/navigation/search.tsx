"use client";

import { useContext, useEffect, useMemo, useState } from "react";
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
import {
  simpleSearch,
  cn,
  debounce,
  highlight,
  search,
  serverSideSearch as optimizedSearch,
} from "@/lib/utils";
import { EcosystemContext, EcosystemContextProps } from "@/lib/contexts";

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<search[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(false);

  const [searchData, setSearchData] = useState<
    { title: string; href: string }[]
  >([]);
  const { ecosystem, isESLoading } =
    useContext<EcosystemContextProps>(EcosystemContext);

  useEffect(() => {
    const fetchArticles = async () => {
      setSearchData([]);
      if (!ecosystem) {
        // NOTE: This should be unreachable unless localStorage ecosystem is
        // not set and the user access a page without going through the
        // landing page first.
        return;
      }
      setIsFetchingList(true);
      if (ecosystem && !ecosystem.optIn?.optimizedSearch) {
        const articleTitles = await ecosystem.getArticleList();
        const docs = articleTitles.map((title) => {
          return {
            title,
            href: `?name=${title}`,
          };
        });
        setSearchData(docs);
      } else {
        const docs = await optimizedSearch("", ecosystem);
        setSearchData(docs);
      }
      setIsFetchingList(false);
    };
    fetchArticles();
  }, [ecosystem]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (input) => {
        setIsLoading(true);
        if (ecosystem?.optIn?.optimizedSearch) {
          console.log("Getting filtered results...");
          setFilteredResults(await optimizedSearch(input.trim(), ecosystem));
        } else {
          setFilteredResults(simpleSearch(input.trim(), searchData));
        }
        setIsLoading(false);
      }, 300),
    [searchData],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k" && !isESLoading) {
        event.preventDefault();
        setIsOpen(true);
      }

      if (isOpen && event.key === "Enter" && filteredResults.length > 2) {
        const selected = filteredResults[0];
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
  }, [isOpen, filteredResults, isESLoading]);

  useEffect(() => {
    const processInput = async () => {
      if (searchedInput.length >= 3) {
        debouncedSearch(searchedInput);
      } else {
        setFilteredResults([]);
      }
    };
    processInput();
  }, [searchedInput, debouncedSearch]);

  function renderDocuments(
    documents: any[],
    parentHref: string = "/articles",
  ): React.ReactNode[] {
    if (!documents || !Array.isArray(documents)) {
      return [];
    }

    return documents.flatMap((doc) => {
      if ("spacer" in doc && doc.spacer) {
        return [];
      }

      const href = `${parentHref}${doc.href}`;

      return [
        <DialogClose key={href} asChild>
          <Anchor
            className={cn(
              "flex w-full items-center gap-2.5 rounded-sm px-3 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900",
            )}
            href={href}
          >
            <div className="flex h-full w-fit items-center gap-1.5 whitespace-nowrap py-3">
              <LuFileText className="h-[1.1rem] w-[1.1rem]" /> {doc.title}
            </div>
          </Anchor>
        </DialogClose>,
      ];
    });
  }

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
          {isLoading && (
            <p className="mx-auto mt-2 text-sm text-muted-foreground">
              Searching...
            </p>
          )}
          {isFetchingList && (
            <p className="mx-auto mt-2 text-sm text-muted-foreground">
              Fetching articles...
            </p>
          )}
          {!isFetchingList &&
            !isLoading &&
            filteredResults.length === 0 &&
            searchedInput.length >= 3 && (
              <p className="mx-auto mt-2 text-sm text-muted-foreground">
                No results found for{" "}
                <span className="text-primary">{`"${searchedInput}"`}</span>
              </p>
            )}
          <ScrollArea className="max-h-[350px]">
            <div className="flex flex-col items-start overflow-y-auto px-1 pb-4 pt-1 sm:px-3">
              {searchedInput
                ? filteredResults.map((item, index) => {
                    if ("href" in item) {
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
                            {"snippet" in item && item.snippet && (
                              <p
                                className="w-full truncate text-xs text-neutral-500 dark:text-neutral-400"
                                dangerouslySetInnerHTML={{
                                  __html: highlight(
                                    item.snippet,
                                    searchedInput,
                                  ),
                                }}
                              />
                            )}
                          </Anchor>
                        </DialogClose>
                      );
                    }
                    return null;
                  })
                : renderDocuments(searchData)}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
