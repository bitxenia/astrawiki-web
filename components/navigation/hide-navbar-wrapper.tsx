"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navigation/navbar";

export default function HideNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const hideNavbarRoutes = ["/"];
  const hideNavbar = hideNavbarRoutes.includes(usePathname());

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
