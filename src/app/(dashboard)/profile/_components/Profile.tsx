"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import Image from "next/image";
import userImage from "@../../../public/Images/sum-user.jpg";
import ChangePassword from "./ChangePassword";

function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex gap-8 mb-16">
        <button
          onClick={() => setActiveTab("personal")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "personal" ? "text-teal-600" : "text-gray-400"
          }`}
        >
          Personal Information
          {activeTab === "personal" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "password" ? "text-teal-600" : "text-gray-400"
          }`}
        >
          Change Password
          {activeTab === "password" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
          )}
        </button>
      </div>

      {/* Personal Information Tab */}
      {activeTab === "personal" && (
        <div className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Profile Picture
            </label>
            <div className="relative w-[150px] h-[150px]">
              <Image
                width={400}
                height={400}
                src={userImage}
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
                defaultValue="David"
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
                defaultValue="David@untitledui.com"
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
                defaultValue="David"
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
                  defaultValue="+1"
                  className="w-16 h-[50px] bg-[#EDF2F6]"
                />
                <Input
                  type="text"
                  defaultValue="654-126-7922"
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
              placeholder="Write your Bio here e.g your hobbies, interests ETC"
              className="w-full min-h-[120px] resize-none bg-[#EDF2F6]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button className="bg-teal-600 w-[200px] hover:bg-teal-700 text-white px-8">
              Update Profile
            </Button>
            <Button variant="outline" className="px-8 w-[200px]">
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="text-center py-12 text-gray-500">
          <ChangePassword />
        </div>
      )}
    </div>
  );
}

export default Profile;
