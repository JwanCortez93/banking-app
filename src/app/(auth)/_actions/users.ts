"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import {
  CreateBankAccountProps,
  exchangePublicTokenProps,
  getBankProps,
  getBanksProps,
  getUserInfoProps,
  SignUpParams,
  User,
} from "../../../../types";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import {
  encryptId,
  extractCustomerIdFromUrl,
  parseStringify,
} from "@/lib/utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,

      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {}
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...data }: SignUpParams) => {
  const { email, firstName, lastName } = data;
  console.log(
    "Step 1: Props Data // Email: ",
    email,
    " FirstName: ",
    firstName,
    " LastName: ",
    lastName
  );

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();
    console.log(
      "Step 2: Create Admin Client (Appwrite) // Account: ",
      account,
      "Database: ",
      await database.listCollections(DATABASE_ID!)
    );

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    console.log(
      "Step 3: Create User Account (Auth) // NewUserAccount: ",
      newUserAccount
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...data,
      type: "personal",
    });

    console.log(
      "Step 4: Create Dwolla Customer // Dwolla Customer: ",
      dwollaCustomerUrl
    );

    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    console.log(
      "Step 5: Extract Dwolla Customer Id // Dwolla Customer Id: ",
      dwollaCustomerId
    );

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...data,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    console.log(
      "Step 6: Add User to database with dwolla info (Appwrite) // newUser: ",
      newUser
    );

    const session = await account.createEmailPasswordSession(email, password);

    console.log(
      "Step 7: Create Appwrite Session and set the cookie // Session: ",
      session.current
    );

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });
    console.log("Step 25: We get the logged user // User: ", user);

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const logOut = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");

    return await account.deleteSession("current");
  } catch (error) {
    console.error("Error", error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: CreateBankAccountProps) => {
  try {
    console.log(
      "Step 22: We pass the props to create the bank in our database. // Props: ",
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    const { database } = await createAdminClient();

    console.log(
      "Step 23: Once again, we create an AdminClient to connect to our database. // Database: ",
      await database.listCollections(DATABASE_ID!)
    );

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      { userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId }
    );

    console.log(
      "Step 24: We create the bank in our database // Bank: ",
      bankAccount
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    console.log(
      "Step 9: We're creating a Link Token // Params for it: ",
      tokenParams
    );

    const response = await plaidClient.linkTokenCreate(tokenParams);

    console.log(
      "Step 10: We create the token with Plaid // Token: ",
      response.data.link_token
    );

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    console.log(
      "Step 14: We use Plaid to exchange the public token for an access token and an Id // Access Token: ",
      response.data.access_token,
      " Id: ",
      response.data.item_id
    );

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    console.log(
      "Step 15: We find the account for that plaid user using the access token // Account data: ",
      accountsResponse.data.accounts[0]
    );

    const accountData = accountsResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    console.log(
      "Step 16: We prepare a request for a processor Token for Dwolla // Request: ",
      request
    );

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );

    console.log(
      "Step 17: We receive the proccessor token // Processor Token: ",
      processorTokenResponse.data.processor_token
    );

    const processorToken = processorTokenResponse.data.processor_token;

    console.log(
      "Step 18: We should have everything to add a Funding Source // Dwolla Customer Id: ",
      user.dwollaCustomerId,
      " Processor Token: ",
      processorToken,
      " Bank Name: ",
      accountData.name
    );

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error;

    console.log(
      "Step 21: We create the funding Source // Source URL: ",
      fundingSourceUrl
    );

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    console.log("Step 24: We redirect to the home page");

    revalidatePath("/");

    return parseStringify({
      publicTokenExchante: "complete",
    });
  } catch (error) {
    console.error("An error ocurred while creating exchanging token:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])]
    );

    return parseStringify(bank);
  } catch (error) {
    console.log(error);
  }
};
