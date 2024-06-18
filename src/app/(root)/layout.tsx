import Image from "next/image";
import Sidebar from "./_components/Sidebar";
import MobileNav from "./_components/MobileNav";
import { userMock } from "@/lib/mocks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={userMock} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            alt="SafeWallet Logo"
            src={"/logo/svg/logo-no-background.svg"}
            height={150}
            width={150}
          />
          <div>
            <MobileNav user={userMock} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
