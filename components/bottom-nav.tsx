"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";

const items = [
  { href: "/home", label: "Home", icon: "home-2" },
  { href: "/explore", label: "Explore", icon: "discover-1" },
  { href: "/style-me", label: "Style Me", icon: "magic-star", featured: true },
  { href: "/saved", label: "Saved", icon: "bookmark" },
  { href: "/profile", label: "Profile", icon: "profile-circle" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active ? "active" : ""} ${item.featured ? "style-me" : ""}`}
          >
            <Icon name={item.icon} active={active} size={21} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
