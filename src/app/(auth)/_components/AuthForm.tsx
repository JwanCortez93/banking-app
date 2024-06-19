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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../actions/users";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema =
    type === "sign-up" ? authFormSchemaSignUp : authFormSchemaSignIn;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      dateOfBirth: "",
      postalCode: "",
      ssn: "",
      state: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      } else {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href={"/"} className="mb-2 cursor-pointer items-center gap-2">
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
                <>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="ex: John"
                      type="text"
                    />
                    <CustomFormField
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="ex: Doe"
                      type="text"
                    />
                  </div>
                  <CustomFormField
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                    type="text"
                  />
                  <CustomFormField
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                    type="text"
                  />
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="ex: NY"
                      type="text"
                    />
                    <CustomFormField
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="ex: 14171"
                      type="text"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomFormField
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                      type="text"
                    />
                    <CustomFormField
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                      type="text"
                    />
                  </div>
                </>
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
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
