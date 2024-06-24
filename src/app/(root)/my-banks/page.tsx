import { getLoggedInUser } from "@/app/(auth)/_actions/users";
import HeaderBox from "../_components/HeaderBox";
import { getAccounts } from "../_actions/banks";
import { Account } from "../../../../types";
import BankCard from "../_components/BankCard";

const MyBanks = async () => {
  const loggedInUser = await getLoggedInUser();

  const accounts = await getAccounts({ userId: loggedInUser?.$id });
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlesly manage your banking activities."
        />
        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((account: Account) => (
                <BankCard
                  key={account.id}
                  account={account}
                  userName={loggedInUser?.firstName}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
