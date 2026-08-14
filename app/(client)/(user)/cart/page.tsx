import Container from "@/components/Container";
import { ClientCartContent } from "@/components/cart/ClientCartContent";
import { ShoppingBag } from "lucide-react";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";

function CartPage() {
  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <DynamicBreadcrumb />

      {/* Cart Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-5 w-5 text-amber-brand" />
        <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">
          Shopping Cart
        </h1>
      </div>

      {/* Client Cart Content with Loading */}
      <ClientCartContent />
    </Container>
  );
}

export default CartPage;
