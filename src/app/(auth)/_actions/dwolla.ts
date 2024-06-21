"use server";

import { Client } from "dwolla-v2";
import {
  AddFundingSourceParams,
  CreateFundingSourceOptions,
  NewDwollaCustomerParams,
  TransferParams,
} from "../../../../types";

const getEnviornment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        'Dwolla environment should either be set to "sandbox" or "production"'
      );
  }
};

const dwollaClient = new Client({
  environment: getEnviornment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((response) => response.headers.get("location"));
  } catch (error) {
    console.error("Creating a Funding Source failed: ", error);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (error) {
    console.error("Creating an On Demand Authorization failed: ", error);
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post("customers", newCustomer)
      .then((response) => response.headers.get("location"));
  } catch (error) {
    console.error("Creating a Dwolla Customer failed: ", error);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        Currency: "USD",
        value: amount,
      },
    };
    return await dwollaClient
      .post("transfers", requestBody)
      .then((response) => response.headers.get("location"));
  } catch (error) {
    console.error("Transfer fund failed: ", error);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();

    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };

    return await createFundingSource(fundingSourceOptions);
  } catch (error) {
    console.error("Transfer fund failed: ", error);
  }
};
