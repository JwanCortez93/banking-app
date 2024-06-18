"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col  gap-4">
        <Link href={"/"} className="mb-12 cursor-pointer items-center gap-2">
          <Image
            className="size-200 flex-shrink-0"
            alt="SafeWallet Logo"
            src={"/logo/svg/logo-no-background.svg"}
            width={200}
            height={200}
          />
        </Link>
        {sidebarLinks.map((sidebarLink) => {
          const isActive =
            pathname === sidebarLink.route ||
            pathname.startsWith(`${sidebarLink.route}`);
          return (
            <Link
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
              })}
              href={sidebarLink.route}
              key={sidebarLink.label}
            >
              <div className="relative size-6">
                {isActive ? sidebarLink.activeIcon : sidebarLink.icon}
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {sidebarLink.label}
              </p>
            </Link>
          );
        })}
        <p className="text-gray-900">USER</p>
      </nav>
      <p className="text-gray-900">FOOTER</p>
    </section>
  );
};

export default Sidebar;
