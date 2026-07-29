"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { contactConfig } from "@/config/contact";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  HeadphonesIcon,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: contactConfig.company.address,
    subDetails: contactConfig.company.city,
    accent: "border-l-[#315d55]",
    iconBg: "bg-[#315d55]",
    href: `https://maps.google.com/?q=${encodeURIComponent(`${contactConfig.company.address}, ${contactConfig.company.city}`)}`,
  },
  {
    icon: Phone,
    title: "Call Us",
    details: contactConfig.company.phone,
    subDetails: contactConfig.businessHours.weekday,
    accent: "border-l-[#9a7918]",
    iconBg: "bg-[#9a7918]",
    href: `tel:${contactConfig.company.phone.replace(/\D/g, "")}`,
  },
  {
    icon: Mail,
    title: "Email Support",
    details: contactConfig.emails.support,
    subDetails: contactConfig.responseTime.standard,
    accent: "border-l-[#315d55]",
    iconBg: "bg-[#315d55]",
    href: `mailto:${contactConfig.emails.support}`,
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: contactConfig.businessHours.weekday,
    subDetails: contactConfig.businessHours.weekend,
    accent: "border-l-[#9a7918]",
    iconBg: "bg-[#9a7918]",
  },
];

const faqs = [
  {
    q: "How can I track my order?",
    a: "Once your order is dispatched, you'll receive tracking details via email and SMS. You can also monitor real-time updates from your account dashboard under \"My Orders\".",
  },
  {
    q: "Do you offer prescription lenses?",
    a: "Yes, selected frames support prescription lenses. Check the product page for prescription availability, or use our AI stylist to see how frames look on you before ordering.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 14 days of delivery for unused items in original packaging. Prescription lenses and personalized items are final sale. Visit our Returns page for full details.",
  },
  {
    q: "How do I find my frame size?",
    a: "Each product page lists exact dimensions (lens width, bridge width, temple length). Use our size guide or visit a local optical store to measure your current frames for reference.",
  },
  {
    q: "Are your sunglasses UV protected?",
    a: "All VisionHub sunglasses provide UV400 protection, blocking 99-100% of UVA and UVB rays. Polarised options are available for reduced glare while driving or outdoors.",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Protected via Razorpay with SSL encryption",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    desc: contactConfig.responseTime.standard,
  },
  {
    icon: Sparkles,
    title: "Authentic Products",
    desc: "Verified sourcing from trusted brands",
  },
];

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f6f3] min-h-screen">
      <section className="relative overflow-hidden bg-[#101313] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white" />
          <div className="absolute -right-32 -top-10 h-96 w-96 rounded-full border border-white" />
          <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full border border-white" />
        </div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative text-center"
          >
            <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#d5b34b]">
              <span className="h-px w-8 bg-[#d5b34b]" />
              Get in touch
              <span className="h-px w-8 bg-[#d5b34b]" />
            </span>
            <h1 className="font-display mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s talk eyewear.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
              Questions about fit, prescriptions, orders, or finding the right
              frame? Our team is here to help.
            </p>
          </motion.div>
        </Container>
      </section>

      <Container className="px-4 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group rounded-md border border-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${info.accent ? `border-l-4 ${info.accent}` : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${info.iconBg} text-white`}
                  >
                    <info.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-[#111313]">
                      {info.title}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : "_self"}
                        rel={
                          info.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="mt-1 flex items-center gap-1.5 text-sm text-black/55 transition-colors hover:text-[#111313]"
                      >
                        {info.details}
                        {info.href.startsWith("http") && (
                          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-black/55">
                        {info.details}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-black/40">
                      {info.subDetails}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="rounded-md border border-black/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#111313] text-[#d5b34b]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#111313]">
                    Need quick help?
                  </p>
                  <p className="mt-0.5 text-xs text-black/45">
                    Browse our FAQ or visit the help center for instant answers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="rounded-md border border-black/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-black text-[#111313]">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Fill in the details below and we&apos;ll get back to you as
                soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-extrabold uppercase text-[#111313]"
                    >
                      Full name *
                    </Label>
                    <Input
                      disabled={loading}
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-11 rounded-md border-black/15 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#315d55] focus:ring-[#315d55]/15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-extrabold uppercase text-[#111313]"
                    >
                      Email address *
                    </Label>
                    <Input
                      disabled={loading}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-11 rounded-md border-black/15 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#315d55] focus:ring-[#315d55]/15"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="text-xs font-extrabold uppercase text-[#111313]"
                  >
                    Subject *
                  </Label>
                  <Input
                    disabled={loading}
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-md border-black/15 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#315d55] focus:ring-[#315d55]/15"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="message"
                      className="text-xs font-extrabold uppercase text-[#111313]"
                    >
                      Message *
                    </Label>
                    <span className="text-xs text-black/35">
                      {formData.message.length}/1000
                    </span>
                  </div>
                  <Textarea
                    disabled={loading}
                    id="message"
                    name="message"
                    placeholder="Tell us about your inquiry in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    maxLength={1000}
                    required
                    className="resize-none rounded-md border-black/15 text-sm transition-[border-color,box-shadow] duration-200 focus:border-[#315d55] focus:ring-[#315d55]/15"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 overflow-hidden rounded-md border border-red-200 bg-red-50 p-4"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-md bg-[#111313] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#315d55] hover:-translate-y-0.5 hover:shadow-md disabled:transform-none sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-14 lg:mt-20"
        >
          <div className="mb-8 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
              Common questions
            </span>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Quick answers.
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-md border border-black/10 bg-white px-6"
                >
                  <AccordionTrigger className="py-5 text-left text-sm font-extrabold text-[#111313] hover:no-underline hover:text-[#8b6c12]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-black/55">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-14 lg:mt-20"
        >
          <div className="mb-8 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a7918]">
              Why VisionHub
            </span>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[#111313] sm:text-4xl">
              Shop with confidence.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {trustItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group rounded-md border border-black/10 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-[#f6f6f3] text-[#315d55] transition-colors group-hover:bg-[#315d55] group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-extrabold text-[#111313]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-black/50">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSuccess(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm rounded-md border border-black/10 bg-white p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#315d55]/10">
                <CheckCircle className="h-7 w-7 text-[#315d55]" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-extrabold text-[#111313]">
                  Message sent!
                </h3>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Thanks for reaching out. We typically respond within 24 hours
                  during business days.
                </p>
              </div>
              <Button
                onClick={() => setSuccess(false)}
                className="mt-6 h-11 w-full rounded-md bg-[#111313] text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#315d55]"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;
