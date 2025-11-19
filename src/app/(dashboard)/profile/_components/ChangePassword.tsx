"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data: session } = useSession();
    const TOKEN = session?.user?.accessToken;

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (form.newPassword !== form.confirmPassword) {
        throw new Error("New password and confirm password do not match");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            oldPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      router.push("/login")
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleUpdate = () => {
    changePasswordMutation.mutate();
  };

  return (
    <div className="">
      <div className="space-y-6">
        {/* Current Password and New Password Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full pr-10 h-[50px] bg-[#EDF2F6]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full pr-10 h-[50px] bg-[#EDF2F6]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="max-w-[calc(50%-12px)]">
          <label className="block text-sm text-start font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full pr-10 h-[50px] bg-[#EDF2F6]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleUpdate}
            className="bg-teal-600 w-[150px] hover:bg-teal-700 text-white px-8"
          >
            Update Profile
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-8 w-[150px]"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
