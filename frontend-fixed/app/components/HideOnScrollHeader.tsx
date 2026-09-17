"use client";

import React, { useEffect, useState } from "react";

export default function HideOnScrollHeader({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolled down more than 100px, and we are scrolling down, hide it
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } 
      // If we scroll up, show it
      else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`sticky top-4 z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
