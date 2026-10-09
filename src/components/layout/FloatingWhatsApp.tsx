import { useEffect, useRef, useState } from "react";

const WHATSAPP_URL =
  "https://wa.me/918378913269?text=" +
  encodeURIComponent(
    "Hello Jai Janardan Auto, I am interested in your vehicles. Please share more details."
  );

export default function FloatingWhatsApp() {
  const floatingRef = useRef<HTMLDivElement>(null);
  const [lift, setLift] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const floating = floatingRef.current?.getBoundingClientRect();
      const footer = document.querySelector("footer");
      const footerTargets = [
        footer
          ?.querySelector<HTMLElement>('button[aria-label="Back to top"]')
          ?.getBoundingClientRect(),
        [...(footer?.querySelectorAll("p") ?? [])]
          .find((paragraph) =>
            paragraph.textContent?.includes("All rights reserved")
          )
          ?.getBoundingClientRect(),
      ]
        .filter((target) => target !== undefined)
        .sort((first, second) => second.top - first.top);

      if (!floating) {
        setLift(0);
        return;
      }

      const defaultTop = floating.top + lift;
      let requiredLift = 0;

      for (const target of footerTargets) {
        const candidateTop = defaultTop - requiredLift;
        const overlaps =
          floating.left < target.right &&
          floating.right > target.left &&
          candidateTop < target.bottom &&
          candidateTop + floating.height > target.top;

        if (overlaps) {
          requiredLift = defaultTop + floating.height - target.top + 8;
        }
      }

      setLift(requiredLift);
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [lift]);

  return (
    <div
      ref={floatingRef}
      style={{ transform: lift ? `translateY(-${lift}px)` : undefined }}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-[calc(env(safe-area-inset-right)+1rem)] z-[60] sm:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:right-[calc(env(safe-area-inset-right)+1.5rem)]"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jai Janardan Auto on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a24b] active:scale-95"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          fill="none"
          className="h-8 w-8"
        >
          <path
            d="M16 3.25A12.7 12.7 0 0 0 5.08 22.42L3.4 28.6l6.32-1.66A12.7 12.7 0 1 0 16 3.25Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M12.4 10.1c-.28-.63-.57-.64-.84-.65h-.72c-.25 0-.66.09-1.01.47-.35.38-1.32 1.29-1.32 3.14s1.35 3.65 1.54 3.9c.19.25 2.6 4.16 6.43 5.67 3.18 1.25 3.83 1 4.52.94.69-.06 2.22-.91 2.54-1.79.31-.88.31-1.63.22-1.79-.1-.15-.35-.25-.73-.44-.38-.19-2.22-1.1-2.57-1.23-.35-.13-.6-.19-.85.19-.25.38-.97 1.23-1.19 1.48-.22.25-.44.28-.82.09-.38-.19-1.6-.59-3.05-1.88-1.13-1.01-1.89-2.26-2.11-2.64-.22-.38-.02-.59.17-.78.17-.17.38-.44.57-.66.19-.22.25-.38.38-.63.13-.25.06-.47-.03-.66-.09-.19-.82-2.04-1.13-2.73Z"
            fill="currentColor"
          />
        </svg>
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#0b1a33] px-3 py-2 text-xs font-semibold text-[#f5efe0] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
          Chat with us
        </span>
      </a>
    </div>
  );
}
