"use client";

import { motion } from "motion/react";
import {
  FileText,
  ShoppingCart,
  Shield,
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Scale,
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

const TermsPage = () => {
  const quickLinks = [
    { icon: ShoppingCart, title: "Orders & Purchases", href: "#orders" },
    { icon: CreditCard, title: "Payment Terms", href: "#payment" },
    { icon: Truck, title: "Shipping Policy", href: "#shipping" },
    { icon: Shield, title: "Privacy & Data", href: "#privacy" },
    { icon: Scale, title: "Legal & Disputes", href: "#legal" },
  ];

  const termsData = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle2,
      content: [
        "By accessing and using VisionHub&apos;s website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
        "These terms constitute a legally binding agreement between you and VisionHub. If you do not agree with any part of these terms, you must not use our services.",
        "We may update these terms from time to time. Continued use of our services after changes indicates your acceptance of the modified terms.",
        "These terms apply to all users, including browsers, vendors, customers, merchants, and contributors of content.",
      ],
    },
    {
      id: "orders",
      title: "Orders & Purchases",
      icon: ShoppingCart,
      content: [
        "All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order at our discretion.",
        "Prices are subject to change without notice. The price charged will be the price displayed at the time of purchase.",
        "We strive to display accurate product information, but we do not warrant that product descriptions or pricing is error-free.",
        "By placing an order, you warrant that you are at least 18 years old and legally capable of entering into binding contracts.",
      ],
    },
    {
      id: "payment",
      title: "Payment Terms",
      icon: CreditCard,
      content: [
        "We accept major credit cards, debit cards, PayPal, and other payment methods as displayed at checkout.",
        "All payments must be received before order processing and shipment. Payment authorization may be obtained prior to shipping.",
        "You are responsible for all charges incurred on your account, including applicable taxes and shipping fees.",
        "In case of payment disputes, we will work with you and payment processors to resolve issues fairly and promptly.",
      ],
    },
    {
id: "shipping",
title: "Shipping Policy",
icon: Truck,
content: [
"VisionHub delivers eyewear, sunglasses, computer glasses, prescription frames, sports eyewear, and accessories through trusted delivery partners to eligible service locations.",
"Delivery timelines may vary depending on product availability, customer location, courier operations, and unforeseen circumstances.",
"Customers will receive order confirmation and shipment updates whenever tracking information is available.",
"VisionHub is not responsible for delays caused by natural disasters, transportation disruptions, strikes, government restrictions, or events beyond our reasonable control.",
"If a product arrives damaged due to shipping, customers should contact support with order details and clear photos for review."
],
},
{
id: "privacy",
title: "Privacy & Data Protection",
icon: Shield,
content: [
"VisionHub values your privacy and is committed to protecting your personal information.",
"Customer information is collected only for order processing, customer support, communication, and improving our services.",
"We implement industry-standard security measures to safeguard customer data and payment-related information.",
"VisionHub does not sell, rent, or share customer personal information with third parties for marketing purposes.",
"We may use cookies and similar technologies to improve website functionality, user experience, and performance analytics."
],
},
{
id: "conduct",
title: "User Conduct & Responsibilities",
icon: AlertCircle,
content: [
"Users agree to use VisionHub only for lawful purposes and in compliance with applicable laws and regulations.",
"Any attempt to disrupt, damage, interfere with, or gain unauthorized access to VisionHub systems is strictly prohibited.",
"Customers must provide accurate and up-to-date information during account registration and checkout.",
"Users are responsible for maintaining the confidentiality of their account credentials and activities performed through their account.",
"Fraudulent transactions, misuse of promotions, or abusive behavior may result in account suspension or order cancellation."
],
},
{
id: "intellectual",
title: "Intellectual Property Rights",
icon: FileText,
content: [
"All content available on VisionHub, including logos, product images, graphics, text, designs, and branding materials, is protected by applicable intellectual property laws.",
"No content from VisionHub may be copied, reproduced, distributed, modified, or used commercially without prior written permission.",
"Product names, trademarks, and brand assets displayed on VisionHub remain the property of their respective owners.",
"If you believe any content on VisionHub infringes your intellectual property rights, please contact us with supporting information for review."
],
},
{
id: "legal",
title: "Legal & Liability",
icon: Scale,
content: [
"These Terms & Conditions shall be governed by applicable laws and regulations.",
"VisionHub strives to provide accurate product information, descriptions, and pricing; however, occasional errors may occur and may be corrected without prior notice.",
"VisionHub shall not be liable for indirect, incidental, special, or consequential damages arising from the use of our website, products, or services.",
"Our maximum liability, where permitted by law, shall not exceed the amount paid by the customer for the specific product involved in the claim.",
"By using VisionHub, customers acknowledge and accept these terms and agree to resolve disputes through the appropriate legal channels where applicable."
],
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
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              These Terms & Conditions govern your use of VisionHub and the purchase of eyewear, sunglasses, computer glasses, prescription frames, sports eyewear, accessories, and related products through our platform. They
              outline your rights and responsibilities as a VisionHub user.
            </p>
            <Badge className="mt-6 bg-white/20 text-white border-white/30">
              Last updated: January 2024
            </Badge>
          </motion.div>
        </Container>
      </section>

      {/* Quick Navigation */}
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
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {quickLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-shop_light_green/5 transition-colors group"
                    >
                      <link.icon className="w-8 h-8 text-shop_light_green mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-center text-dark-text group-hover:text-shop_dark_green">
                        {link.title}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {termsData.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AccordionItem value={section.id} id={section.id}>
                    <Card className="overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-shop_light_bg/50 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-2 bg-shop_light_green/10 rounded-lg">
                            <section.icon className="w-5 h-5 text-shop_dark_green" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-shop_dark_green">
                              {index + 1}. {section.title}
                            </h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          {section.content.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-dark-text leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
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
                <Mail className="w-12 h-12 mx-auto mb-4 text-shop_light_green" />
                <h3 className="text-2xl font-bold text-shop_dark_green mb-4">
                  Need Assistance?
                </h3>
                <p className="text-dark-text mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service or need
                  clarification on any section, our legal team is here to help.
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
                    <Link href="/faq">View FAQ</Link>
                  </Button>
                </div>
                <p className="text-sm text-light-text mt-6">
                  For immediate assistance, email us at{" "}
                  <a
                    href="mailto:support@visionhub.in"
                    className="text-shop_light_green hover:underline"
                  >
                    support@visionhub.in
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
              <Calendar className="w-4 h-4 text-shop_light_green" />
              <p className="text-sm text-light-text">
                These Terms & Conditions were last updated on June 1, 2026.
              </p>
            </div>
            <p className="text-xs text-light-text">
                VisionHub is dedicated to providing authentic eyewear, secure transactions, transparent policies, and exceptional customer service.            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TermsPage;
