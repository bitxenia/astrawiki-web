import path from "path";
// import { createReadStream, promises as fs } from "fs";

import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit";

import { PageRoutes } from "@/lib/pageroutes";
import { components } from "@/lib/components";
import { Settings } from "@/lib/meta";
import { GitHubLink } from "@/settings/navigation";
import { Article, Ecosystem } from "./ecosystems/ecosystem";
import { getTextFromPatches } from "./diff";
import { ReactElement } from "react";

async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preCopy,
          rehypeCodeTitles,
          rehypeKatex,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postCopy,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

type BaseMdxFrontmatter = {
  title: string;
  description: string;
  keywords: string;
};

const computeDocumentPath = (slug: string) => {
  return Settings.gitload
    ? `${GitHubLink.href}/raw/main/contents/docs/${slug}/index.mdx`
    : path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
};

const getDocumentPathMemoized = (() => {
  const cache = new Map<string, string>();
  return (slug: string) => {
    if (!cache.has(slug)) {
      cache.set(slug, computeDocumentPath(slug));
    }
    return cache.get(slug)!;
  };
})();

const getRawArticleMemoized = (() => {
  const cache = new Map<string, Article>();

  return async (articleName: string, ecosystem: Ecosystem) => {
    console.log(
      `Looking for ${articleName} in cache: ${cache.keys().toArray()}`
    );
    if (!cache.has(articleName)) {
      console.log(`Fetching article ${articleName}`);
      const article = await ecosystem.fetchArticle(articleName);
      cache.set(articleName, article);
    }

    return cache.get(articleName)!;
  };
})();

/**
 * Fetches article from the given ecosystem and builds from patches.
 * @param name Name of the article, case sensitive.
 * @param ecosystem Ecosystem to fetch the article from.
 * @returns article as raw markdown (without frontmatter).
 */
export async function getRawArticle(
  name: string,
  ecosystem: Ecosystem,
  articleVersion: number | null = null
): Promise<string> {
  console.log(`Getting article ${name} with version ${articleVersion}`);

  const article = await getRawArticleMemoized(name, ecosystem);

  console.log(
    `Article is ${article.name} with patches ${article.patches.length}`
  );

  if (articleVersion === null || articleVersion > article.patches.length) {
    return getTextFromPatches(article.patches);
  }

  return getTextFromPatches(article.patches.slice(0, articleVersion));
}

//
/**
 * Parses article into MDX.
 * @param title Title of the article.
 * @param rawMd raw markdown (without frontmatter).
 * @returns parsed markdown.
 */
export async function parseMarkdown(
  title: string,
  rawMd: string
): Promise<ReactElement<any, any>> {
  const rawFrontmatter = `---\ntitle: ${title}\n---\n`;
  const parsedMdx = await parseMdx<BaseMdxFrontmatter>(
    rawFrontmatter.concat(rawMd)
  );
  // const tocs = await getTable(slug);
  return parsedMdx.content;
}

export async function getDocument(slug: string, ecosystem: Ecosystem) {
  try {
    // const contentPath = getDocumentPathMemoized(slug);
    // let rawMdx = "";
    // let lastUpdated: string | null = null;
    //
    // if (Settings.gitload) {
    //     const response = await fetch(contentPath);
    //     if (!response.ok) {
    //         throw new Error(`Failed to fetch content from GitHub: ${response.statusText}`);
    //     }
    //     rawMdx = await response.text();
    //     lastUpdated = response.headers.get('Last-Modified') ?? null;
    // } else {
    //     rawMdx = await fs.readFile(contentPath, "utf-8");
    //     const stats = await fs.stat(contentPath);
    //     lastUpdated = stats.mtime.toISOString();
    // }
    const article = await ecosystem.fetchArticle(slug);
    const frontmatter = `---\ntitle: ${slug}\n---\n`;
    const rawMdx = frontmatter.concat(getTextFromPatches(article.patches));

    const parsedMdx = await parseMdx<BaseMdxFrontmatter>(rawMdx);
    // const tocs = await getTable(slug);
    const tocs: any[] = [];

    return {
      frontmatter: parsedMdx.frontmatter,
      content: parsedMdx.content,
      tocs,
      lastUpdated: null,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getPatches(name: string, ecosystem: Ecosystem) {
  console.log(`Getting patches for ${name}`);
  const article = await getRawArticleMemoized(name, ecosystem);
  // const article = await ecosystem.fetchArticle(name);

  return {
    patches: article.patches,
  };
}

// export async function getRawDocument(slug: string) {
//     try {
//         const contentPath = getDocumentPathMemoized(slug);
//         const rawMdx = await fs.readFile(contentPath, "utf-8");
//
//         return rawMdx;
//     } catch (err) {
//         console.error(err);
//         return null;
//     }
// }

// const headingsRegex = /^(#{2,4})\s(.+)$/gm;

// export async function getTable(slug: string): Promise<Array<{ level: number; text: string; href: string }>> {
//     const extractedHeadings: Array<{ level: number; text: string; href: string }> = [];
//     let rawMdx = "";
//
//     if (Settings.gitload) {
//         const contentPath = `${GitHubLink.href}/raw/main/contents/docs/${slug}/index.mdx`;
//         try {
//             const response = await fetch(contentPath);
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch content from GitHub: ${response.statusText}`);
//             }
//             rawMdx = await response.text();
//         } catch (error) {
//             console.error("Error fetching content from GitHub:", error);
//             return [];
//         }
//     } else {
//         const contentPath = path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
//         try {
//             const stream = createReadStream(contentPath, { encoding: 'utf-8' });
//             for await (const chunk of stream) {
//                 rawMdx += chunk;
//             }
//         } catch (error) {
//             console.error("Error reading local file:", error);
//             return [];
//         }
//     }
//
//     let match;
//     while ((match = headingsRegex.exec(rawMdx)) !== null) {
//         const level = match[1].length;
//         const text = match[2].trim();
//         extractedHeadings.push({
//             level: level,
//             text: text,
//             href: `#${innerslug(text)}`,
//         });
//     }
//
//     return extractedHeadings;
// }

// function innerslug(text: string) {
//     return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
// }

const pathIndexMap = new Map(
  PageRoutes.map((route, index) => [route.href, index])
);

export function getPreviousNext(path: string) {
  const index = pathIndexMap.get(`/${path}`);

  if (index === undefined || index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? PageRoutes[index - 1] : null;
  const next = index < PageRoutes.length - 1 ? PageRoutes[index + 1] : null;

  return { prev, next };
}

const preCopy = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl?.tagName === "code") {
        node.raw = codeEl.children?.[0]?.value || "";
      }
    }
  });
};

const postCopy = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre" && node.raw) {
      node.properties["raw"] = node.raw;
    }
  });
};
