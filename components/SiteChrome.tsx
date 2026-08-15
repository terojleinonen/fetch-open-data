"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navigation = [
  ["01", "Entrance", "/"],
  ["02", "Literary works", "/works"],
  ["03", "Characters", "/characters"],
  ["04", "Antagonists", "/antagonists"],
  ["05", "Places", "/places"],
  ["06", "Screen", "/adaptations"],
  ["07", "Timeline", "/timeline"],
  ["08", "Research archive", "/sources"],
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    document.documentElement.classList.add("navigation-open");
    panel?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"),
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("navigation-open");
      document.removeEventListener("keydown", onKeyDown);
      (previous || trigger)?.focus();
    };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#primary-content">
        Skip to main content
      </a>
      <header className="mobile-header">
        <button
          ref={triggerRef}
          className="mobile-menu-trigger"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-archive-menu"
          onClick={() => setOpen(true)}
        >
          <i aria-hidden="true">
            <span />
            <span />
          </i>
          <b>INDEX</b>
          <small>01—08</small>
        </button>
        <Link
          className="mobile-wordmark"
          href="/"
          aria-label="Stephen King Universe, home"
        >
          <span>S</span>
          <i>K</i>
          <b>
            STEPHEN KING
            <br />
            UNIVERSE
          </b>
        </Link>
        <ThemeToggle />
      </header>
      <button
        className={`mobile-menu-scrim ${open ? "is-open" : ""}`}
        type="button"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panelRef}
        id="mobile-archive-menu"
        className={`mobile-navigation ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Archive navigation"
        aria-hidden={!open}
      >
        <header>
          <span>ARCHIVE INDEX</span>
          <small>FIELD REGISTER / 01—08</small>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <i aria-hidden="true" />
          </button>
        </header>
        <nav aria-label="Primary navigation">
          {navigation.map(([number, label, href]) => (
            <Link
              href={href}
              key={href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(pathname, href) ? "page" : undefined}
            >
              <small>{number}</small>
              <span>{label}</span>
              <i aria-hidden="true">↗</i>
            </Link>
          ))}
        </nav>
        <footer>
          <blockquote>
            “The place exists before the story.
            <br />
            The story explains the place.”
          </blockquote>
          <ThemeToggle />
        </footer>
      </aside>
      <aside className="scholar-sidebar">
        <Link
          className="scholar-mark"
          href="/"
          aria-label="Stephen King Universe, home"
        >
          <span>S</span>
          <i>K</i>
        </Link>
        <div className="scholar-name">
          STEPHEN KING
          <br />
          UNIVERSE<small>SCHOLAR&apos;S EDITION</small>
        </div>
        <nav aria-label="Primary navigation">
          {navigation.map(([number, label, href]) => (
            <Link
              href={href}
              key={href}
              aria-current={isCurrent(pathname, href) ? "page" : undefined}
            >
              <small>{number}</small>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <blockquote>
          “The place exists before the story. The story explains the place.”
        </blockquote>
        <ThemeToggle />
      </aside>
    </>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-mark">
        SK<span>U</span>
      </div>
      <p>
        An independent structured reference experience.
        <br />
        Open and licensed material is attributed at claim level.
      </p>
      <div>
        <Link href="/works">Works</Link>
        <Link href="/characters">Characters</Link>
        <Link href="/adaptations">Adaptations</Link>
        <Link href="/sources">Sources & licenses</Link>
      </div>
    </footer>
  );
}
