import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { trackDownloadCtaClick, trackNavClick } from "@/lib/analytics";
import { Logo } from "./Logo";

const navLinks = [
  { href: "#how-it-works", label: "چطور کار می‌کند", target: "how-it-works" },
  { href: "#features", label: "ویژگی‌ها", target: "features" },
  { href: "#faq", label: "سوالات متداول", target: "faq" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_var(--gray-200)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="text-black">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => trackNavClick(l.target, "header")}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/download"
            onClick={() => trackDownloadCtaClick("header")}
            className="inline-flex items-center rounded-lg border-[1.5px] border-black bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
          >
            دانلود اپلیکیشن
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[color:var(--gray-200)] bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  trackNavClick(l.target, "header_mobile");
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/download"
              onClick={() => {
                trackDownloadCtaClick("header_mobile");
                setOpen(false);
              }}
              className="mt-2 inline-flex items-center justify-center rounded-lg border-[1.5px] border-black bg-white px-4 py-3 text-sm font-semibold text-black"
            >
              دانلود اپلیکیشن
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
