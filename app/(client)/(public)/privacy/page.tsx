"use client";

import { motion } from "motion/react";
import {
  Shield,
  Eye,
  Lock,
  Cookie,
  Database,
  UserCheck,
  AlertTriangle,
  Download,
  Trash2,
  Settings,
  Mail,
  Clock,
} from "lucide-react";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const PrivacyPage = () => {
  const privacyHighlights = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Your information is securely protected using industry-standard practices",
      color: "text-shop_dark_green",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We clearly explain how and why your information is used",
      color: "text-shop_light_green",
    },
    {
      icon: UserCheck,
      title: "Your Control",
      description: "Access, update, or request changes to your personal information",
      color: "text-shop_orange",
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "Secure handling of orders, payments, and customer information",
      color: "text-shop_dark_green",
    },
  ];

  const dataTypes = [
    {
      category: "Account Information",
      items: [
        "Name and contact details",
        "Account credentials",
        "Profile preferences",
        "Communication history",
      ],
      icon: UserCheck,
    },
    {
      category: "Purchase Data",
      items: [
        "Order history",
        "Payment information",
        "Shipping addresses",
        "Order-related communications",
      ],
      icon: Database,
    },
    {
      category: "Usage Analytics",
      items: [
        "Website interactions",
        "Feature usage patterns",
        "Performance metrics",
        "Error logs",
      ],
      icon: Eye,
    },
    {
      category: "Device Information",
      items: [
        "Browser and device type",
        "IP address",
        "Operating system",
        "Cookies and website preferences",
      ],
      icon: Settings,
    },
  ];

  const userRights = [
    {
      right: "Access Your Data",
      description:
        "Request a copy of all personal information we have about you",
      icon: Download,
      action: "Request Data Export",
    },
    {
      right: "Update Information",
      description: "Correct or update any inaccurate personal information",
      icon: Settings,
      action: "Manage Profile",
    },
    {
      right: "Delete Account",
      description:
        "Request complete removal of your account and associated data",
      icon: Trash2,
      action: "Delete Account",
    },
    {
      right: "Control Communications",
      description: "Manage email preferences and marketing communications",
      icon: Mail,
      action: "Email Settings",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-shop_light_bg to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-shop_dark_green to-shop_light_green text-white">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              At VisionHub, protecting your personal information is a priority.
This Privacy Policy explains how we collect, use, store, and safeguard
your data when you browse our website or purchase eyewear products.
            </p>
            <Badge className="mt-6 bg-white/20 text-white border-white/30">
              Last updated: June 2026
            </Badge>
          </motion.div>
        </Container>
      </section>

      {/* Privacy Highlights */}
      <section className="py-12 -mt-8">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-shop_dark_green">
                  Our Privacy Commitments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {privacyHighlights.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-center group"
                    >
                      <div className="p-3 bg-shop_light_green/10 rounded-lg w-fit mx-auto mb-3 group-hover:bg-shop_light_green/20 transition-colors">
                        <item.icon
                          className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform`}
                        />
                      </div>
                      <h3 className="font-semibold text-shop_dark_green mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-dark-text">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Data Collection */}
      <section className="py-12">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-shop_light_green/10 text-shop_dark_green hover:bg-shop_light_green/20">
              Data We Collect
            </Badge>
            <h2 className="text-3xl font-bold text-shop_dark_green mb-4">
              Types of Information We Process
            </h2>
            <p className="text-lg text-dark-text max-w-3xl mx-auto">
              We collect different types of information to provide you with the
              best shopping experience while respecting your privacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {dataTypes.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-shop_dark_green">
                      <div className="p-2 bg-shop_light_green/10 rounded-lg">
                        <category.icon className="w-5 h-5 text-shop_light_green" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-shop_light_green rounded-full mt-2 flex-shrink-0" />
                          <span className="text-dark-text text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="py-12 bg-shop_light_bg">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-shop_dark_green mb-4">
              Detailed Privacy Policy
            </h2>
            <p className="text-lg text-dark-text">
              Complete information about how we handle your data
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="collection">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Information Collection & Use
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      We collect information to provide better services to all
                      users. The information we collect falls into several
                      categories:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>
                        • Information provided during account registration and checkout
                      </li>
                      <li>
                        • Shipping, billing, and contact details required to process orders
                      </li>
                      <li>
                        • Communications sent through customer support forms or email
                      </li>
                      <li>
                        • Website usage information collected to improve performance and customer experience
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="sharing">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Information Sharing & Disclosure
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      We do not sell, trade, or rent your personal information
                      to third parties. We may share information only in these
                      limited circumstances:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>
                        • Trusted payment providers to securely process transactions
                      </li>
                      <li>
                        • Delivery partners responsible for order fulfillment
                      </li>
                      <li>
                        • Service providers assisting with website operations
                      </li>
                      <li>
                        • Legal authorities when required by law
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="security">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Data Security & Protection
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      We implement industry-standard security measures to
                      protect your information:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>• SSL encryption for all data transmission</li>
                      <li>
                        • Secure data storage with regular security audits
                      </li>
                      <li>
                        • Access controls limiting who can view your information
                      </li>
                      <li>• Regular security training for our team members</li>
                      <li>
                        • Incident response procedures for potential breaches
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="cookies">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Cookie className="w-5 h-5 text-shop_light_green" />
                    <span className="text-lg font-semibold text-shop_dark_green">
                      Cookies & Tracking Technologies
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-dark-text">
                    <p>
                      We use cookies and similar technologies to enhance your
                      browsing experience:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li>• Essential cookies for website functionality</li>
                      <li>• Analytics cookies to understand usage patterns</li>
                      <li>
                        • Optional analytics cookies used to improve website performance (with
                        consent)
                      </li>
                      <li>• Preference cookies to remember your settings</li>
                    </ul>
                    <p className="mt-4">
                      You can control cookie preferences through your browser
                      settings or our cookie preference center.
                    </p>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </Container>
      </section>

      {/* Your Rights */}
      <section className="py-16">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-shop_orange/10 text-shop_orange hover:bg-shop_orange/20">
              Your Privacy Rights
            </Badge>
            <h2 className="text-3xl font-bold text-shop_dark_green mb-4">
              Control Your Data
            </h2>
            <p className="text-lg text-dark-text max-w-3xl mx-auto">
              You have the right to control how your personal information is
              collected, used, and shared. Here&apos;s what you can do:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {userRights.map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 bg-shop_light_green/10 rounded-lg group-hover:bg-shop_light_green/20 transition-colors">
                        <right.icon className="w-5 h-5 text-shop_light_green" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-shop_dark_green mb-2">
                          {right.right}
                        </h3>
                        <p className="text-dark-text text-sm mb-4">
                          {right.description}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green/5"
                        >
                          {right.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-shop_light_bg">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="text-center">
              <CardContent className="p-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-shop_orange" />
                <h3 className="text-2xl font-bold text-shop_dark_green mb-4">
                  Questions About Your Privacy?
                </h3>
                <p className="text-dark-text mb-6 max-w-2xl mx-auto">
                  If you have questions about how your information is collected,
stored, or used, our support team will be happy to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-shop_dark_green hover:bg-shop_btn_dark_green"
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-shop_light_green text-shop_light_green hover:bg-shop_light_green/5"
                  >
                    <Link href="/faq">Privacy FAQ</Link>
                  </Button>
                </div>
                <p className="text-sm text-light-text mt-6">
                  Email us directly at{" "}
                  <a
                    href="mailto:shivam@gmail.com"
                    className="text-shop_light_green hover:underline"
                  >
                    shivam@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Footer Note */}
      <section className="py-8 border-t border-gray-200">
        <Container className="max-w-4xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-shop_light_green" />
              <p className="text-sm text-light-text">
                This Privacy Policy was last updated on June 1, 2026
              </p>
            </div>
            <p className="text-xs text-light-text">
              VisionHub may update this Privacy Policy periodically to reflect changes in our services, legal requirements, or security practices.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PrivacyPage;
