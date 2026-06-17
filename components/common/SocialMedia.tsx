import {
  Youtube,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";

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

const socialLink = [
  {
    title: "YouTube",
    href: "https://youtube.com/@shivam",
    color: "hover:bg-red-600 hover:border-red-600",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Gmail",
    href: "mailto:shivam@gmail.com",
    color: "hover:bg-red-500 hover:border-red-500",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://instagram.com/shivam",
    color: "hover:bg-pink-600 hover:border-pink-600",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://facebook.com/shivam",
    color: "hover:bg-blue-600 hover:border-blue-600",
    icon: <Facebook className="w-5 h-5" />,
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
        {socialLink.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
               className={cn(
  "p-2 border rounded-full text-gray-500 hover:text-white transition-all duration-300",
  item.color,
  iconClassName
)}
              >
                {item.icon}
              </a>
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