import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Paths } from "@/lib/pageroutes";

import searchData from "@/public/search-data/documents.json"

export type search = {
    title: string;
    href: string;
    snippet?: string;
    description?: string;
    relevance?: number;
};

function memoize<T extends (...args: any[]) => any>(fn: T) {
    const cache = new Map<string, ReturnType<T>>();

    return (...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            const cachedResult = cache.get(key);
            if (cachedResult !== undefined) return cachedResult;
        }

        const result = fn(...args);

        if (result !== '' && result != null) {
            cache.set(key, result);
        }

        return result;
    };
}

const memoizedSearchMatch = memoize(searchMatch);
const memoizedCleanMdxContent = memoize(cleanMdxContent);

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function isRoute(node: Paths): node is Extract<Paths, { href: string; title: string }> {
    return "href" in node && "title" in node;
}

export function helperSearch(
    query: string,
    node: Paths,
    prefix: string,
    currentLevel: number,
    maxLevel?: number
) {
    const res: Paths[] = [];
    let parentHas = false;
    const lowerQuery = query.toLowerCase();

    if (isRoute(node)) {
        const nextLink = `${prefix}${node.href}`;

        const titleMatch = node.title.toLowerCase().includes(lowerQuery);
        const titleDistance = memoizedSearchMatch(lowerQuery, node.title.toLowerCase());

        if (titleMatch || titleDistance <= 2) {
            res.push({ ...node, items: undefined, href: nextLink });
            parentHas = true;
        }

        const goNext = maxLevel ? currentLevel < maxLevel : true;

        if (goNext && node.items) {
            node.items.forEach((item) => {
                const innerRes = helperSearch(query, item, nextLink, currentLevel + 1, maxLevel);
                if (innerRes.length && !parentHas && !node.noLink) {
                    res.push({ ...node, items: undefined, href: nextLink });
                    parentHas = true;
                }
                res.push(...innerRes);
            });
        }
    }

    return res;
}

function searchMatch(a: string, b: string): number {
    if (typeof a !== 'string' || typeof b !== 'string') return 0;

    const aLen = a.length;
    const bLen = b.length;

    if (aLen === 0) return bLen;
    if (bLen === 0) return aLen;

    if (aLen > bLen) [a, b] = [b, a];

    const maxDistance = Math.min(Math.max(Math.floor(aLen / 2), 2), 5);

    let prevRow = Array(aLen + 1).fill(0);
    let currRow = Array(aLen + 1).fill(0);

    for (let i = 0; i <= aLen; i++) prevRow[i] = i;

    for (let j = 1; j <= bLen; j++) {
        currRow[0] = j;
        for (let i = 1; i <= aLen; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            currRow[i] = Math.min(prevRow[i] + 1, currRow[i - 1] + 1, prevRow[i - 1] + cost);

            if (currRow[i] > maxDistance) {
                return maxDistance;
            }
        }
        [prevRow, currRow] = [currRow, prevRow];
    }

    return Math.min(prevRow[aLen], maxDistance);
}


function calculateRelevance(query: string, title: string): number {
    const lowerQuery = query.toLowerCase().trim();
    const lowerTitle = title.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/);

    let score = 0;

    if (lowerTitle === lowerQuery) {
        score += 50;
    } else if (lowerTitle.includes(lowerQuery)) {
        score += 30;
    }

    queryWords.forEach((word, _index) => {
        const position = lowerTitle.indexOf(word);
        if (position !== -1) {
            score += 20;
        }
    });

    for (let i = 0; i < queryWords.length - 1; i++) {
        const phrase = `${queryWords[i]} ${queryWords[i + 1]}`;
        if (lowerTitle.includes(phrase)) {
            score += 15;
        }
    }

    const lengthNormalizationFactor = Math.log(lowerTitle.length + 1);
    if (lengthNormalizationFactor > 0) {
        score /= lengthNormalizationFactor;
    }

    return Math.max(0, score);
}

function cleanMdxContent(content: string): string {
    return content
        .replace(/<[^>]+>/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/\|.*?\|/g, '')
        .replace(/[*+-]\s|\d+\.\s|\[x\]|\[ \]/g, '')
        .replace(/^(#{1,6}\s|>\s|-{3,}|\*{3,})/gm, '')
        .replace(/[*_~`]+/g, '')
        .replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '')
        .replace(/\$\$[\s\S]*?\$\$/g, '')
        .replace(/\$[^$]*\$/g, '')
        .replace(/\\/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function advanceSearch(query: string, data: any[]) {
    const lowerQuery = query.toLowerCase().trim();

    const queryWords = lowerQuery.split(/\s+/).filter(word => word.length >= 3);

    if (queryWords.length === 0) return [];

    const chunks = chunkArray(data, 100);

    const results = chunks.flatMap((chunk) =>
        chunk.map((doc) => {
            const title = doc.title || "";
            let relevanceScore = calculateRelevance(queryWords.join(' '), title);

            return {
                title: doc.title || "Untitled",
                href: `${doc.slug}`,
                description: doc.description || "",
                relevance: relevanceScore,
            };
        })
            .filter((doc) => doc.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance)
    );

    return results;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

function formatDateHelper(dateStr: string, options: Intl.DateTimeFormatOptions): string {
    const [day, month, year] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", options);
}

export function formatDate(dateStr: string): string {
    return formatDateHelper(dateStr, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatDate2(dateStr: string): string {
    return formatDateHelper(dateStr, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function stringToDate(date: string) {
    const [day, month, year] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;
    let rafId: number | null = null;
    let lastCallTime: number | null = null;

    const later = (time: number) => {
        const remaining = wait - (time - (lastCallTime || 0));
        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            func(...(lastArgs as Parameters<T>));
            lastArgs = null;
            lastCallTime = null;
        } else {
            rafId = requestAnimationFrame(later);
        }
    };

    return (...args: Parameters<T>) => {
        lastArgs = args;
        lastCallTime = performance.now();
        const callNow = immediate && !timeout;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            rafId = requestAnimationFrame(later);
        }, wait);
        if (callNow) func(...args);
    };
}

export function highlight(snippet: string, searchTerms: string): string {
    if (!snippet || !searchTerms) return snippet;

    const terms = searchTerms
        .split(/\s+/)
        .filter(term => term.trim().length > 0)
        .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (terms.length === 0) return snippet;

    const regex = new RegExp(`(${terms.join('|')})(?![^<>]*>)`, 'gi');

    return snippet.replace(/(<[^>]+>)|([^<]+)/g, (match, htmlTag, textContent) => {
        if (htmlTag) return htmlTag;
        return textContent.replace(regex, "<span class='highlight'>$1</span>");
    });
}
