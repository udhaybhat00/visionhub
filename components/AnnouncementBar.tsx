export default function AnnouncementBar() {
  return (
 <div data-announcement-bar className="bg-shop_dark_green">
  <div className="hidden md:flex justify-center items-center text-white/90 text-xs font-medium tracking-[0.2em] uppercase py-2">
    Premium eyewear / Pan India delivery / Authentic products / Secure payments
  </div>

  <div className="md:hidden overflow-hidden whitespace-nowrap">
    <div className="animate-marquee text-white/90 text-xs py-2">
      Premium eyewear / Pan India delivery / Authentic products / Secure payments
    </div>
  </div>
</div>
  );
}
