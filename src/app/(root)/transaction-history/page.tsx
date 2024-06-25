import { getLoggedInUser } from "@/app/(auth)/_actions/users";
import { SearchParamProps } from "../../../../types";
import HeaderBox from "../_components/HeaderBox";
import { getAccount, getAccounts } from "../_actions/banks";
import { formatAmount } from "@/lib/utils";
import TransactionTable from "../_components/TransactionTable";
import Pagination from "../_components/Pagination";

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const loggedInUser = await getLoggedInUser();

  const accounts = await getAccounts({ userId: loggedInUser?.$id });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });
  const currentPage = Number(page as string) || 1;
  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <section className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
      </div>
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account?.data.officialName}</p>
            <p className="text-14 font-semibold tracking[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.data.mask}</span>
            </p>
          </div>
          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data.currentBalance)}
            </p>
          </div>
        </div>
        <section className="flex w-full flex-col gap-6">
          <TransactionTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default TransactionHistory;
