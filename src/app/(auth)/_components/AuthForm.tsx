"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField from "./CustomFormField";
import { authFormSchemaSignIn, authFormSchemaSignUp } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema =
    type === "sign-up" ? authFormSchemaSignUp : authFormSchemaSignIn;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    await setTimeout(() => {
      console.log(values);
    }, 4000);
    setIsLoading(false);
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href={"/"} className="mb-12 cursor-pointer items-center gap-2">
          <Image
            className="size-200 flex-shrink-0"
            alt="SafeWallet Logo"
            src={"/logo/svg/logo-no-background.svg"}
            width={200}
            height={200}
          />
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* {PlaidLink} */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <CustomFormField
                  control={form.control}
                  name="username"
                  label="Username"
                  placeholder="SafeWalletUsername"
                  type="text"
                />
              )}
              <CustomFormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="mail@example.com"
                type="email"
              />
              <CustomFormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Password123!"
                type="password"
              />
              {type === "sign-up" && (
                <CustomFormField
                  control={form.control}
                  name="passwordConfirmation"
                  label="Repeat Password"
                  placeholder="*******"
                  type="password"
                />
              )}
              <Button
                className="form-btn w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : type === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Sign Un"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </section>
  );
};

export default AuthForm;
