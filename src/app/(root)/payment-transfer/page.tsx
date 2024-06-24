import { getLoggedInUser } from "@/app/(auth)/_actions/users";
import HeaderBox from "../_components/HeaderBox";
import PaymentTransferForm from "./_components/PaymentTransferForm";
import { getAccounts } from "../_actions/banks";

const PaymentTransfer = async () => {
  const loggedInUser = await getLoggedInUser();

  const accounts = await getAccounts({ userId: loggedInUser?.$id });

  if (!accounts) return;

  const accountsData = accounts?.data;
  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default PaymentTransfer;
