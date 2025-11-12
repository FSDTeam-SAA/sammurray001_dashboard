"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LogOut, Grip, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import logoImage from "@/../../public/Images/sam-logo.jpg";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Requested Products",
    href: "/requested-product",
    icon: LayoutDashboard,
  },
  {
    name: "Approved Products",
    href: "/approved-product",
    icon: LayoutDashboard,
  },
  { name: "Main Category", href: "/category", icon: Grip },
  { name: "Sub Category", href: "/sub-category", icon: ShoppingBasket },
  { name: "SR Category List", href: "/sr-category", icon: ShoppingBasket },
  {
    name: "SR Sub Category List",
    href: "/sr-sub-category",
    icon: ShoppingBasket,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen sticky bottom-0 top-0 w-[312px] flex-col bg-[#070E28] z-50">
      {/* Logo */}
      <div className="flex items-center justify-start shadow-md ml-3 h-[80px] mt-3">
        <div className="text-2xl flex gap-1 font-bold text-blue-600 uppercase tracking-wider w-full">
          <div className="">
            <Image
              src={logoImage}
              alt="Logo"
              height={200}
              width={200}
              className="h-full w-[90%] mx-auto object-cover rounded-md"
            />
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-4 flex flex-col items-center justify-start px-3 overflow-y-auto mt-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex w-[90%] mx-auto items-center justify-start gap-2 space-y-1 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#0D9488] text-white"
                  : "text-slate-300 hover:bg-slate-600/50 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isActive ? "text-white" : ""
                )}
              />
              <span
                className={cn(
                  "font-semibold text-base leading-[150%] transition-colors duration-200 text-center",
                  isActive ? "text-white font-medium" : ""
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout fixed at bottom */}
      <div className="p-3">
        <div className="flex items-center justify-start space-y-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-600/50 hover:text-white cursor-pointer">
          <LogOut className="h-5 w-5" />
          <span className="font-normal text-base leading-[120%]">Log Out</span>
        </div>
      </div>
    </div>
  );
}
