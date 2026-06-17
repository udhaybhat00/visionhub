import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";
import { cn } from "@/lib/utils";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  const currentPrice = price || 0;

  const discountAmount =
    discount && currentPrice ? (discount * currentPrice) / 100 : 0;

  const grossPrice = currentPrice + discountAmount;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-1">
        {/* Current Price */}
        <PriceFormatter
          amount={currentPrice}
          className={cn(
            "text-shop_dark_green font-semibold",
            className
          )}
        />

        {/* Original Price + Discount */}
        {discount && discountAmount > 0 && (
          <>
            <PriceFormatter
              amount={grossPrice}
              className={twMerge(
                "line-through text-xs font-normal text-zinc-500",
                className
              )}
            />

            <span
              className="
                text-[10px]
                sm:text-xs
                bg-red-100
                text-red-600
                px-1
                sm:px-1.5
                py-0.5
                rounded
                font-medium
                whitespace-nowrap
                shrink-0
              "
            >
              -{discount}%
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceView;