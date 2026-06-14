"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

interface NavBarProps {
  activeLink?: "dashboard" | "beginner" | "sources" | "skills" | "videos" | "protocole";
  tier?: string | null;
  displayName?: string;
  displayEmail?: string;
  initials?: string;
  onFondationsClick?: () => void;
  onStackClick?: () => void;
}

export function NavBar({
  activeLink,
  tier,
  displayName,
  displayEmail,
  initials,
  onFondationsClick,
  onStackClick,
}: NavBarProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    const supabase = createClient();

    try {
      await fetch("/api/signout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      }).catch(() => null);
      await supabase.auth.signOut({ scope: "local" }).catch(() => null);
    } finally {
      window.location.href = "/login";
    }
  };

  const linkClass = (link: string) =>
    activeLink === link
      ? "text-[#f0ede8] font-medium"
      : "text-white/40 hover:text-white/80 transition-colors";

  const hasFoundationAccess = tier === "beginner" || tier === "full" || tier === "admin";
  const hasFullAccess = tier === "full" || tier === "admin";

  const navLinks = (
    <>
      <Link href="/dashboard" className={linkClass("dashboard")} onClick={() => setIsMobileMenuOpen(false)}>
        Tableau de bord
      </Link>

      {hasFoundationAccess ? (
        <Link href="/beginner" className={`${linkClass("beginner")} flex items-center gap-1.5`} onClick={() => setIsMobileMenuOpen(false)}>
          <GraduationCap className="w-3.5 h-3.5" /> Fondations
        </Link>
      ) : (
        <button
          onClick={() => { setIsMobileMenuOpen(false); onFondationsClick?.(); }}
          className="text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5 bg-transparent border-none font-[inherit] text-sm cursor-pointer"
        >
          <GraduationCap className="w-3.5 h-3.5" /> Fondations
        </button>
      )}

      {hasFoundationAccess ? (
        <Link href="/sources" className={linkClass("sources")} onClick={() => setIsMobileMenuOpen(false)}>
          La stack
        </Link>
      ) : (
        <button
          onClick={() => { setIsMobileMenuOpen(false); onStackClick?.(); }}
          className="text-white/40 hover:text-white/80 transition-colors bg-transparent border-none font-[inherit] text-sm cursor-pointer"
        >
          La stack
        </button>
      )}

      {hasFoundationAccess && (
        <Link href="/protocole" className={linkClass("protocole")} onClick={() => setIsMobileMenuOpen(false)}>
          Protocole Zéro
        </Link>
      )}

      <Link href="/skills" className={linkClass("skills")} onClick={() => setIsMobileMenuOpen(false)}>
        Skills
      </Link>

      <Link href="/videos" className={linkClass("videos")} onClick={() => setIsMobileMenuOpen(false)}>
        Vidéos
      </Link>

      {displayEmail === "mbebourasam@gmail.com" && (
        <Link href="/admin" className="text-white/30 hover:text-[#e8d5b0] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
          <ShieldCheck className="w-4 h-4" />
        </Link>
      )}
    </>
  );

  return (
    <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 md:py-6 px-4 md:px-12 relative z-20">
      <Logo layout="horizontal" className="h-6" hideText={false} />

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        {navLinks}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium text-[#e8d5b0] border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
          >
            {initials && initials !== "?" ? initials : <span className="w-3 h-3 rounded-full bg-white/20 animate-pulse" />}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-[#161618] border border-white/10 shadow-2xl rounded-xl p-2 w-48 z-50">
              {displayName && (
                <div className="px-2 pt-2 text-sm text-[#f0ede8] font-medium">{displayName}</div>
              )}
              <div className="px-2 pb-2 mb-2 text-xs text-white/40 border-b border-white/10">{displayEmail}</div>
              <button
                disabled={isSigningOut}
                className="w-full text-left px-2 py-1.5 text-sm text-[#f87171] hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                onClick={handleSignOut}
              >
                {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: hamburger + avatar */}
      <div className="flex md:hidden items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium text-[#e8d5b0] border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
          >
            {initials && initials !== "?" ? initials : <span className="w-3 h-3 rounded-full bg-white/20 animate-pulse" />}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-[#161618] border border-white/10 shadow-2xl rounded-xl p-2 w-48 z-50">
              {displayName && (
                <div className="px-2 pt-2 text-sm text-[#f0ede8] font-medium">{displayName}</div>
              )}
              <div className="px-2 pb-2 mb-2 text-xs text-white/40 border-b border-white/10">{displayEmail}</div>
              <button
                disabled={isSigningOut}
                className="w-full text-left px-2 py-1.5 text-sm text-[#f87171] hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                onClick={handleSignOut}
              >
                {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          )}
        </div>

        <div ref={mobileMenuRef} className="relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-[#f0ede8]" /> : <Menu className="w-4 h-4 text-[#f0ede8]" />}
          </button>

          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 bg-[#161618] border border-white/10 shadow-2xl rounded-xl p-3 w-52 z-50 flex flex-col gap-1">
              {navLinks}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
