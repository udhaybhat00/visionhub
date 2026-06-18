import { backendClient } from "@/sanity/lib/backendClient";
export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

type RequestCartItem = {
  product?: {
    _id?: string;
  };
  quantity?: number;
};

type SanityProduct = {
  _id: string;
  name?: string;
  price?: number;
  discount?: number;
  stock?: number;
  category?: string;
};

export type ValidatedCartItem = {
  product: SanityProduct;
  quantity: number;
};

export type CartSummary = {
  grossSubtotal: number;
  totalDiscount: number;
  currentSubtotal: number;
};

export async function validateCartItems(
  items: unknown
): Promise<ValidatedCartItem[]> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutValidationError("No items provided");
  }

  const requestedQuantities = new Map<string, number>();

  for (const item of items as RequestCartItem[]) {
    const productId = item.product?._id;
    const quantity = item.quantity;

    if (!productId || typeof productId !== "string") {
      throw new CheckoutValidationError("Invalid item quantity");
    }

  if (
  typeof quantity !== "number" ||
  !Number.isInteger(quantity) ||
  quantity <= 0
) {
  throw new CheckoutValidationError("Invalid item quantity");
}

const requestedQuantity = quantity;

requestedQuantities.set(
  productId,
  (requestedQuantities.get(productId) || 0) + requestedQuantity
);
  }

  const productIds = Array.from(requestedQuantities.keys());
  const products = await backendClient.fetch<SanityProduct[]>(
    `*[_type == "product" && _id in $ids]{
      _id,
      name,
      price,
      discount,
      stock,
      "category": categories[0]->title
    }`,
    { ids: productIds }
  );

  const productsById = new Map(products.map((product) => [product._id, product]));
  const validatedItems: ValidatedCartItem[] = [];

  for (const productId of productIds) {
    const product = productsById.get(productId);
    const requestedQuantity = requestedQuantities.get(productId) || 0;

    if (!product) {
      throw new CheckoutValidationError(
  "One or more products are no longer available"
);
    }

    const availableStock =
      typeof product.stock === "number" ? product.stock : 0;

    if (availableStock <= 0) {
      throw new CheckoutValidationError(
  `${product.name || "An item"} is out of stock`
);
    }

    if (requestedQuantity > availableStock) {
     throw new CheckoutValidationError(
  `${product.name || "An item"} only has ${availableStock} in stock`
);
    }

    validatedItems.push({
      product: {
        ...product,
        stock: availableStock,
        price: product.price || 0,
        discount: product.discount || 0,
      },
      quantity: requestedQuantity,
    });
  }

  return validatedItems;
}

export function calculateCartSummary(items: ValidatedCartItem[]): CartSummary {
  return items.reduce(
    (summary, item) => {
      const currentPrice = item.product.price || 0;
      const discount = item.product.discount || 0;
      const discountAmount = (discount * currentPrice) / 100;
      const grossPrice = currentPrice + discountAmount;

      summary.grossSubtotal += grossPrice * item.quantity;
      summary.totalDiscount += discountAmount * item.quantity;
      summary.currentSubtotal += currentPrice * item.quantity;

      return summary;
    },
    {
      grossSubtotal: 0,
      totalDiscount: 0,
      currentSubtotal: 0,
    }
  );
}

export async function getBusinessDiscountRate(email?: string): Promise<number> {
  if (!email) {
    return 0;
  }

  const user = await backendClient.fetch<{ isBusiness?: boolean } | null>(
    `*[_type == "userType" && email == $email][0]{ isBusiness }`,
    { email }
  );

  return user?.isBusiness ? 0.02 : 0;
}
