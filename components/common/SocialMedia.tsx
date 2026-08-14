import {
  Youtube,
  Instagram,
  Facebook,
} from "lucide-react";
import { contactConfig } from "@/config/contact";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLinks = [
  {
    title: "Instagram",
    href: contactConfig.socialMedia.instagram,
    color: "text-pink-500 border-pink-500 hover:bg-pink-600 hover:text-white",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: contactConfig.socialMedia.facebook,
    color: "text-blue-500 border-blue-500 hover:bg-blue-600 hover:text-white",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "YouTube",
    href: contactConfig.socialMedia.youtube,
    color: "text-red-500 border-red-500 hover:bg-red-600 hover:text-white",
    icon: <Youtube className="w-5 h-5" />,
  },
];

const SocialMedia = ({
  className,
  iconClassName,
  tooltipClassName,
}: Props) => {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-3.5 text-zinc-400",
          className
        )}
      >
        {socialLinks.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
className={cn(
                      "flex h-11 w-11 items-center justify-center p-2.5 rounded-full transition-all duration-300",
                      item.color,
                      iconClassName
                    )}
                  >
                    {item.icon}
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className={cn(
                      "flex h-11 w-11 items-center justify-center p-2.5 rounded-full transition-all duration-300",
                      item.color,
                      iconClassName
                    )}
                  >
                  {item.icon}
                </span>
              )}
            </TooltipTrigger>

            <TooltipContent
              className={cn(
                "bg-white text-dark-color font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
