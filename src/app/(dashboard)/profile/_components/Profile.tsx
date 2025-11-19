"use client";

import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import PersonalInformationUpdate from "./PersonalInformationUpdate";

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
        <PersonalInformationUpdate />
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
