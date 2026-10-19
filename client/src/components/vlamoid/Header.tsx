import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Shell, X } from "lucide-react";

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#home"
      className={`wordmark ${footer ? "footer-wordmark" : ""}`}
      aria-label="Vlamoid, back to top"
    >
      <Shell className="brand-shell" strokeWidth={1.05} />
      <span>
        Vlamoid<span className="wordmark-dot">.</span>
      </span>
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);

  function closeMenu(targetId?: string) {
    setOpen(false);
    requestAnimationFrame(() => {
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      } else {
        toggle.current?.focus();
      }
    });
  }

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 35);
    update();
    window.addEventListener("scroll", update, { passive: true });
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileNav.current) {
        event.preventDefault();
        closeMenu();
      }
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header className={`site-header ${scrolled || open ? "solid-header" : ""}`}>
      <div className="header-inner">
        <Wordmark />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#menu">The menu</a>
          <a href="#story">Our story</a>
          <a href="#visit">Find us</a>
        </nav>
        <a className="header-reserve" href="#reservations">
          Reserve a table <ArrowUpRight size={15} />
        </a>
        <button
          type="button"
          ref={toggle}
          className="mobile-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          ref={mobileNav}
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <a href="#menu" onClick={() => closeMenu("menu")}>
            The menu
          </a>
          <a href="#story" onClick={() => closeMenu("story")}>
            Our story
          </a>
          <a href="#visit" onClick={() => closeMenu("visit")}>
            Find us
          </a>
          <a href="#reservations" onClick={() => closeMenu("reservations")}>
            Reserve a table <ArrowUpRight size={20} />
          </a>
        </nav>
      )}
    </header>
  );
}
