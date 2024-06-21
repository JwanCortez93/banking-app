import { Button } from "@/components/ui/button";
import { PlaidLinkProps } from "../../../../types";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "../_actions/users";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  console.log(
    "Step 8: We're in PlaidLink now. Props Data // User: ",
    user,
    "Variant: ",
    variant
  );

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };
    getLinkToken();
    console.log("Step 11: We set the link token // Set Token: ", token);
  }, [user]);

  const onSuccess = useCallback(
    async (public_token: string) => {
      console.log(
        "Step 13: After closing the window, on success, we'll recieve a public token // Public Token: ",
        public_token
      );
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });
      

      router.push("/");
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => {
            open();
            console.log(
              "Step 12: When clicked, open window to connect to Plaid"
            );
          }}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button>Connect Bank</Button>
      ) : (
        <Button>Connect Bank</Button>
      )}
    </>
  );
};

export default PlaidLink;
