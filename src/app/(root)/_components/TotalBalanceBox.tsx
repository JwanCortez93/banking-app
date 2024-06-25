import { TotalBalanceBoxProps } from "../../../../types";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="flex w-full items-center gap-5 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Bank Accounts:{totalBanks}
        </h2>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">
            Total Current Balance:
          </p>
          <div className="text-2xl lg:text-3xl flex-1 font-semibold text-gray-900 flex justify-center items-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
