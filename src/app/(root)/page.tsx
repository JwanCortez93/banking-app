import HeaderBox from "@/app/(root)/_components/HeaderBox";
import TotalBalanceBox from "@/app/(root)/_components/TotalBalanceBox";
import RightSidebar from "./_components/RightSidebar";
import { bank, firstAccount, secondAccount, userMock } from "@/lib/mocks";

const Home = () => {
  return (
    <section className="no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="no-scrollbar flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <header className="flex flex-col justify-between gap-8">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={userMock?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>
      </div>
      <RightSidebar
        user={userMock}
        transactions={[]}
        banks={[
          { ...bank, ...firstAccount },
          { ...bank, ...secondAccount },
        ]}
      />
    </section>
  );
};

export default Home;
