"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

interface SignInFormData {
  email: string;
  password: string;
}

export default function LoginPage({
  onSwitchToRegister,
  onSwitchToForgotPassword,
}: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { register, handleSubmit } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res) throw new Error("Login failed!");
      if (res.error) throw new Error(res.error);

      toast.success("Login Successful!");

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Form */}
      <div className="flex-1 flex items-center justify-center bg-[#00000066] p-6">
        <div className="bg-[#FFFFFF33]/20 rounded-xl px-3 lg:p-8 space-y-6 w-full max-w-md">
          {/* Header */}
          <div>
            <h2 className="text-[25px] lg:text-[40px] font-bold mb-2 bg-gradient-to-r from-[#0078B8] to-[#229F99] text-transparent bg-clip-text">
              Hello, Welcome!
            </h2>
            <p className="text-[#FFFFFF] text-sm lg:text-base">
              Please enter your details below to continue
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-[#FFFFFF] text-sm lg:text-base mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="hello@example.com"
                {...register("email", { required: true })}
                className="border-[#BFBFBF] text-white placeholder:text-[#BFBFBF] h-[35px] lg:h-[51px] rounded-[4px]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#FFFFFF] text-sm lg:text-base mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: true })}
                  className="border-[#BFBFBF] text-white placeholder:text-[#BFBFBF] h-[35px] lg:h-[51px] rounded-[4px] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="remember"
                className="flex items-center text-[#BFBFBF] text-xs lg:text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-[#2c3d5c] border-gray-600 rounded mr-2"
                />
                Remember me now
              </label>

              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="bg-gradient-to-r from-[#0078B8] to-[#229F99] text-transparent bg-clip-text text-xs lg:text-sm font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[35px] lg:h-[51px] text-white font-semibold rounded-lg text-sm lg:text-base"
              style={{
                background: `linear-gradient(90deg, #0078B8 0%, #229F99 101.35%), 
                             linear-gradient(338.72deg, rgba(0,118,180,0.2) 14.2%, rgba(51,164,150,0.2) 83.33%)`,
                backgroundBlendMode: "overlay",
              }}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs lg:text-sm text-gray-300 pb-4">
            Don’t have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="flex-1 hidden lg:block">
        <Image
        width={500}
        height={500}
          src="/Images/sammu-auth-image.png"
          alt="Auth Image"
          className="w-full h-screen object-cover rounded-l-xl"
        />
      </div>
    </div>
  );
}
