export default function AnnouncementBar() {
  return (
 <div className="bg-gradient-to-r from-shop_dark_green to-shop_light_green">
  <div className="hidden md:flex justify-center items-center text-white text-sm py-2">
    👓 Premium Eyewear Collection • 🚚 Pan India Delivery • ⭐ 100% Authentic Products • 🔒 Secure Payments
  </div>

  <div className="md:hidden overflow-hidden whitespace-nowrap">
    <div className="animate-marquee text-white text-xs py-2">
      👓 Premium Eyewear Collection • 🚚 Pan India Delivery • ⭐ 100% Authentic Products • 🔒 Secure Payments
    </div>
  </div>
</div>
  );
}