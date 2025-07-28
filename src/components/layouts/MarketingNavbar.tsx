"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";

const items = [
  { name: "Home", link: "#home" },
  { name: "How it Works", link: "#how" },
  { name: "Demo", link: "#demo" },
];

export const MarketingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={items} />
        <NavbarButton href="#demo" variant="dark">
          Try Demo
        </NavbarButton>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          {items.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="text-base text-neutral-800 dark:text-white px-2 py-1"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <NavbarButton href="#demo" className="mt-2 w-full">
            Try
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};
