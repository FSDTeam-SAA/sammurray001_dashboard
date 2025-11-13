import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
                defaultValue="********"
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
                defaultValue="********"
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
              defaultValue="********"
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
          <Button className="bg-teal-600 w-[150px] hover:bg-teal-700 text-white px-8">
            Update Profile
          </Button>
          <Button variant="outline" className="px-8 w-[150px]">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword