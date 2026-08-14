"use client";
import { Product } from "@/sanity.types";
import { useEffect, useState, memo, useCallback } from "react";
import { toast } from "sonner";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";
import useCartStore from "@/store";
import QuantityButtons from "./QuantityButtons";
import { cn } from "@/lib/utils";
import { Loader2, ShoppingBag } from "lucide-react";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = memo(({ product, className }: Props) => {
  const { addItem, getItemCount } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  // All hooks must be called before any conditional logic
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  // Use useEffect to set isClient to true after component mounts
  // This ensures that the component only renders on the client-side
  // Preventing hydration errors due to server/client mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCart = useCallback(() => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(`${product?.name} added to cart!`, {
        description: `Current quantity: ${itemCount + 1}`,
        duration: 3000,
      });
    } else {
      toast.error("Stock limit reached", {
        description: "Cannot add more than available stock",
        duration: 4000,
      });
    }
  }, [product, itemCount, addItem]);

  // Early return after all hooks have been called - this is crucial for Rules of Hooks
  if (!isClient) {
    return (
      <div className="w-full h-12 flex items-center">
        <Button
          disabled
          className={cn(
            "w-full font-semibold tracking-wide transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
            className
          )}
        >
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding…
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
      <Button
  onClick={handleAddToCart}
  disabled={isOutOfStock}
  className={cn(
    "w-full font-semibold tracking-wide transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
    className
  )}
>
          <ShoppingBag className="w-4 h-4 mr-2" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      )}
    </div>
  );
});

AddToCartButton.displayName = "AddToCartButton";

export default AddToCartButton;
