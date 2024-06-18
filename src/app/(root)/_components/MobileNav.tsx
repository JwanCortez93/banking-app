"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side={"left"} className="bg-white border-none">
          <Link href={"/"} className="mb-6 cursor-pointer items-center  ">
            <Image
              alt="SafeWallet Logo"
              src={"/logo/svg/logo-no-background.svg"}
              width={200}
              height={200}
            />
          </Link>
          <div className="mobilenav-sheet ">
            <SheetClose asChild>
              <nav className="h-full flex flex-col gap-4 pt-8 w-full ">
                {sidebarLinks.map((sidebarLink) => {
                  const isActive =
                    pathname === sidebarLink.route ||
                    pathname.startsWith(`${sidebarLink.route}`);
                  return (
                    <SheetClose asChild key={sidebarLink.label}>
                      <Link
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                        href={sidebarLink.route}
                      >
                        <div className="relative size-6">
                          {isActive ? sidebarLink.activeIcon : sidebarLink.icon}
                        </div>
                        <p
                          className={cn("sidebar-label", {
                            "!text-white": isActive,
                          })}
                        >
                          {sidebarLink.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>
            FOOTER
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
