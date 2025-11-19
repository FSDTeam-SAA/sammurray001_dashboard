/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, ChangeEvent } from "react";
import userImage from "@../../../public/Images/sum-user.jpg";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface UserFormType {
  fullName: string;
  email: string;
  username: string;
  phoneCode: string;
  phoneNumber: string;
  bio: string;
}

interface UpdatePayload {
  fullName: string;
  email: string;
  username: string;
  phone: string;
  bio: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    _id: string;
    fullName: string;
    email: string;
    username?: string;
    profileImage?: string;
    bio?: string;
    phone?: string;
    [key: string]: any;
  };
}

function PersonalInformationUpdate() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data: userData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["user-data"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return res.json();
    },
    enabled: !!TOKEN,
  });


  const [form, setForm] = useState<UserFormType>({
    fullName: "",
    email: "",
    username: "",
    phoneCode: "+1",
    phoneNumber: "",
    bio: "",
  });


  useEffect(() => {
    if (userData?.data) {
      const phone: string = userData.data.phone || "";

      // Extract first +code
      const phoneCodeMatch = phone.match(/^\+\d+/);
      const phoneCode = phoneCodeMatch ? phoneCodeMatch[0] : "+1";

      // Remove first phone code from string to get remaining number
      const phoneNumber = phone.replace(phoneCode, "").trim();

      setForm({
        fullName: userData.data.fullName || "",
        email: userData.data.email || "",
        username: userData.data.fullName || "",
        phoneCode,
        phoneNumber,
        bio: userData.data.bio || "",
      });
    }
  }, [userData]);

  const updateMutation = useMutation({
    mutationFn: async (bodyData: UpdatePayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Something went wrong. Try again!");
    },
  });


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleReset = () => {
    if (userData?.data) {
      const phone: string = userData.data.phone || "";
      const phoneCodeMatch = phone.match(/^\+\d+/);
      const phoneCode = phoneCodeMatch ? phoneCodeMatch[0] : "+1";
      const phoneNumber = phone.replace(phoneCode, "").trim();

      setForm({
        fullName: userData.data.fullName || "",
        email: userData.data.email || "",
        username: userData.data.fullName || "",
        phoneCode,
        phoneNumber,
        bio: userData.data.bio || "",
      });
    }
  };


  const handleUpdate = () => {
    updateMutation.mutate({
      fullName: form.fullName,
      email: form.email,
      username: form.username,
      phone: `${form.phoneCode}${form.phoneNumber}`,
      bio: form.bio,
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="space-y-6">
        {/* Profile Picture */}
        <div>
          <div className="relative w-[150px] h-[150px]">
            <Image
              width={400}
              height={400}
              src={userData?.data?.profileImage || userImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full name
            </label>
            <Input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full h-[50px] bg-[#EDF2F6]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              readOnly
              disabled
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-[50px] bg-[#EDF2F6]"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <Input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full h-[50px] bg-[#EDF2F6]"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                name="phoneCode"
                value={form.phoneCode}
                onChange={handleChange}
                className="w-16 h-[50px] bg-[#EDF2F6]"
              />
              <Input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="flex-1 h-[50px] bg-[#EDF2F6]"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <Textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write your Bio here..."
            className="w-full min-h-[120px] resize-none bg-[#EDF2F6]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            className="bg-teal-600 w-[200px] hover:bg-teal-700 text-white px-8"
            onClick={handleUpdate}
          >
            Update Profile
          </Button>

          <Button
            variant="outline"
            className="px-8 w-[200px]"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInformationUpdate;
