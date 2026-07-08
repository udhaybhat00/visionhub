import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import PrintButton from "@/components/invoice/PrintButton";
import Image from "next/image";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const user = await currentUser();

  if (!user) return notFound();

  const { orderId } = await params;

 const order = await writeClient.fetch(
  `*[_type=="order" && _id==$orderId][0]{
    _id,
    orderNumber,
    orderDate,
    customerName,
    email,
    totalPrice,
    paymentMethod,
    paymentStatus,
    status,
    address,
    products[]{
      quantity,
      product->{
        name,
        price
      }
    }
  }`,
  { orderId }
);

  if (!order) return notFound();

  return (
  <div className="relative max-w-5xl mx-auto p-10 bg-white shadow-lg border rounded-lg">
     <div className="flex justify-between items-start mb-8">
 <div className="flex items-center gap-4">
 <Image
  src="/logo.png"
  alt="VisionHub"
  width={160}
  height={50}
  className="object-contain"
/>

  <div>
    <h1 className="text-4xl font-bold">
      VISIONHUB
    </h1>

    <p className="text-gray-500">
      Premium Eyewear & Sunglasses
    </p>
  </div>
</div>

  <div className="text-right">
    <h2 className="text-4xl font-bold tracking-wide">
  INVOICE
</h2>

   <p className="text-gray-600 mt-2">
  Invoice #{order.orderNumber}
</p>

    <div className="mt-2 flex justify-end">
  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
    PAID
  </span>
</div>
  </div>
</div>


      <hr className="my-6" />

   <h2 className="font-bold text-xl mb-3">
  Customer Details
</h2>

<div className="bg-gray-50 p-3 rounded-lg">
  <p className="font-semibold">{order.customerName}</p>
  <p>{order.email}</p>

  <div className="mt-3">
    <p>{order.address?.name}</p>
    <p>{order.address?.address}</p>
    <p>
      {order.address?.city}, {order.address?.state}
    </p>
    <p>{order.address?.zip}</p>
  </div>
</div>

      <hr className="my-6" />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
  <div>
    <h3 className="font-bold text-lg mb-2">
      Sold By
    </h3>

   <p className="font-semibold">
  VisionHub Eyewear
</p>

<p>Jammu, India</p>

<p>GSTIN: Not Applicable</p>

<p>Email: support@visionhub.in</p>

<p>Website: www.visionhub.in</p>

<p>Phone: +91 XXXXX XXXXX</p>
  </div>

  <div>
    <h3 className="font-bold text-lg mb-2">
      Invoice Details
    </h3>

    <p>Invoice No: {order.orderNumber}</p>

    <p>
      Date:
      {" "}
      {new Date(order.orderDate).toLocaleDateString()}
    </p>
  </div>
</div>

      <div className="mt-8">
  <h2 className="text-xl font-bold mb-4">
    Order Items
  </h2>

  <div className="mt-4 border rounded-lg p-4 bg-gray-50 break-inside-avoid">
  <h3 className="font-bold text-lg mb-3">
    Payment Details
  </h3>

  <div className="space-y-2">
    <p>
      <strong>Payment Method:</strong>{" "}
      <span className="font-semibold">
  Razorpay
</span>
    </p>

    <p>
      <strong>Payment Status:</strong>{" "}
      <span className="text-green-600 font-semibold">
  {String(order.paymentStatus).charAt(0).toUpperCase() +
    String(order.paymentStatus).slice(1)}
</span>
    </p>

    <p>
      <strong>Order Status:</strong>{" "}
      <span className="text-blue-600 font-semibold">
  {String(order.status).charAt(0).toUpperCase() +
    String(order.status).slice(1)}
</span>
    </p>
  </div>
</div>



  <table className="w-full border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="text-left p-3">Product</th>
        <th className="text-center p-3">Qty</th>
        <th className="text-right p-3">Price</th>
        <th className="text-right p-3">Total</th>
      </tr>
    </thead>

    <tbody>
      {order.products?.map((item: any, index: number) => (
        <tr key={index} className="border-t">
          <td className="p-3">
            {item.product?.name}
          </td>

          <td className="text-center p-3">
            {item.quantity}
          </td>

          <td className="text-right p-3">
            ₹{item.product?.price}
          </td>

          <td className="text-right p-3">
            ₹{item.product?.price * item.quantity}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  
  <div className="flex justify-end mt-4">
  <div className="w-80">
    <div className="flex justify-between py-2">
      <span>Subtotal</span>
      <span>₹{order.totalPrice}</span>
    </div>

    <div className="flex justify-between py-2">
      <span>Shipping</span>
      <span>₹0</span>
    </div>

    <div className="flex justify-between py-2">
      <span>Tax</span>
      <span>₹0</span>
    </div>

    <div className="flex justify-between py-3 border-t font-bold text-xl">
      <span>Grand Total</span>
      <span>₹{order.totalPrice}</span>
    </div>
  </div>
</div>

</div>
<div className="mt-8">
  <PrintButton />
</div>

<div className="mt-10 text-right">
  <p className="text-sm text-gray-500 mb-2">
    Authorized Signatory
  </p>

  <p
    className="text-3xl italic font-semibold"
    style={{ fontFamily: "cursive" }}
  >
    Shivam
  </p>

  <p className="font-medium mt-1">
    Founder & CEO
  </p>

  <p className="text-sm text-gray-500">
    VisionHub Eyewear
  </p>
</div>

<div className="mt-6 text-center text-gray-500 text-sm">
  <hr className="my-8" />

  <p>
    Thank you for shopping with VisionHub.
  </p>

  <p>
    This is a computer-generated invoice and does not require a physical signature.
  </p>
</div>
    </div>
  );
}
