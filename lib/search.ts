import { Storage } from "./articles/storage";

export type search = {
  title: string;
  href: string;
};

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

export function simpleSearch(query: string, data: any[]) {
  const lowerQuery = query.toLowerCase().trim();

  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length >= 3);

  if (queryWords.length === 0) return [];

  const chunks = chunkArray(data, 100);

  const results = chunks.flatMap((chunk) =>
    chunk
      .map((doc) => {
        const title = doc.title || "";
        let relevanceScore = calculateRelevance(queryWords.join(" "), title);

        return {
          title: doc.title || "Untitled",
          href: `${doc.slug}`,
          description: doc.description || "",
          relevance: relevanceScore,
        };
      })
      .filter((doc) => doc.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance),
  );

  return results;
}

const PAGE_SIZE = 10;
/**
 * Performs search using the searchArticles method from ecosystems that
 * support it.
 *
 * @param {string} query Text to match
 * @param {EcosystemBasedStorage} storage Current storage
 * @param {number} page Page number
 * @returns Array of objects that contain a result's title and href for the
 * search component
 */
export async function optimizedSearch(
  query: string,
  storage: Storage,
  page: number,
): Promise<{ results: { title: string; href: string }[]; hasMore: boolean }> {
  const results = await storage.searchArticles(
    query,
    PAGE_SIZE,
    PAGE_SIZE * page,
  );
  return {
    results: results.map((title) => {
      return {
        title,
        href: `?name=${title}`,
      };
    }),
    hasMore: results.length === PAGE_SIZE,
  };
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
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
