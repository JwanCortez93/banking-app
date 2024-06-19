"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { SignUpParams } from "../../../../types";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "@/lib/utils";

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);

    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async (data: SignUpParams) => {
  const { email, password, firstName, lastName } = data;
  try {
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("Error", error);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
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
