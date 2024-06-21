import { LogOut } from "lucide-react";
import { FooterProps } from "../../../../types";
import { logOut } from "@/app/(auth)/_actions/users";
import { useRouter } from "next/navigation";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();
  const handleLogOut = async () => {
    const loggedOut = await logOut();

    if (loggedOut) {
      router.push("/sign-in");
    }
  };

  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user.name[0]}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate font-semibold text-gray-700">
          {user.name}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {user.email}
        </p>
      </div>
      <div className="ml-2 cursor-pointer" onClick={handleLogOut}>
        <LogOut className="w-8 h-auto text-red-600 bg-white rounded-full p-1 duration-200 hover:bg-red-500 hover:text-white " />
      </div>
    </footer>
  );
};

export default Footer;
