// src/app/components/navigation/Navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import {
  BookOpen,
  FileText,
  Skull,
  Info,
  Menu,
  X,
} from "lucide-react";

import styles from "./Navigation.module.css";

const items = [
  {
    label: "Books",
    subtitle: "Primary archive",
    href: "/pages/books",
    icon: BookOpen,
  },
  {
    label: "Shorts",
    subtitle: "Fragments",
    href: "/pages/shorts",
    icon: FileText,
  },
  {
    label: "Villains",
    subtitle: "Entity dossiers",
    href: "/pages/villains",
    icon: Skull,
  },
  {
    label: "About",
    subtitle: "Archive orientation",
    href: "/pages/about",
    icon: Info,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [theme, setTheme] = useState<
  "dark" | "light"
>("dark");

useEffect(() => {
  const saved =
    localStorage.getItem("theme");

  if (
    saved === "light" ||
    saved === "dark"
  ) {
    setTheme(saved);

    document.documentElement.setAttribute(
      "data-theme",
      saved
    );
  }
}, []);

const toggleTheme = () => {
  const next =
    theme === "dark"
      ? "light"
      : "dark";

  setTheme(next);

  localStorage.setItem(
    "theme",
    next
  );

  document.documentElement.setAttribute(
    "data-theme",
    next
  );
};

  // CLOSE MENU ON RESIZE TO DESKTOP
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1100) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      onResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        onResize
      );
  }, []);

  // LOCK BODY SCROLL WHEN MOBILE MENU OPEN
  useEffect(() => {
    if (open) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className={styles.mobileBar}>
        <button
          className={styles.mobileToggle}
          onClick={() =>
            setOpen(!open)
          }
          aria-label="Toggle navigation"
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

        <div
          className={styles.mobileLogo}
        >
          <span>Stephen King</span>
          <small>Universe</small>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`${styles.overlay} ${
          open ? styles.overlayOpen : ""
        }`}
        onClick={() =>
          setOpen(false)
        }
      />

      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${
          open ? styles.open : ""
        }`}
      >
        <div className={styles.glow} />
        <div className={styles.grain} />

        {/* HEADER */}
        <div className={styles.header}>
          <Link
            href="/"
            className={styles.logo}
            onClick={() =>
              setOpen(false)
            }
          >
            <span>Stephen</span>
            <span>King</span>

            <small>Universe</small>
          </Link>

          <div className={styles.status}>
            <span className={styles.dot} />
            ARCHIVE ACTIVE
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className={styles.nav}>
          {items.map((item) => {
            const Icon = item.icon;

            const active =
              pathname?.startsWith(
                item.href
              );

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.item} ${
                  active
                    ? styles.active
                    : ""
                }`}
                onClick={() =>
                  setOpen(false)
                }
              >
                <div
                  className={
                    styles.iconWrap
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                  />
                </div>

                <div
                  className={
                    styles.textWrap
                  }
                >
                  <span
                    className={
                      styles.label
                    }
                  >
                    {item.label}
                  </span>

                  <small
                    className={
                      styles.subtitle
                    }
                  >
                    {item.subtitle}
                  </small>
                </div>

                {active && (
                  <i
                    className={
                      styles.activeLine
                    }
                  />
                )}
              </Link>
            );
          })}
        </nav>
        {/* CONTROLS */}
        <div className={styles.themeSwitch}>
          <button
            className={styles.themeButton}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <>
                <Sun size={16} />
                  Official Archive
              </>
              ) : (
              <>
                <Moon size={16} />
                  Hidden Truth
              </>
            )}
          </button>
        </div>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <p>
            “Monsters are real, and ghosts
            are real too. They live inside
            us.”
          </p>

          <span>
            — Stephen King
          </span>
        </footer>
      </aside>
    </>
  );
}