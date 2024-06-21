import Image from "next/image";
import Sidebar from "./_components/Sidebar";
import MobileNav from "./_components/MobileNav";
import { userMock } from "@/lib/mocks";
import { getLoggedInUser } from "../(auth)/_actions/users";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    redirect("/sign-in");
  }

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedInUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            alt="SafeWallet Logo"
            src={"/logo/svg/logo-no-background.svg"}
            height={150}
            width={150}
          />
          <div>
            <MobileNav user={loggedInUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
