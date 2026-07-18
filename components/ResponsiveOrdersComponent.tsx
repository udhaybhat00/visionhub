"use client";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";
import Link from "next/link";
import Image from "next/image";
import { productImageUrl } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";

const ResponsiveOrdersComponent = ({
  orders,
}: {
  orders: MY_ORDERS_QUERYResult;
}) => {
  // Helper function to render product images with stacked layout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderProductImages = (products: any[], isCard = false) => {
    if (!products || products.length === 0) return null;

    const maxVisible = isCard ? 2 : 3;
    const displayProducts = products.slice(0, maxVisible);
    const remainingCount = products.length - maxVisible;
    const imageSize = isCard ? "w-10 h-10" : "w-8 h-8";

    return (
      <div className="flex items-center">
        <div className="flex items-center">
          {displayProducts.map((item, index) => {
            const imageUrl = item.product?.images?.[0] || item.product?.image;
            return (
              <div
                key={index}
                className={`relative ${imageSize} rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 ${
                  index > 0 ? "-ml-2" : ""
                }`}
                style={{ zIndex: 30 - index * 10 }}
              >
                {imageUrl ? (
                  <Image
                    src={productImageUrl(imageUrl, 112, 112)}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">?</span>
                  </div>
                )}
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div
              className={`-ml-2 ${imageSize} rounded-full bg-gray-600 border-2 border-white shadow-sm flex items-center justify-center z-10`}
            >
              <span
                className={`${
                  isCard ? "text-sm" : "text-xs"
                } font-semibold text-white`}
              >
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleGenerateInvoice = (orderId: string) => {
    if (!orderId) return;

    window.open(`/invoice/${orderId}`, "_blank");
  };

  const getStatusBadgeVariant = (order: MY_ORDERS_QUERYResult[number]) => {
    if (
      order.paymentStatus === "paid" ||
      order.status === "delivered"
    ) {
      return "bg-green-100 text-green-800";
    } else if (order.status === "cancelled") {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-yellow-100 text-yellow-800";
    }
  };

  const renderInvoiceSection = (order: MY_ORDERS_QUERYResult[number]) => {
    if (order?.paymentStatus === PAYMENT_STATUSES.PAID) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-2 text-xs"
          onClick={() => handleGenerateInvoice(order._id)}
        >
          View Invoice
        </Button>
      );
    }

    return <span className="text-xs text-gray-400">----</span>;
  };

  // Mobile Card View Component
  const OrderCard = ({ order }: { order: MY_ORDERS_QUERYResult[0] }) => (
    <Card className="w-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              Order #{order.orderNumber?.slice(-10) ?? "N/A"}...
            </div>
            <div className="text-xs text-gray-500">
              {order?.orderDate &&
                format(new Date(order.orderDate), "dd/MM/yyyy")}
            </div>
          </div>
          <Badge
            className={`${getStatusBadgeVariant(
              order
            )} text-xs font-medium px-2 py-1 rounded-full shrink-0 ml-2`}
          >
            {order?.status
              ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
              : "Pending"}
          </Badge>
        </div>
      </CardHeader>{" "}
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="flex items-center gap-2 text-sm">
          <div className="font-medium">{order.customerName}</div>
          <div className="text-gray-500">•</div>
          <div className="text-gray-600 truncate">{order.email}</div>
        </div>

        {/* Products */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Products:</span>
            {renderProductImages(order.products || [], true)}
          </div>
          <div className="font-semibold">
            <PriceFormatter amount={order?.totalPrice} className="text-black" />
          </div>
        </div>

        {/* Invoice Section */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Invoice:</span>
            {renderInvoiceSection(order)}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 sm:flex-none min-w-20 h-10"
            >
              <Link
                href={`/user/orders/${order._id}`}
                className="flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span className="text-sm">View</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      {/* Mobile Card View - Hidden on large screens */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Order #
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Products
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Total
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Invoice
                </th>
                <th className="text-left py-3 px-2 font-medium text-sm text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-2">
                    <div className="font-medium text-sm">
                      {order.orderNumber?.slice(-10) ?? "N/A"}...
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm">
                    {order?.orderDate &&
                      format(new Date(order.orderDate), "dd/MM/yyyy")}
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-medium text-sm">
                      {order.customerName}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600">
                    <div className="truncate max-w-40">{order.email}</div>
                  </td>
                  <td className="py-4 px-2">
                    {renderProductImages(order.products || [])}
                  </td>
                  <td className="py-4 px-2">
                    <PriceFormatter
                      amount={order?.totalPrice}
                      className="font-medium text-sm"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <Badge
                      className={`${getStatusBadgeVariant(
                        order
                      )} text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      {order?.status
                        ? order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        : "Pending"}
                    </Badge>
                  </td>
                  <td className="py-4 px-2">{renderInvoiceSection(order)}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-start gap-1 xl:gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="min-w-[70px] xl:min-w-20"
                      >
                        <Link
                          href={`/user/orders/${order._id}`}
                          className="flex items-center justify-center"
                        >
                          <Eye className="w-3 h-3 xl:mr-1" />
                          <span className="hidden xl:inline ml-1">View</span>
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveOrdersComponent;
