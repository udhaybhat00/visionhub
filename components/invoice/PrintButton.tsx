"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-8 bg-black text-white px-4 py-2 rounded print:hidden"
    >
      Print / Save PDF
    </button>
  );
}