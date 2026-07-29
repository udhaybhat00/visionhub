import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contactConfig } from "@/config/contact";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href?: string;
}

const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: `${contactConfig.company.address}, ${contactConfig.company.city}`,
    icon: (
      <MapPin className="h-5 w-5 text-gray-400 group-hover:text-[#d5b34b] transition-colors" />
    ),
    href: `https://maps.google.com/?q=${encodeURIComponent(`${contactConfig.company.address}, ${contactConfig.company.city}`)}`,
  },
  {
    title: "Call Us",
    subtitle: contactConfig.company.phone,
    icon: (
      <Phone className="h-5 w-5 text-gray-400 group-hover:text-[#d5b34b] transition-colors" />
    ),
    href: `tel:${contactConfig.company.phone.replace(/\D/g, "")}`,
  },
  {
    title: "Working Hours",
    subtitle: `${contactConfig.businessHours.weekday}, ${contactConfig.businessHours.weekend}`,
    icon: (
      <Clock className="h-5 w-5 text-gray-400 group-hover:text-[#d5b34b] transition-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: contactConfig.emails.support,
    icon: (
      <Mail className="h-5 w-5 text-gray-400 group-hover:text-[#d5b34b] transition-colors" />
    ),
    href: `mailto:${contactConfig.emails.support}`,
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-200 py-2">
      {data.map((item, index) => (
        <ContactItem
          key={index}
          icon={item.icon}
          title={item.title}
          content={item.subtitle}
          href={item.href}
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
}

const ContactItem = ({ icon, title, content, href }: ContactItemProps) => {
  const Component = href ? "a" : "div";
  const props = href
    ? {
        href,
        target: href.startsWith("http") ? "_blank" : "_self",
        rel: href.startsWith("http") ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <Component
      {...props}
      className="flex items-center gap-3 border-r border-gray-100 last:border-r-0 px-5 py-5 transition-colors hover:bg-gray-50/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#d5b34b]/10 transition-colors">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
          {title}
        </p>
        <p className="mt-0.5 text-sm font-medium text-gray-900 truncate">
          {content}
        </p>
      </div>
    </Component>
  );
};

export default FooterTop;
