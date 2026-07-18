"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { CartItem } from "@/store";
import { toast } from "sonner";

interface Address {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
}

interface CheckoutButtonProps {
  cart: CartItem[];
  selectedAddress: Address | null;
  couponCode?: string;
}

export function CheckoutButton({
  cart,
  selectedAddress,
  couponCode,
}: CheckoutButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    // Check stock status
    const outOfStockItems = cart.filter((item) => item.product.stock === 0);
    if (outOfStockItems.length > 0) {
      toast.error(
        "Some items are out of stock. Please remove them to continue."
      );
      return;
    }

    setIsRedirecting(true);

    const addressParam = encodeURIComponent(
      JSON.stringify(selectedAddress)
    );
    window.location.href =
      `/checkout?address=${addressParam}` +
      `&couponCode=${couponCode || ""}`;
  };

  const hasOutOfStockItems = cart.some((item) => item.product.stock === 0);

  return (
    <div className="space-y-4">
        {hasOutOfStockItems && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              Some items are out of stock and need to be removed
            </p>
          </div>
        )}

        {!selectedAddress && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-700">
              Please select a shipping address to continue
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleCheckout}
            disabled={
              isRedirecting ||
              hasOutOfStockItems ||
              !selectedAddress ||
              cart.length === 0
            }
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isRedirecting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </div>
            )}
          </Button>

        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>🔒 Secure checkout powered by Razorpay</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
    </div>
  );
}
