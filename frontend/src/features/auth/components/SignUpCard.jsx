"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DottedSeparator } from "@/components/DottedSeparator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema } from "../schemas";
import { useSignUp } from "../api/use-signup";

export function SignUpCard() {
  const { mutate: register, isPending: isRegistering } = useSignUp();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    register(data);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl py-4">Sign Up</CardTitle>
        <p>
          By signing up, you agree to the Terms of Service and Privacy Policy.
          &nbsp;
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>
          &nbsp; and&nbsp;
          <Link href="/terms">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </p>
      </CardHeader>
      <CardContent className="p-7">
        {/* Form wrapper */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            {/* Password Input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={isRegistering}
              type="submit"
              size="lg"
              className="w-full"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7 w-full h-full">
        {/* Separator */}
        <div className="border-t-2 border-gray-300 my-4" />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button size="lg" variant="secondary" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Sign Up with Google
        </Button>
        <Button size="lg" variant="secondary" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Sign Up with GitHub
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4 items-center justify-center">
        <p>
          Already have an account?
          <Link href="/sign-in">
            <span className="text-blue-700">&nbsp; Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
