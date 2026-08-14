"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  categoriesData,
  quickLinksData,
  visionHubCollectionsData,
} from "@/constants";

interface FooterLink {
  title: string;
  href?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  { title: "Quick Links", links: quickLinksData },
  {
    title: "Categories",
    links: categoriesData.map((item) => ({
      title: item.title,
      href: `/category/${item.href}`,
    })),
  },
  { title: "VisionHub Collections", links: visionHubCollectionsData },
];

const FooterColumns = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {columns.map((column, index) => (
        <div
          key={column.title}
          className="text-center md:text-left"
        >
          <button
            type="button"
            onClick={() =>
              setOpenIndex((current) => (current === index ? null : index))
            }
            aria-expanded={openIndex === index}
            className="flex w-full items-center justify-between px-2 py-4 lg:pointer-events-none lg:cursor-default lg:mb-4 lg:p-0"
          >
            <span className="font-display text-[15px] font-bold text-ink">
              {column.title}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-ink-soft transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          <ul
            className={`space-y-4 px-2 pb-3 lg:block lg:px-0 lg:pb-0 ${
              openIndex === index ? "block" : "hidden"
            }`}
          >
            {column.links.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href || "/"}
                  className="link-underline text-sm font-medium text-ink-soft transition-brand hover:text-amber-brand-deep"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default FooterColumns;