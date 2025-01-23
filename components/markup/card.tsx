import { PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { iconMap } from "@/settings/icons";

type CardProps = PropsWithChildren & {
  subtitle?: string;
  title: string;
  description?: string;
  href?: string;
  image?: string;
  className?: string;
  external?: boolean;
  icon?: keyof typeof iconMap;
  variant?: "normal" | "small" | "image";
};

export default function Card({
  subtitle,
  title,
  description,
  href,
  image,
  className,
  external = false,
  icon,
  variant = "normal",
  children,
}: CardProps) {
  const IconComponent = icon ? iconMap[icon] : null;
  const ExternalIcon = iconMap["arrowUpRight"];

  const content = (
    <div
      className={clsx(
        "group",
        variant === "small"
          ? "relative flex items-center space-x-2 rounded-lg border bg-white p-3 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 hover:dark:shadow-md"
          : variant === "image"
            ? "relative flex h-full flex-col justify-between rounded-lg border bg-white p-1 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 hover:dark:shadow-md"
            : "relative flex h-full flex-col justify-between rounded-lg border bg-white p-6 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 hover:dark:shadow-md",
        className,
      )}
    >
      {external && href && variant !== "image" && (
        <div className="absolute right-2 top-2 transform text-gray-500 transition-transform duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black dark:text-gray-400 dark:group-hover:text-white">
          <ExternalIcon
            className="h-4 w-4 group-hover:stroke-[4]"
            strokeWidth={3}
          />
        </div>
      )}
      {IconComponent && (
        <IconComponent className="text-gray-500 dark:text-gray-300" />
      )}
      <div>
        {subtitle && variant === "normal" && (
          <p className="!my-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        {image && variant === "image" && (
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            className="!m-0 h-[180px] w-full rounded-none border-0 object-cover object-center"
          />
        )}
        <div
          className={clsx(
            variant === "small"
              ? "text-sm transition-all group-hover:font-bold"
              : variant === "image"
                ? "!p-4 !py-2 text-sm transition-all group-hover:font-bold"
                : "text-lg font-semibold transition-all group-hover:font-bold",
            className,
          )}
        >
          {title}
        </div>
        {description && variant === "normal" && (
          <p className="!my-2 text-sm font-normal text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );

  return href ? (
    <Link
      href={href}
      passHref
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      className="!no-underline"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
