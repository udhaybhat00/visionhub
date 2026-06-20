"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  ChevronDown,
  CreditCard,
  Headphones,
  LockKeyhole,
  Truck,
  MapPin,
  ShoppingBag,
  Package,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import useCartStore, { CartItem } from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { toast } from "sonner";
import { PAYMENT_METHODS, PaymentMethod } from "@/lib/orderStatus";
import { OrderAddressSelector } from "@/components/checkout/OrderAddressSelector";
import { CheckoutSkeleton } from "@/components/checkout/CheckoutSkeleton";
import { OrderPlacementOverlay } from "@/components/cart/OrderPlacementSkeleton";
import { motion } from "framer-motion";
import AiStylistCTA from "@/components/AiStylistCTA";

interface OrderAddress {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
  lastUsed: string;
  orderNumber: string;
  source: "order";
}

const progressSteps = ["Cart", "Address", "Payment", "Review", "Success"];

const trustItems = [
  { label: "100% Authentic Products", icon: BadgeCheck },
  { label: "Secure Payments", icon: ShieldCheck },
  { label: "Fast Shipping", icon: Truck },
  { label: "Expert Support", icon: Headphones },
];

function CheckoutProgress() {
  return (
    <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="relative">
        <div className="absolute left-5 right-5 top-4 h-0.5 bg-gray-100" />
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "62%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-5 top-4 h-0.5 bg-gray-950"
        />
        <div className="relative flex justify-between">
          {progressSteps.map((item, index) => {
            const active = index <= 2;
            return (
              <div key={item} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-gray-950 text-white shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index < 2 ? "✓" : index + 1}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    active ? "text-gray-950" : "text-gray-400"
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CheckoutContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const {
    items: cart,
    resetCart,
    getSubTotalPrice,
    getTotalDiscount,
  } = useCartStore();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PAYMENT_METHODS.RAZORPAY);
  const [selectedAddress, setSelectedAddress] = useState<OrderAddress | null>(
    null
  );
  const [addresses, setAddresses] = useState<OrderAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [actionType, setActionType] = useState<"pay" | "order" | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [orderStep, setOrderStep] = useState<
    "validating" | "creating" | "emailing" | "redirecting"
  >("validating");
  const [hasInitialCart, setHasInitialCart] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<{
    isBusiness: boolean;
    isActive: boolean;
  } | null>(null);

  const [couponCode, setCouponCode] = useState("");
const [couponDiscount, setCouponDiscount] = useState(0);
  

  // New pricing structure
  const grossSubtotal = getSubTotalPrice(); // Gross amount (before discount)
  const totalDiscount = getTotalDiscount(); // Total discount amount
  const currentSubtotal = grossSubtotal - totalDiscount; // After discount

  // Business account discount (2% additional discount)
  const businessDiscount = userProfile?.isBusiness ? currentSubtotal * 0.02 : 0;
  const finalSubtotal = currentSubtotal - businessDiscount;

  const shipping = finalSubtotal > 100 ? 0 : 10;
  const tax = finalSubtotal * (parseFloat(process.env.TAX_AMOUNT || "0") || 0);
  const total =
  finalSubtotal +
  shipping +
  tax -
  couponDiscount;

  // Fetch user profile for business account status
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      try {
        const response = await fetch("/api/user/status");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUserProfile({
              isBusiness: data.user.isBusiness || false,
              isActive: data.user.isActive || false,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (user && isLoaded) {
      fetchUserProfile();
    }
  }, [user, isLoaded]);

  // Fetch user addresses from previous orders
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      try {
        const response = await fetch(
          `/api/orders/addresses?email=${encodeURIComponent(
            user.emailAddresses[0].emailAddress
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);

          // Set default address (most recently used)
          const defaultAddress = data.addresses?.find(
            (addr: OrderAddress) => addr.default
          );
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else if (data.addresses?.length > 0) {
            setSelectedAddress(data.addresses[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (isLoaded && user) {
      fetchAddresses();
    }
  }, [isLoaded, user]);

  // Read address from URL parameters (when coming from cart)
  useEffect(() => {
    const addressParam = searchParams.get("address");
    if (addressParam) {
      try {
        const decodedAddress = JSON.parse(decodeURIComponent(addressParam));
        // Convert regular address to OrderAddress format
        const orderAddress: OrderAddress = {
          _id: decodedAddress._id,
          name: decodedAddress.name,
          email: decodedAddress.email,
          address: decodedAddress.address,
          city: decodedAddress.city,
          state: decodedAddress.state,
          zip: decodedAddress.zip,
          default: decodedAddress.default,
          createdAt: decodedAddress.createdAt,
          lastUsed: new Date().toISOString(),
          orderNumber: "cart-selected",
          source: "order" as const,
        };
        setSelectedAddress(orderAddress);

        // Show success message
        toast.success("Ready for Checkout! 🛒", {
          description:
            "Complete your order by selecting a payment method below",
          duration: 4000,
        });
      } catch (error) {
        console.error("Error parsing address from URL:", error);
        toast.error("Error loading address from cart");
      }
    }
  }, [searchParams]);

 useEffect(() => {
  const validateCoupon = async () => {
    const code = searchParams.get("couponCode");

    if (!code) return;

    try {
      const response = await fetch("/api/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          subtotal: currentSubtotal,
        }),
      });

      const data = await response.json();

      if (!data.success) return;

      const coupon = data.coupon;

      let discount = 0;

      if (coupon.discountType === "percentage") {
        discount =
          (currentSubtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      setCouponCode(coupon.code);
      setCouponDiscount(discount);
    } catch (error) {
      console.error("Coupon validation failed:", error);
    }
  };

  validateCoupon();
}, [searchParams, currentSubtotal]);

  // Track initial cart state and redirect if empty
  useEffect(() => {
    if (hasInitialCart === null && isLoaded && cart !== undefined) {
      setHasInitialCart(cart.length > 0);

      // If cart is empty on initial load, redirect to cart
      if (cart.length === 0) {
        window.location.href = "/cart";
        return;
      }
    }
  }, [cart, hasInitialCart, isLoaded]);


  const handleRazorpayPayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setActionType("pay");
    setIsPlacingOrder(true);
    setOrderStep("creating");

    const response = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          product: {
            _id: item.product._id,
          },
          quantity: item.quantity,
        })),
        shippingAddress: selectedAddress,
        couponCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      toast.error(errorData?.error || "Failed to create Razorpay order");

      setIsPlacingOrder(false);
      setActionType(null);
      return;
    }

    const order = await response.json();
    setIsPlacingOrder(false);
    setActionType(null);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: order.amount,
      currency: "INR",
      name: "VisionHub",
      description: "Eyewear Purchase",
      order_id: order.id,
      prefill: {
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
      },

      handler: async function (response: any) {
        try {
          const verifyResponse = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const result = await verifyResponse.json();

          if (!result.success) {
            toast.error("Payment verification failed");
            return;
          }

          const finalizedOrder = result.order;
          const orderId = finalizedOrder?.orderId || order.localOrderId;
          const orderNumber = finalizedOrder?.orderNumber || order.orderNumber;

          toast.success("Payment successful!");
          setIsRedirecting(true);
          resetCart();
          window.location.href = `/success?order_id=${orderId}&orderNumber=${orderNumber}`;
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed");
        }
      },

      theme: {
        color: "#1B4332",
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.on("payment.failed", function () {
      setIsPlacingOrder(false);
      setActionType(null);
      window.location.href = `/payment-failed?order_id=${order.localOrderId}&orderNumber=${order.orderNumber}`;
    });

    razorpay.open();
  };

  if (!isLoaded) {
    return <CheckoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          Please sign in to proceed with checkout.
        </p>
      </div>
    );
  }

  // Show loading during redirect process
  if (isRedirecting) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
        <h2 className="text-xl font-semibold mb-2">Processing your order...</h2>
        <p className="text-muted-foreground">
          Please wait while we redirect you to complete your payment.
        </p>
      </div>
    );
  }

  // If cart is empty and we had an initial cart, show loading (likely during order processing)
  if ((!cart || cart.length === 0) && hasInitialCart) {
    return <CheckoutSkeleton />;
  }

  // If cart is empty and no initial cart, this shouldn't happen due to redirect
  // But show fallback just in case
  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-10 animate-in fade-in-0 duration-500">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">
          Add some products to continue with checkout
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href="/shop">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  const summary = (
    <Card className="overflow-hidden rounded-[28px] border-gray-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          Order Summary
          <span className="text-xs font-medium text-gray-500">{cart.length} items</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">
        <div className="max-h-72 space-y-3 overflow-auto pr-1">
          {cart.map((item: CartItem) => {
            const price = item.product.price || 0;
            const discount = item.product.discount || 0;
            const original = price + (discount * price) / 100;
            const saved = Math.max(0, original - price) * item.quantity;
            return (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 rounded-2xl border border-gray-100 p-3"
              >
                <Image
                  src={item.product.images?.[0] ? urlFor(item.product.images[0]).url() : "/placeholder.jpg"}
                  alt={item.product.name || "Product"}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-950">{item.product.name}</p>
                  <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
                  {saved > 0 && <p className="mt-1 text-xs font-medium text-emerald-700">Saved <PriceFormatter amount={saved} /></p>}
                </div>
                <div className="text-right">
                  <PriceFormatter amount={price * item.quantity} className="text-sm text-gray-950" />
                  {discount > 0 && <p className="text-xs text-gray-400 line-through">₹{(original * item.quantity).toFixed(2)}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Original price</span><PriceFormatter amount={grossSubtotal} /></div>
          {totalDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Product discount</span><span>-₹{totalDiscount.toFixed(2)}</span></div>}
          {businessDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Business savings</span><span>-₹{businessDiscount.toFixed(2)}</span></div>}
          {couponDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Coupon {couponCode}</span><span>-₹{couponDiscount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Tax</span><PriceFormatter amount={tax} /></div>
        </div>
        <Separator />
        <div className="flex items-end justify-between">
          <span className="text-sm text-gray-500">Final Total</span>
          <PriceFormatter amount={total} className="text-2xl font-bold text-gray-950" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-28 lg:pb-0">
      <CheckoutProgress />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-[28px] border-gray-100 bg-white shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5" /> Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                {isLoadingAddresses ? (
                  <div className="space-y-3">
                    <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                    <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                  </div>
                ) : searchParams.get("address") && selectedAddress ? (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-950">{selectedAddress.name}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-500">{selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                        {selectedAddress.email && <p className="text-sm text-gray-500">{selectedAddress.email}</p>}
                      </div>
                      <span className="rounded-full bg-gray-950 px-3 py-1 text-xs font-medium text-white">Selected</span>
                    </div>
                  </div>
                ) : (
                  <OrderAddressSelector addresses={addresses} selectedAddress={selectedAddress} onAddressSelect={setSelectedAddress} isLoading={isLoadingAddresses} />
                )}
              </CardContent>
            </Card>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="rounded-[28px] border-gray-100 bg-white shadow-sm">
              <CardHeader className="p-5">
                <CardTitle className="flex items-center gap-2 text-lg"><LockKeyhole className="h-5 w-5" /> Secure Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0">
                <div className="rounded-3xl border border-gray-950 bg-gray-950 p-5 text-white shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Razorpay</p>
                      <h3 className="mt-2 text-xl font-semibold">Encrypted online payment</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-300">Pay securely with cards, UPI, wallets, or netbanking.</p>
                    </div>
                    <CreditCard className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Secure Checkout", "Encrypted Payments", "Fast Delivery", "Warranty Support"].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-2xl bg-gray-50 p-3 text-sm font-medium text-gray-700">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" /> {item}
                    </div>
                  ))}
                </div>
                <Button onClick={handleRazorpayPayment} disabled={isPlacingOrder || !selectedAddress || cart.length === 0} className="hidden h-[52px] w-full rounded-full bg-gray-950 text-base font-semibold hover:bg-black lg:flex">
                  {isPlacingOrder && actionType === "pay" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : <>Pay Securely <PriceFormatter amount={total} className="ml-2 text-white" /></>}
                </Button>
              </CardContent>
            </Card>
          </motion.section>

          <div className="grid gap-3 sm:grid-cols-4">
            {trustItems.map(({ label, icon: Icon }) => (
              <motion.div key={label} whileHover={{ y: -2 }} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <Icon className="h-5 w-5 text-gray-950" />
                <p className="mt-3 text-sm font-semibold text-gray-900">{label}</p>
              </motion.div>
            ))}
          </div>

          <AiStylistCTA compact />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6">{summary}</div>
        </aside>

        <div className="lg:hidden">
          <button onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="mb-3 flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 font-semibold shadow-sm">
            Order summary <ChevronDown className={`h-4 w-4 transition ${isSummaryOpen ? "rotate-180" : ""}`} />
          </button>
          {isSummaryOpen && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{summary}</motion.div>}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[72px] z-50 border-t border-gray-100 bg-white/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <Button onClick={handleRazorpayPayment} disabled={isPlacingOrder || !selectedAddress || cart.length === 0} className="h-[52px] w-full rounded-full bg-gray-950 text-base font-semibold hover:bg-black">
          {isPlacingOrder && actionType === "pay" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : <>Pay Securely <PriceFormatter amount={total} className="ml-2 text-white" /></>}
        </Button>
      </div>

      {isPlacingOrder && (
        <OrderPlacementOverlay
          step={orderStep}
          isCheckoutRedirect={actionType === "pay"}
        />
      )}
    </div>
  );
}
